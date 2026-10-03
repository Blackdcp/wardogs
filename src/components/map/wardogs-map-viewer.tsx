"use client";

import {useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent} from "react";
import {Crosshair, Hand, LoaderCircle, MapPin, Maximize2, Minimize2, RotateCcw, Ruler, Search, Share2, Trash2, X, ZoomIn, ZoomOut} from "lucide-react";
import type {Locale} from "@/config/site";
import {getOperationsAtlasCopy, getLocalizedOperationsAtlasRecords} from "@/features/maps/operations-atlas";
import {getMapViewerCopy} from "@/features/maps/map-viewer-copy";
import {beginMapPinch, boundView, defaultView, imagePoint, initialMapState, mapHash, mapIds, mapNames, mapPinchView, MAX_MARKERS, readMapHash, transformView, viewportPoint, type MapId, type MapMarker, type MapPinch, type MapState, type Point} from "@/features/maps/map-state";
import {initialMeasurement, measurementHash, placeMeasurementPoint, readMeasurementHash, type MapMeasurement} from "@/features/maps/map-measurement";
import {getMapMeasurementCopy} from "@/features/maps/map-measurement-copy";
import {MapMeasurementPanel} from "./map-measurement-panel";
import {assetPath} from "@/lib/assets";
import {publicRoutePath} from "@/lib/public-url";
import {ANALYTICS_EVENTS, trackAnalyticsEvent} from "@/lib/analytics-events";

type Props = {initialMap?: MapId; locale?: Locale; className?: string};
const controlClass = "inline-flex size-11 shrink-0 items-center justify-center rounded border border-[#43534a] bg-[#18231e] text-white hover:bg-[#304538] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#91d8ad] disabled:opacity-40 aria-pressed:bg-[#3b654b]";

export function WardogsMapViewer({initialMap = "bakurani", locale = "en", className = ""}: Props) {
  const [state, setState] = useState(() => initialMapState(initialMap));
  const stateRef = useRef(state);
  const markersByMap = useRef<Partial<Record<MapId, MapMarker[]>>>({});
  const [measurement, setMeasurement] = useState(() => initialMeasurement(initialMap));
  const measurementsByMap = useRef<Partial<Record<MapId, MapMeasurement>>>({});
  const [size, setSize] = useState({width: 1, height: 1});
  const [imageStatus, setImageStatus] = useState<{key: string; status: "ready" | "error"}>();
  const [attempt, setAttempt] = useState(0);
  const [fullscreen, setFullscreen] = useState<"native" | "fallback" | null>(null);
  const [mode, setMode] = useState<"pan" | "marker" | "measure" | "calibrate">("pan");
  const [panel, setPanel] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [shareLink, setShareLink] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fullscreenButtonRef = useRef<HTMLButtonElement>(null);
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<MapPinch | null>(null);
  const tap = useRef<{point: Point; moved: boolean} | null>(null);
  const id = useId();
  const imageKey = `${state.map}-${attempt}`;
  const load = imageStatus?.key === imageKey ? imageStatus.status : "loading";
  const copy = getMapViewerCopy(locale);
  const measurementCopy = getMapMeasurementCopy(locale);
  const measuring = mode === "measure" || mode === "calibrate";
  const atlasCopy = getOperationsAtlasCopy(locale);
  const records = getLocalizedOperationsAtlasRecords(locale);
  const view = boundView(state.view, size.width, size.height);
  const baseSize = Math.min(size.width, size.height);
  const visibleReferences = records.filter((record) => {
    const entry = atlasCopy.entries[record.id];
    return `${entry.title} ${entry.context} ${record.id}`.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim());
  });
  const updateState = useCallback((change: (previous: MapState) => MapState) => {
    const next = change(stateRef.current);
    markersByMap.current[next.map] = next.markers;
    stateRef.current = next;
    setState(next);
    setShareLink("");
  }, []);
  const updateMeasurement = useCallback((next: MapMeasurement) => {
    measurementsByMap.current[next.map] = next;
    setMeasurement(next);
    setShareLink("");
  }, []);

  useEffect(() => {
    const restore = () => {
      const result = readMapHash(window.location.hash);
      if (result.state) {
        updateState(() => result.state!);
        const ruler = readMeasurementHash(window.location.hash, result.state.map);
        updateMeasurement(ruler.state ?? initialMeasurement(result.state.map));
        if (ruler.state) setMode("measure");
        if (ruler.invalid) setNotice(getMapMeasurementCopy(locale).invalidLink);
      }
      if (result.invalid) setNotice(getMapViewerCopy(locale).invalid);
    };
    restore();
    window.addEventListener("hashchange", restore);
    return () => window.removeEventListener("hashchange", restore);
  }, [locale, updateState, updateMeasurement]);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const resize = () => setSize({width: element.clientWidth, height: element.clientHeight});
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    let active = true;
    const settle = () => {
      if (active) setImageStatus({key: imageKey, status: image.naturalWidth > 0 ? "ready" : "error"});
    };
    image.addEventListener("load", settle);
    image.addEventListener("error", settle);
    // Cached images may finish before hydration attaches their load handler.
    if (image.complete) queueMicrotask(settle);
    const timer = window.setTimeout(() => {
      if (active && !image.complete) setImageStatus({key: imageKey, status: "error"});
    }, 25_000);
    return () => {active = false; window.clearTimeout(timer); image.removeEventListener("load", settle); image.removeEventListener("error", settle);};
  }, [imageKey]);

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement === containerRef.current ? "native" : null);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  useEffect(() => {
    if (!fullscreen) return;
    const previousOverflow = document.body.style.overflow;
    const button = fullscreenButtonRef.current;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; button?.focus(); };
  }, [fullscreen]);

  // React wheel handlers may be passive. Only the map surface consumes wheel scrolling.
  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      const point = {x: event.clientX - rect.left, y: event.clientY - rect.top};
      updateState((previous) => ({...previous, view: transformView(boundView(previous.view, rect.width, rect.height), point, point, previous.view.zoom * (event.deltaY < 0 ? 1.15 : 1 / 1.15), rect.width, rect.height)}));
    };
    element.addEventListener("wheel", wheel, {passive: false});
    return () => element.removeEventListener("wheel", wheel);
  }, [updateState]);

  function resetPointers() { pointers.current.clear(); pinch.current = null; tap.current = null; }
  function zoom(direction: 1 | -1) {
    updateState((previous) => ({...previous, view: boundView({...previous.view, zoom: previous.view.zoom + direction * 0.35}, size.width, size.height)}));
  }
  function addMarker(point: Point) {
    if (load !== "ready" || point.x < 0 || point.x > 1 || point.y < 0 || point.y > 1) return;
    if (stateRef.current.markers.length >= MAX_MARKERS) { setNotice(copy.limit); return; }
    updateState((previous) => ({...previous, markers: [...previous.markers, {id: `m${crypto.randomUUID()}`, ...point, label: `${copy.marker} ${previous.markers.length + 1}`}]}));
    trackAnalyticsEvent(ANALYTICS_EVENTS.mapAction, {map_id: stateRef.current.map, action: "marker_added"});
    setPanel(true);
  }
  function addMeasurementPoint(point: Point) {
    if (load !== "ready" || !measuring) return;
    const current = measurementsByMap.current[stateRef.current.map] ?? initialMeasurement(stateRef.current.map);
    const next = placeMeasurementPoint(current, mode, point);
    updateMeasurement(next);
    if ((mode === "calibrate" ? next.reference : next.points).length === 2) {
      trackAnalyticsEvent(ANALYTICS_EVENTS.mapAction, {
        map_id: next.map,
        action: mode === "calibrate" ? "reference_set" : "measure",
        result: next.calibration ? "user_calibrated" : "pixels_only"
      });
    }
  }
  function localPoint(event: PointerEvent<HTMLDivElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect();
    return {x: event.clientX - rect.left, y: event.clientY - rect.top};
  }
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((event.pointerType === "mouse" && event.button !== 0) || pointers.current.size >= 2 || load !== "ready") return;
    const point = localPoint(event);
    pointers.current.set(event.pointerId, point);
    if (pointers.current.size === 1) tap.current = {point, moved: false};
    else if (tap.current) tap.current.moved = true;
    if (pointers.current.size === 2) {
      const [first, second] = [...pointers.current.values()];
      pinch.current = beginMapPinch(stateRef.current.view, first, second, size.width, size.height);
    }
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    const before = [...pointers.current.values()];
    const point = localPoint(event);
    pointers.current.set(event.pointerId, point);
    if (tap.current && Math.hypot(point.x - tap.current.point.x, point.y - tap.current.point.y) > 5) tap.current.moved = true;
    const after = [...pointers.current.values()];
    const start = pinch.current;
    updateState((previous) => ({...previous, view: start && after.length === 2
      ? mapPinchView(start, after[0], after[1], size.width, size.height)
      : transformView(boundView(previous.view, size.width, size.height), before[0], after[0], previous.view.zoom, size.width, size.height)}));
  }
  function onPointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    if (event.type === "pointerup" && pointers.current.size === 1 && tap.current && !tap.current.moved) {
      const point = imagePoint(localPoint(event), boundView(stateRef.current.view, size.width, size.height), size.width, size.height);
      if (mode === "marker") addMarker(point);
      else if (measuring) addMeasurementPoint(point);
    }
    pointers.current.delete(event.pointerId);
    pinch.current = null;
    if (!pointers.current.size) tap.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  async function toggleFullscreen() {
    resetPointers();
    if (document.fullscreenElement === containerRef.current) { await document.exitFullscreen().catch(() => undefined); return; }
    if (fullscreen) { setFullscreen(null); return; }
    try {
      if (!containerRef.current?.requestFullscreen) throw new Error("Fullscreen unsupported");
      await containerRef.current.requestFullscreen();
      setFullscreen("native");
    } catch { setFullscreen("fallback"); }
  }
  function onContainerKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && fullscreen === "fallback") { event.preventDefault(); setFullscreen(null); }
    if (event.key !== "Tab" || !fullscreen) return;
    const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, a[href], summary, [tabindex="0"]')].filter((element) => element.getClientRects().length);
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  async function share() {
    const url = new URL(window.location.href);
    url.pathname = publicRoutePath(`/${locale}/tools/map`);
    url.search = "";
    const shared = {...stateRef.current, view, markers: stateRef.current.markers.map((marker) => ({...marker, label: marker.label.trim() || copy.marker}))};
    const ruler = measurementsByMap.current[shared.map];
    url.hash = ruler ? measurementHash(mapHash(shared), ruler) : mapHash(shared);
    setShareLink(url.href);
    try {
      await navigator.clipboard.writeText(url.href);
      setNotice(copy.copied);
      trackAnalyticsEvent(ANALYTICS_EVENTS.mapAction, {map_id: shared.map, action: "share", result: "copied"});
    } catch {
      setNotice(copy.shareLink);
      trackAnalyticsEvent(ANALYTICS_EVENTS.mapAction, {map_id: shared.map, action: "share", result: "manual_copy"});
    }
  }

  return (
    <div ref={containerRef} aria-label={copy.map} aria-modal={fullscreen ? true : undefined} role={fullscreen ? "dialog" : "region"} onKeyDown={onContainerKey}
      className={`${fullscreen ? "fixed inset-0 z-[1000] flex h-dvh flex-col overflow-y-auto" : `relative ${className}`} w-full min-w-0 border border-[#43534a] bg-[#0c110f]`} data-map-viewer data-fullscreen={fullscreen ?? "off"}>
      <div className="flex flex-wrap items-center gap-2 border-b border-[#43534a] bg-[#101a15] p-2">
        <label className="sr-only" htmlFor={`${id}-map`}>{copy.map}</label>
        <select id={`${id}-map`} className="h-11 min-w-0 max-w-full rounded border border-[#43534a] bg-[#18231e] px-2 text-sm text-white" value={state.map}
          onChange={(event) => { const map = event.target.value as MapId; resetPointers(); updateState(() => ({...initialMapState(map), markers: markersByMap.current[map] ?? []})); updateMeasurement(measurementsByMap.current[map] ?? initialMeasurement(map)); setAttempt(0); setNotice(""); }}>
          {mapIds.map((map) => <option key={map} value={map}>{mapNames[map]}</option>)}
        </select>
        <div className="flex gap-1" role="group" aria-label={copy.map}>
          <button className={controlClass} title={copy.zoomIn} aria-label={copy.zoomIn} onClick={() => zoom(1)} disabled={view.zoom >= 6}><ZoomIn size={19} /></button>
          <button className={controlClass} title={copy.zoomOut} aria-label={copy.zoomOut} onClick={() => zoom(-1)} disabled={view.zoom <= 1}><ZoomOut size={19} /></button>
          <button className={controlClass} title={copy.reset} aria-label={copy.reset} onClick={() => {resetPointers(); updateState((previous) => ({...previous, view: {...defaultView}}));}}><RotateCcw size={19} /></button>
        </div>
        <div className="flex flex-wrap gap-1">
          <button className={controlClass} title={copy.pan} aria-label={copy.pan} aria-pressed={mode === "pan"} onClick={() => setMode("pan")}><Hand size={19} /></button>
          <button className={controlClass} title={copy.add} aria-label={copy.add} aria-pressed={mode === "marker"} onClick={() => setMode("marker")} disabled={load !== "ready"}><MapPin size={19} /></button>
          <button className={controlClass} title={copy.center} aria-label={copy.center} onClick={() => addMarker({x: view.x, y: view.y})} disabled={load !== "ready"}><Crosshair size={19} /></button>
          <button className={controlClass} title={copy.search} aria-label={copy.search} aria-expanded={panel} aria-controls={`${id}-panel`} onClick={() => setPanel(!panel)}><Search size={19} /></button>
          <button className={controlClass} title={copy.share} aria-label={copy.share} onClick={share}><Share2 size={19} /></button>
          <button ref={fullscreenButtonRef} className={controlClass} title={fullscreen ? copy.exitFullscreen : copy.fullscreen} aria-label={fullscreen ? copy.exitFullscreen : copy.fullscreen} onClick={toggleFullscreen}>{fullscreen ? <Minimize2 size={19} /> : <Maximize2 size={19} />}</button>
        </div>
      </div>
      <div ref={viewportRef} data-map-viewport tabIndex={0} aria-label={`${mapNames[state.map]} ${copy.map}`} aria-busy={load === "loading"}
        className={`relative w-full overflow-hidden touch-none select-none bg-[#080d0b] ${mode !== "pan" ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"} ${fullscreen ? "min-h-[280px] flex-1 shrink-0" : "h-[440px] md:h-[600px]"}`}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd} onLostPointerCapture={onPointerEnd}
        onKeyDown={(event) => {
          if (event.key === "+" || event.key === "=") { event.preventDefault(); zoom(1); }
          if (event.key === "-") { event.preventDefault(); zoom(-1); }
          if (event.key === "Enter" && mode === "marker") { event.preventDefault(); addMarker({x: view.x, y: view.y}); }
          if (event.key === "Enter" && measuring) { event.preventDefault(); addMeasurementPoint({x: view.x, y: view.y}); }
          const directions: Record<string, Point> = {ArrowLeft: {x: 45, y: 0}, ArrowRight: {x: -45, y: 0}, ArrowUp: {x: 0, y: 45}, ArrowDown: {x: 0, y: -45}};
          const direction = directions[event.key];
          if (direction) {event.preventDefault(); updateState((previous) => ({...previous, view: transformView(view, {x: 0, y: 0}, direction, view.zoom, size.width, size.height)}));}
        }}>
        <div data-map-content data-zoom={view.zoom} className="absolute left-0 top-0 origin-top-left" style={{width: baseSize, height: baseSize, transform: `translate3d(${size.width / 2 - view.x * baseSize * view.zoom}px, ${size.height / 2 - view.y * baseSize * view.zoom}px, 0) scale(${view.zoom})`}}>
          {/* Preserve the existing local WebP and public URL; no third-party tile requests. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imageRef} key={imageKey} alt={`WARDOGS ${mapNames[state.map]} map`} className="pointer-events-none size-full object-contain" draggable={false} height={2048} width={2048}
            src={`${assetPath(`/images/maps/${state.map}/overview.webp`)}${attempt ? `?retry=${attempt}` : ""}`} />
        </div>
        {load === "ready" && <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden="true" data-measurement-overlay>
          {([{points: measurement.reference, color: "#e7bd63", label: "R"}, {points: measurement.points, color: "#8ae9ef", label: ""}]).map(({points, color, label}) => {
            const projected = points.map((point) => viewportPoint(point, view, size.width, size.height));
            return <g key={label} data-measurement-segment={label || "distance"}>
              {projected.length === 2 && <line x1={projected[0].x} y1={projected[0].y} x2={projected[1].x} y2={projected[1].y} stroke={color} strokeWidth={3} strokeDasharray={label ? "6 4" : undefined} />}
              {projected.map((point, index) => <g key={index}><circle cx={point.x} cy={point.y} r={6} fill={color} stroke="#0c110f" strokeWidth={2} /><text x={point.x + 10} y={point.y - 10} fill={color} stroke="#0c110f" strokeWidth={3} paintOrder="stroke" fontSize={14}>{label}{index + 1}</text></g>)}
            </g>;
          })}
        </svg>}
        {load === "ready" && state.markers.map((marker, index) => <button key={marker.id} data-map-marker title={`${copy.manual}: ${marker.label}`} aria-label={marker.label}
          className="absolute z-10 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#ab3047] text-xs font-bold text-white"
          style={{left: size.width / 2 + (marker.x - view.x) * baseSize * view.zoom, top: size.height / 2 + (marker.y - view.y) * baseSize * view.zoom}}
          onPointerDown={(event) => event.stopPropagation()} onClick={() => {setPanel(true); requestAnimationFrame(() => document.getElementById(`${id}-${marker.id}`)?.focus());}}>{index + 1}</button>)}
        {load !== "ready" && <div className="absolute inset-0 flex items-center justify-center bg-[#080d0b]/90 p-6 text-center text-white" role={load === "error" ? "alert" : "status"}>
          <div>{load === "loading" && <LoaderCircle className="mx-auto mb-3 animate-spin" aria-hidden="true" />}<p>{load === "loading" ? copy.loading : copy.failed}</p>
            {load === "error" && <button className="mx-auto mt-4 flex min-h-11 items-center gap-2 rounded border border-[#81cba0] px-4" onClick={() => setAttempt((value) => value + 1)}><RotateCcw size={18} />{copy.retry}</button>}</div>
        </div>}
      </div>
      <div className="flex items-center gap-2 border-t border-[#35463b] p-3 text-xs text-[#d7bb73]">
        <button title={measurementCopy.measure} aria-label={measurementCopy.measure} aria-pressed={measuring} className={controlClass} disabled={load !== "ready"} onClick={() => {resetPointers(); setMode(measuring ? "pan" : "measure");}}><Ruler size={18} /></button><p>{measurement.calibration ? measurementCopy.calibrated : measurementCopy.uncalibrated}</p>
      </div>
      {measuring && <MapMeasurementPanel key={state.map} state={measurement} locale={locale} mode={mode} ready={load === "ready"}
        onChange={updateMeasurement} onMode={(next) => {resetPointers(); setMode(next);}} onCenter={() => addMeasurementPoint({x: view.x, y: view.y})} onClose={() => {resetPointers(); setMode("pan");}} />}
      <p role="status" className={notice ? "px-3 pb-3 text-sm text-[#b5e0c4]" : "sr-only"}>{notice}</p>
      {shareLink && <label className="block px-3 pb-3 text-sm text-[#bacbc0]">{copy.shareLink}<input aria-label={copy.shareLink} readOnly value={shareLink} onFocus={(event) => event.target.select()} className="mt-1 w-full min-w-0 rounded border border-[#46594d] bg-[#111b15] p-2" /></label>}
      {panel && <div id={`${id}-panel`} className="border-t border-[#35463b] p-3" data-map-reference-panel>
        <div className="mb-3 flex items-center gap-2"><label className="sr-only" htmlFor={`${id}-search`}>{copy.search}</label><input id={`${id}-search`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} className="h-11 min-w-0 flex-1 rounded border border-[#46594d] bg-[#111b15] px-3 text-white" /><button aria-label={copy.close} title={copy.close} className={controlClass} onClick={() => setPanel(false)}><X size={18} /></button></div>
        <div className="grid gap-6 md:grid-cols-2">
          <section><h3 className="text-sm font-semibold text-white">{copy.references}</h3><ul className="mt-2 space-y-3">{visibleReferences.map((record) => <li key={record.id} className="border-b border-[#35463b] pb-2 text-sm" data-map-reference>
            <a className="text-[#9adeb4] underline" href={publicRoutePath(`/${locale}/guides/${record.guideSlug}`)} title={atlasCopy.entries[record.id].title}>{atlasCopy.entries[record.id].title}</a><p className="my-1 text-xs text-[#d7bb73]">{copy.unlocated}</p><a className="break-words text-xs text-[#b8c8be]" href={record.evidence.sourceUrl} title={record.sourceLabel} rel="noreferrer" target="_blank">{record.sourceLabel}</a>
          </li>)}</ul>{!visibleReferences.length && <p className="mt-2 text-sm text-[#b8c8be]">{copy.empty}</p>}</section>
          <section><h3 className="text-sm font-semibold text-white">{copy.manual} ({state.markers.length}/{MAX_MARKERS})</h3><p className="mt-2 text-xs text-[#b8c8be]">{copy.privacy}</p>
            <ul className="mt-3 space-y-2">{state.markers.filter((marker) => marker.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).map((marker) => <li key={marker.id} className="flex gap-2">
              <input id={`${id}-${marker.id}`} aria-label={copy.label} maxLength={60} value={marker.label} className="min-w-0 flex-1 rounded border border-[#46594d] bg-[#111b15] px-2 text-sm text-white" onChange={(event) => {const label = event.target.value; updateState((previous) => ({...previous, markers: previous.markers.map((entry) => entry.id === marker.id ? {...entry, label} : entry)}));}} onBlur={() => updateState((previous) => ({...previous, markers: previous.markers.map((entry) => ({...entry, label: entry.label.trim() || copy.marker}))}))} />
              <button aria-label={`${copy.remove}: ${marker.label}`} title={copy.remove} className={controlClass} onClick={() => updateState((previous) => ({...previous, markers: previous.markers.filter(({id: markerId}) => markerId !== marker.id)}))}><Trash2 size={18} /></button>
            </li>)}</ul></section>
        </div>
      </div>}
      <details className="border-t border-[#35463b] p-3 text-xs leading-6 text-[#b8c8be]"><summary className="cursor-pointer">{copy.provenance} · {copy.version}</summary><p className="mt-2">{copy.source}</p><a className="text-[#9adeb4] underline" href={assetPath(`/images/maps/${state.map}/README.txt`)} title={`${mapNames[state.map]}: ${copy.notes}`} target="_blank" rel="noreferrer">{copy.notes}</a></details>
    </div>
  );
}
