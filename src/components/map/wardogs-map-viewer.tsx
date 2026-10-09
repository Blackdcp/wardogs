"use client";

import {useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent} from "react";
import {Crosshair, Hand, LoaderCircle, MapPin, Maximize2, Minimize2, RotateCcw, Ruler, Search, Share2, Trash2, X, ZoomIn, ZoomOut, Route as RouteIcon, Layers, Download, Upload, Undo2} from "lucide-react";
import type {Locale} from "@/config/site";
import {getOperationsAtlasCopy, getLocalizedOperationsAtlasRecords} from "@/features/maps/operations-atlas";
import {getMapViewerCopy} from "@/features/maps/map-viewer-copy";
import {beginMapPinch, boundView, defaultView, imagePoint, initialMapState, mapHash, mapIds, mapNames, mapPinchView, MAX_MARKERS, markerKinds, readMapHash, transformView, viewportPoint, type MapId, type MapMarker, type MarkerKind, type MapPinch, type MapState, type Point} from "@/features/maps/map-state";
import {initialMeasurement, measurementHash, placeMeasurementPoint, readMeasurementHash, type MapMeasurement} from "@/features/maps/map-measurement";
import {buildCalculatorSearch, calculateRouteDistanceMeters, calculateTacticalRange, initialTacticalPlan, placeRangePoint, placeRoutePoint, readTacticalPlanHash, tacticalPlanHash, toggleTacticalLayer, type TacticalPlan, exportMapPlan, importMapPlan, MAX_ROUTE_POINTS, setTacticalMissionPoint} from "@/features/maps/map-planner";
import {getMapPlannerCopy} from "@/features/maps/map-planner-copy";
import {COMMUNITY_POI_SOURCE, communityPois, communityPoiLayer, clusterCommunityPois, type CommunityPoi} from "@/features/maps/map-community-pois";
import {getArtilleryCopy} from "@/features/artillery/artillery-copy";
import {WEAPON_REGISTRY, type WeaponId, type TrajectoryMode} from "@/features/artillery/ballistics-data";
import {getMapMeasurementCopy} from "@/features/maps/map-measurement-copy";
import {MapMeasurementPanel} from "./map-measurement-panel";
import {assetPath} from "@/lib/assets";
import {Link} from "@/i18n/navigation";
import {publicRoutePath} from "@/lib/public-url";
import {ANALYTICS_EVENTS, trackAnalyticsEvent} from "@/lib/analytics-events";
import {useToolAnalytics} from "@/components/tools/use-tool-analytics";
import {isMarkedToolShare, markToolShare} from "@/features/tools/tool-analytics";

type Props = {initialMap?: MapId; locale?: Locale; className?: string};
const controlClass = "inline-flex size-11 shrink-0 items-center justify-center rounded border border-[#43534a] bg-[#18231e] text-white hover:bg-[#304538] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#91d8ad] disabled:opacity-40 aria-pressed:bg-[#3b654b]";

export function WardogsMapViewer({initialMap = "bakurani", locale = "en", className = ""}: Props) {
  const analytics = useToolAnalytics("map", locale);
  const [state, setState] = useState(() => initialMapState(initialMap));
  const stateRef = useRef(state);
  const markersByMap = useRef<Partial<Record<MapId, MapMarker[]>>>({});
  const [measurement, setMeasurement] = useState(() => initialMeasurement(initialMap));
  const measurementsByMap = useRef<Partial<Record<MapId, MapMeasurement>>>({});
  const [tacticalPlan, setTacticalPlan] = useState(() => initialTacticalPlan(initialMap));
  const tacticalPlansByMap = useRef<Partial<Record<MapId, TacticalPlan>>>({});
  const [size, setSize] = useState({width: 1, height: 1});
  const [imageStatus, setImageStatus] = useState<{key: string; status: "ready" | "error"}>();
  const [attempt, setAttempt] = useState(0);
  const [fullscreen, setFullscreen] = useState<"native" | "fallback" | null>(null);
  const [mode, setMode] = useState<"pan" | "marker" | "measure" | "calibrate" | "route" | "range">("pan");
  const [markerKind, setMarkerKind] = useState<MarkerKind>("intel");
  const [selectedPoi, setSelectedPoi] = useState<string>();
  const importRef = useRef<HTMLInputElement>(null);
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
  const plannerCopy = getMapPlannerCopy(locale);
  const artilleryCopy = getArtilleryCopy(locale);
  const measurementCopy = getMapMeasurementCopy(locale);
  const measuring = mode === "measure" || mode === "calibrate";
  const atlasCopy = getOperationsAtlasCopy(locale);
  const records = getLocalizedOperationsAtlasRecords(locale);
  const view = boundView(state.view, size.width, size.height);
  const baseSize = Math.min(size.width, size.height);
  const tacticalRange = calculateTacticalRange(tacticalPlan, state.map, measurement);
  const routeDistanceMeters = calculateRouteDistanceMeters(tacticalPlan.route.points, state.map, measurement);
  const poiLabel = (poi: CommunityPoi) => `${plannerCopy[poi.kind]} ${poi.number}`;
  const currentPois = communityPois.filter((poi) => poi.map === state.map);
  const visiblePois = currentPois.filter((poi) => `${poiLabel(poi)} ${poi.kind}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const layerEnabled = (layer: string) => tacticalPlan.layers.find(({id}) => id === layer)?.enabled;
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
  const updateTacticalPlan = useCallback((change: (previous: TacticalPlan) => TacticalPlan) => {
    const current = tacticalPlansByMap.current[stateRef.current.map] ?? initialTacticalPlan(stateRef.current.map);
    const next = change(current);
    tacticalPlansByMap.current[next.map] = next;
    setTacticalPlan(next);
    setShareLink("");
  }, []);

  useEffect(() => {
    const restore = () => {
      const result = readMapHash(window.location.hash);
      if (result.state) {
        updateState(() => result.state!);
        const ruler = readMeasurementHash(window.location.hash, result.state.map);
        updateMeasurement(ruler.state ?? initialMeasurement(result.state.map));
        const plan = readTacticalPlanHash(window.location.hash, result.state.map);
        if (!result.invalid && !ruler.invalid && !plan.invalid && isMarkedToolShare(window.location.search, "map")) analytics.openSharedResult();
        updateTacticalPlan(() => plan.state ?? initialTacticalPlan(result.state!.map));
        if (ruler.state) setMode("measure");
        if (plan.state?.fireSupport.points.length) setMode("range");
        if (ruler.invalid || plan.invalid) setNotice(getMapMeasurementCopy(locale).invalidLink);
      }
      if (result.invalid) setNotice(getMapViewerCopy(locale).invalid);
    };
    restore();
    window.addEventListener("hashchange", restore);
    return () => window.removeEventListener("hashchange", restore);
  }, [locale, analytics, updateState, updateMeasurement, updateTacticalPlan]);

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
      analytics.engage();
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      const point = {x: event.clientX - rect.left, y: event.clientY - rect.top};
      updateState((previous) => ({...previous, view: transformView(boundView(previous.view, rect.width, rect.height), point, point, previous.view.zoom * (event.deltaY < 0 ? 1.15 : 1 / 1.15), rect.width, rect.height)}));
    };
    element.addEventListener("wheel", wheel, {passive: false});
    return () => element.removeEventListener("wheel", wheel);
  }, [analytics, updateState]);

  function resetPointers() { pointers.current.clear(); pinch.current = null; tap.current = null; }
  function zoom(direction: 1 | -1) {
    analytics.engage();
    updateState((previous) => ({...previous, view: boundView({...previous.view, zoom: previous.view.zoom + direction * 0.35}, size.width, size.height)}));
  }
  function addMarker(point: Point, label?: string, kind: MarkerKind = markerKind) {
    if (load !== "ready" || point.x < 0 || point.x > 1 || point.y < 0 || point.y > 1) return;
    if (stateRef.current.markers.length >= MAX_MARKERS) { setNotice(copy.limit); return; }
    analytics.engage();
    updateState((previous) => ({...previous, markers: [...previous.markers, {id: `m${crypto.randomUUID()}`, ...point, label: label ?? `${copy.marker} ${previous.markers.length + 1}`, kind}]}));
    trackAnalyticsEvent(ANALYTICS_EVENTS.mapAction, {map_id: stateRef.current.map, action: "marker_added", locale});
    updateTacticalPlan((previous) => toggleTacticalLayer(previous, kind, true));
    setPanel(true);
  }
  function addMeasurementPoint(point: Point) {
    if (load !== "ready" || !measuring) return;
    analytics.engage();
    const current = measurementsByMap.current[stateRef.current.map] ?? initialMeasurement(stateRef.current.map);
    const next = placeMeasurementPoint(current, mode, point);
    updateMeasurement(next);
    if ((mode === "calibrate" ? next.reference : next.points).length === 2) {
      const params = {
        map_id: next.map,
        locale,
        action: mode === "calibrate" ? "reference_set" : "measure",
        result: next.calibration ? "user_calibrated" : "pixels_only"
      };
      trackAnalyticsEvent(ANALYTICS_EVENTS.mapAction, params);
      trackAnalyticsEvent(`${ANALYTICS_EVENTS.mapAction}_${params.action}`, {...params, legacy_compat: true});
    }
  }
  function addRoutePoint(point: Point) {
    if (load !== "ready") return;
    const current = tacticalPlansByMap.current[stateRef.current.map] ?? tacticalPlan;
    if (current.route.points.length >= MAX_ROUTE_POINTS) {setNotice(plannerCopy.routeLimit.replace("{limit}", String(MAX_ROUTE_POINTS))); return;}
    analytics.engage();
    updateTacticalPlan((previous) => placeRoutePoint(previous, point));
    setNotice("");
    trackAnalyticsEvent(ANALYTICS_EVENTS.mapAction, {map_id: stateRef.current.map, action: "route_point", locale});
  }
  function addRangePoint(point: Point) {
    if (load !== "ready") return;
    analytics.engage();
    updateTacticalPlan((previous) => placeRangePoint(previous, point));
    trackAnalyticsEvent(ANALYTICS_EVENTS.mapAction, {map_id: stateRef.current.map, action: "range_point", locale});
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
    analytics.engage();
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
      else if (mode === "route") addRoutePoint(point);
      else if (mode === "range") addRangePoint(point);
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
    analytics.beginShare();
    const url = new URL(window.location.href);
    url.pathname = publicRoutePath(`/${locale}/tools/map`);
    url.search = "";
    const shared = {...stateRef.current, view, markers: stateRef.current.markers.map((marker) => ({...marker, label: marker.label.trim() || copy.marker}))};
    const ruler = measurementsByMap.current[shared.map];
    const plan = tacticalPlansByMap.current[shared.map] ?? tacticalPlan;
    const baseHash = ruler ? measurementHash(mapHash(shared), ruler) : mapHash(shared);
    url.hash = tacticalPlanHash(baseHash, plan);
    if (url.hash.length > 16_000) {setNotice(plannerCopy.shareTooLarge); return;}
    markToolShare(url, "map");
    setShareLink(url.href);
    try {
      await navigator.clipboard.writeText(url.href);
      setNotice(copy.copied);
      trackAnalyticsEvent(ANALYTICS_EVENTS.mapAction, {map_id: shared.map, action: "share", result: "copied", locale});
    } catch {
      setNotice(copy.shareLink);
    }
  }

  function focusPoint(point: Point) {
    setPanel(false);
    viewportRef.current?.focus({preventScroll: true});
    updateState((previous) => ({...previous, view: boundView({zoom: 6, ...point}, size.width, size.height)}));
  }
  function setMissionPoint(point: Point, target: boolean) {
    const current = tacticalPlansByMap.current[stateRef.current.map] ?? tacticalPlan;
    if (target && !current.fireSupport.points[0]) {setNotice(plannerCopy.gunRequired); return;}
    updateTacticalPlan((previous) => setTacticalMissionPoint(previous, point, target ? "target" : "gun"));
    setNotice("");
    setMode("range"); setPanel(false);
  }
  function savePlanFile() {
    const cleanMap = {...state, markers: state.markers.map((marker) => ({...marker, label: marker.label.trim() || copy.marker}))};
    const text = exportMapPlan({format: "wardogs-map-plan", version: 1, map: cleanMap, ruler: measurement, plan: tacticalPlan});
    const url = URL.createObjectURL(new Blob([text], {type: "application/json"}));
    const link = document.createElement("a"); link.href = url; link.download = `wardogs-${state.map}-plan.json`; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    analytics.engage();
  }
  async function loadPlanFile(file?: File) {
    if (!file) return;
    if (file.size > 64_000) {setNotice(plannerCopy.invalidFile); return;}
    try {
      const restored = importMapPlan(await file.text());
      if (!restored) {setNotice(plannerCopy.invalidFile); return;}
      updateState(() => restored.map); updateMeasurement(restored.ruler); updateTacticalPlan(() => restored.plan);
      setMode("pan"); setNotice(plannerCopy.imported); analytics.engage();
    } catch {setNotice(plannerCopy.invalidFile);}
  }

  return (
    <div ref={containerRef} aria-label={copy.map} aria-modal={fullscreen ? true : undefined} role={fullscreen ? "dialog" : "region"} onKeyDown={onContainerKey} onChangeCapture={() => analytics.engage()}
      className={`${fullscreen ? "fixed inset-0 z-[1000] flex h-dvh flex-col overflow-y-auto" : `relative ${className}`} w-full min-w-0 border border-[#43534a] bg-[#0c110f]`} data-map-viewer data-fullscreen={fullscreen ?? "off"}>
      <div className="flex flex-wrap items-center gap-2 border-b border-[#43534a] bg-[#101a15] p-2">
        <label className="sr-only" htmlFor={`${id}-map`}>{copy.map}</label>
        <select id={`${id}-map`} className="h-11 min-w-0 max-w-full rounded border border-[#43534a] bg-[#18231e] px-2 text-sm text-white" value={state.map}
          onChange={(event) => { const map = event.target.value as MapId; resetPointers(); updateState(() => ({...initialMapState(map), markers: markersByMap.current[map] ?? []})); updateMeasurement(measurementsByMap.current[map] ?? initialMeasurement(map)); updateTacticalPlan(() => tacticalPlansByMap.current[map] ?? initialTacticalPlan(map)); setAttempt(0); setNotice(""); }}>
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
          <button className={controlClass} title={plannerCopy.routeTitle} aria-label={plannerCopy.routeTitle} aria-pressed={mode === "route"} onClick={() => setMode(mode === "route" ? "pan" : "route")} disabled={load !== "ready"}><RouteIcon size={19} /></button>
          <button className={controlClass} title={plannerCopy.rangeTitle} aria-label={plannerCopy.rangeTitle} aria-pressed={mode === "range"} onClick={() => setMode(mode === "range" ? "pan" : "range")} disabled={load !== "ready"}><Layers size={19} /></button>
          <button className={controlClass} title={copy.search} aria-label={copy.search} aria-expanded={panel} aria-controls={`${id}-panel`} onClick={() => setPanel(!panel)}><Search size={19} /></button>
          <button className={controlClass} title={copy.share} aria-label={copy.share} onClick={share}><Share2 size={19} /></button>
          <button ref={fullscreenButtonRef} className={controlClass} title={fullscreen ? copy.exitFullscreen : copy.fullscreen} aria-label={fullscreen ? copy.exitFullscreen : copy.fullscreen} onClick={toggleFullscreen}>{fullscreen ? <Minimize2 size={19} /> : <Maximize2 size={19} />}</button>
        </div>
      </div>
      <div ref={viewportRef} data-map-viewport tabIndex={0} aria-label={`${mapNames[state.map]} ${copy.map}`} aria-busy={load === "loading"}
        className={`relative w-full overflow-hidden touch-none select-none bg-[#080d0b] ${mode !== "pan" ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"} ${fullscreen ? "min-h-[280px] flex-1 shrink-0" : "h-[min(62dvh,440px)] min-h-[280px] md:h-[600px]"}`}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd} onLostPointerCapture={onPointerEnd}
        onKeyDown={(event) => {
          if (event.key === "+" || event.key === "=") { event.preventDefault(); zoom(1); }
          if (event.key === "-") { event.preventDefault(); zoom(-1); }
          if (event.key === "Enter" && mode === "marker") { event.preventDefault(); addMarker({x: view.x, y: view.y}); }
          if (event.key === "Enter" && measuring) { event.preventDefault(); addMeasurementPoint({x: view.x, y: view.y}); }
          if (event.key === "Enter" && mode === "route") { event.preventDefault(); addRoutePoint({x: view.x, y: view.y}); }
          if (event.key === "Enter" && mode === "range") { event.preventDefault(); addRangePoint({x: view.x, y: view.y}); }
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
        {load === "ready" && <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden="true" data-tactical-plan-overlay>
          {tacticalPlan.layers.find(({id}) => id === "routes")?.enabled && (() => {
            const points = tacticalPlan.route.points.map((point) => viewportPoint(point, view, size.width, size.height));
            return <g data-route-overlay>{points.length > 1 && <polyline points={points.map((point) => `${point.x},${point.y}`).join(" ")} fill="none" stroke="#f0b75f" strokeWidth={3} strokeDasharray="8 5" />}{points.map((point, index) => <g key={index}><circle cx={point.x} cy={point.y} r={5} fill="#f0b75f" stroke="#0c110f" strokeWidth={2} /><text x={point.x + 8} y={point.y - 8} fill="#f0b75f" stroke="#0c110f" strokeWidth={3} paintOrder="stroke" fontSize={13}>R{index + 1}</text></g>)}</g>;
          })()}
          {tacticalPlan.layers.find(({id}) => id === "fire-support")?.enabled && (() => {
            const points = tacticalPlan.fireSupport.points.map((point) => viewportPoint(point, view, size.width, size.height));
            return <g data-range-overlay>{points.length === 2 && <line x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y} stroke={tacticalRange?.solution.valid ? "#8ce2ad" : "#f87171"} strokeWidth={3} />}{points.map((point, index) => <g key={index}><circle cx={point.x} cy={point.y} r={6} fill={index === 0 ? "#10b981" : "#ef4444"} stroke="#0c110f" strokeWidth={2} /><text x={point.x + 9} y={point.y - 9} fill={index === 0 ? "#8ce2ad" : "#fca5a5"} stroke="#0c110f" strokeWidth={3} paintOrder="stroke" fontSize={13}>{index === 0 ? artilleryCopy.gunPosition : artilleryCopy.targetPosition}</text></g>)}</g>;
          })()}
        </svg>}
        {load === "ready" && tacticalPlan.communityPois !== false && clusterCommunityPois(currentPois.filter((poi) => layerEnabled(communityPoiLayer(poi)) && (poi.kind === "tower" || poi.kind === "spawn_board" || poi.id === selectedPoi || (poi.kind === "garage_vendor" && view.zoom >= 4))), baseSize * view.zoom).map((group) => {
          const poi = group.pois[0], clustered = group.pois.length > 1;
          const label = clustered ? `${plannerCopy.community} (${group.pois.length})` : poiLabel(poi);
          return <button key={group.pois.map(({id}) => id).join("-")} data-community-poi disabled={mode !== "pan"} title={`${plannerCopy.community}: ${label}`} aria-label={label}
            className={`absolute z-10 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center border-2 border-[#e7bd63] bg-[#18231e] text-xs font-bold text-[#fff1c8] ${clustered ? "rounded-full ring-2 ring-[#18231e]" : "rounded"}`}
            style={{pointerEvents: mode === "pan" ? "auto" : "none", left: size.width / 2 + (group.x - view.x) * baseSize * view.zoom, top: size.height / 2 + (group.y - view.y) * baseSize * view.zoom}}
            onPointerDown={(event) => event.stopPropagation()} onClick={() => {if (clustered) {focusPoint(group); return;} setSelectedPoi(poi.id); setQuery(poiLabel(poi)); setPanel(true);}}>{clustered ? `+${group.pois.length}` : poi.kind === "tower" ? poi.number : "◆"}</button>;
        })}
        {load === "ready" && state.markers.filter((marker) => layerEnabled(marker.kind ?? "intel")).map((marker, index) => <button key={marker.id} data-map-marker disabled={mode !== "pan"} data-clarity-mask="true" title={`${copy.manual}: ${marker.label}`} aria-label={marker.label}
          className="absolute z-10 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#ab3047] text-xs font-bold text-white"
          style={{pointerEvents: mode === "pan" ? "auto" : "none", left: size.width / 2 + (marker.x - view.x) * baseSize * view.zoom, top: size.height / 2 + (marker.y - view.y) * baseSize * view.zoom}}
          onPointerDown={(event) => event.stopPropagation()} onClick={() => {setPanel(true); requestAnimationFrame(() => document.getElementById(`${id}-${marker.id}`)?.focus());}}>{index + 1}</button>)}
        {load !== "ready" && <div className="absolute inset-0 flex items-center justify-center bg-[#080d0b]/90 p-6 text-center text-white" role={load === "error" ? "alert" : "status"}>
          <div>{load === "loading" && <LoaderCircle className="mx-auto mb-3 animate-spin" aria-hidden="true" />}<p>{load === "loading" ? copy.loading : copy.failed}</p>
            {load === "error" && <button className="mx-auto mt-4 flex min-h-11 items-center gap-2 rounded border border-[#81cba0] px-4" onClick={() => setAttempt((value) => value + 1)}><RotateCcw size={18} />{copy.retry}</button>}</div>
        </div>}
      </div>
      <div className="flex items-center gap-2 border-t border-[#35463b] p-3 text-xs text-[#d7bb73]">
        <button title={measurementCopy.measure} aria-label={measurementCopy.measure} aria-pressed={measuring} className={controlClass} disabled={load !== "ready"} onClick={() => {resetPointers(); setMode(measuring ? "pan" : "measure");}}><Ruler size={18} /></button><p>{measurement.calibration ? plannerCopy.userScale : plannerCopy.nominalScale}</p>
      </div>
      {measuring && <MapMeasurementPanel key={state.map} state={measurement} locale={locale} mode={mode} ready={load === "ready"}
        onChange={updateMeasurement} onMode={(next) => {resetPointers(); setMode(next);}} onCenter={() => addMeasurementPoint({x: view.x, y: view.y})} onClose={() => {resetPointers(); setMode("pan");}} />}
      {(mode === "route" || mode === "range") && <section className="max-h-[45dvh] overflow-y-auto border-t border-[#43534a] p-3 text-sm text-[#bacbc0] lg:max-h-none" data-tactical-planner-panel data-clarity-mask="true">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button className="min-h-11 rounded border border-[#43534a] px-3" onClick={() => mode === "route" ? addRoutePoint({x: view.x, y: view.y}) : addRangePoint({x: view.x, y: view.y})}>{plannerCopy.addCenter}</button>
          <button className={controlClass} title={plannerCopy.undo} aria-label={plannerCopy.undo} onClick={() => updateTacticalPlan((previous) => mode === "route" ? {...previous, route: {...previous.route, points: previous.route.points.slice(0, -1)}} : {...previous, fireSupport: {...previous.fireSupport, points: previous.fireSupport.points.slice(0, -1)}})}><Undo2 size={18} /></button>
          <button className={`${controlClass} ml-auto`} title={plannerCopy.closeTasks} aria-label={plannerCopy.closeTasks} onClick={() => setMode("pan")}><X size={18} /></button>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className={`${mode === "route" ? "" : "hidden lg:block"} rounded border border-[#34463b] bg-[#101a15] p-3`}>
            <div className="flex items-center justify-between gap-3">
              <div><h3 className="font-semibold text-white">{plannerCopy.routeTitle}</h3><p className="mt-1 text-xs text-[#8fa296]">{plannerCopy.routeHelp}</p></div>
              <button type="button" className={controlClass} title={plannerCopy.clearRoute} aria-label={plannerCopy.clearRoute} onClick={() => updateTacticalPlan((previous) => ({...previous, route: {...previous.route, points: []}}))}><Trash2 size={18} /></button>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-xs"><div><dt className="uppercase text-[#7f8d86]">{plannerCopy.points}</dt><dd className="font-mono text-lg text-white">{tacticalPlan.route.points.length}/{MAX_ROUTE_POINTS}</dd></div><div><dt className="uppercase text-[#7f8d86]">{plannerCopy.total}</dt><dd className="font-mono text-lg text-[#f0b75f]">{Math.round(routeDistanceMeters)}m</dd></div></dl>
          </div>
          <div className={`${mode === "range" ? "" : "hidden lg:block"} rounded border border-[#34463b] bg-[#101a15] p-3`}>
            <div className="flex items-center justify-between gap-3">
              <div><h3 className="font-semibold text-white">{plannerCopy.rangeTitle}</h3><p className="mt-1 text-xs text-[#8fa296]">{plannerCopy.rangeHelp}</p></div>
              <button type="button" className={controlClass} title={plannerCopy.clearRange} aria-label={plannerCopy.clearRange} onClick={() => updateTacticalPlan((previous) => ({...previous, fireSupport: {...previous.fireSupport, points: []}}))}><Trash2 size={18} /></button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <label className="min-w-0">{artilleryCopy.selectWeapon}<select value={tacticalPlan.fireSupport.weaponId} className="ml-2 min-h-11 rounded border border-[#43534a] bg-[#18231e] p-2" onChange={(event) => {const weaponId = event.target.value as WeaponId; updateTacticalPlan((previous) => ({...previous, fireSupport: {...previous.fireSupport, weaponId, mode: WEAPON_REGISTRY[weaponId].defaultMode}}));}}>{Object.values(WEAPON_REGISTRY).map((weapon) => <option key={weapon.id} value={weapon.id}>{weapon.name}</option>)}</select></label>
              {tacticalPlan.fireSupport.weaponId === "sph2" && <label>{artilleryCopy.trajectoryMode}<select value={tacticalPlan.fireSupport.mode} className="ml-2 min-h-11 rounded border border-[#43534a] bg-[#18231e] p-2" onChange={(event) => updateTacticalPlan((previous) => ({...previous, fireSupport: {...previous.fireSupport, mode: event.target.value as TrajectoryMode}}))}><option value="high">{artilleryCopy.highArc}</option><option value="low">{artilleryCopy.lowArc}</option></select></label>}
            </div>
            {tacticalRange ? <dl className="mt-3 grid grid-cols-2 gap-3 text-xs"><div><dt className="uppercase text-[#7f8d86]">{plannerCopy.distance}</dt><dd className="font-mono text-lg text-white">{tacticalRange.distanceMeters}m</dd></div><div><dt className="uppercase text-[#7f8d86]">{plannerCopy.azimuth}</dt><dd className="font-mono text-lg text-white">{tacticalRange.azimuthDegrees.toFixed(1)}°</dd></div><div><dt className="uppercase text-[#7f8d86]">{plannerCopy.mils}</dt><dd className="font-mono text-lg text-[#8ce2ad]">{tacticalRange.solution.valid ? tacticalRange.solution.elevationMil : "--"}</dd></div><div><dt className="uppercase text-[#7f8d86]">{plannerCopy.tof}</dt><dd className="font-mono text-lg text-[#d9a93a]">{tacticalRange.solution.valid ? `${tacticalRange.solution.timeOfFlightSeconds.toFixed(1)}s` : plannerCopy.outOfRange}</dd></div></dl> : <p className="mt-3 text-xs text-[#8fa296]">{plannerCopy.waiting}</p>}
            {tacticalRange ? <Link className="mt-3 inline-flex min-h-11 items-center rounded border border-[#528d68] bg-[#24583a] px-4 py-2 text-sm font-bold text-white hover:bg-[#2d6a46]" href={`/tools/artillery-calculator${buildCalculatorSearch(tacticalPlan, state.map, measurement)}`} title={plannerCopy.openCalculator}>{plannerCopy.openCalculator}</Link> : null}
          </div>
        </div>
        <p className="mt-3 text-xs text-[#d7bb73]">{plannerCopy.limits}</p>
        {mode === "range" && <p className="mt-2 text-xs text-[#d7bb73]">{plannerCopy.timingHelp}</p>}
        {tacticalRange?.lowerMeters !== undefined && tacticalRange.upperMeters !== undefined && <p className="mt-2 text-xs">{measurementCopy.bounds}: {Math.round(tacticalRange.lowerMeters)}–{Math.round(tacticalRange.upperMeters)} m</p>}
      </section>}
      <p role="status" className={notice ? "px-3 pb-3 text-sm text-[#b5e0c4]" : "sr-only"}>{notice}</p>
      {shareLink && <label data-clarity-mask="true" className="block px-3 pb-3 text-sm text-[#bacbc0]">{copy.shareLink}<input aria-label={copy.shareLink} readOnly value={shareLink} onFocus={(event) => event.target.select()} className="mt-1 w-full min-w-0 rounded border border-[#46594d] bg-[#111b15] p-2" /></label>}
      {panel && <div id={`${id}-panel`} className="max-h-[55dvh] overflow-y-auto border-t border-[#35463b] p-3 lg:max-h-[700px]" data-map-reference-panel data-clarity-mask="true">
        <div className="mb-3 flex items-center gap-2"><label className="sr-only" htmlFor={`${id}-search`}>{copy.search}</label><input id={`${id}-search`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} className="h-11 min-w-0 flex-1 rounded border border-[#46594d] bg-[#111b15] px-3 text-white" /><button aria-label={copy.close} title={copy.close} className={controlClass} onClick={() => setPanel(false)}><X size={18} /></button></div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <label className="text-sm text-[#bacbc0]">{plannerCopy.kind}<select value={markerKind} className="ml-2 min-h-11 rounded border border-[#43534a] bg-[#18231e] p-2" onChange={(event) => {setMarkerKind(event.target.value as MarkerKind); setMode("marker");}}>{markerKinds.map((kind) => <option key={kind} value={kind}>{plannerCopy[kind]}</option>)}</select></label>
          <button className={controlClass} title={plannerCopy.exportPlan} aria-label={plannerCopy.exportPlan} onClick={savePlanFile}><Download size={18} /></button>
          <button className={controlClass} title={plannerCopy.importPlan} aria-label={plannerCopy.importPlan} onClick={() => importRef.current?.click()}><Upload size={18} /></button>
          <input ref={importRef} aria-label={plannerCopy.importPlan} type="file" accept=".json,application/json" className="sr-only" onChange={(event) => {void loadPlanFile(event.target.files?.[0]); event.target.value = "";}} />
          <p className="basis-full text-xs text-[#bacbc0]">{plannerCopy.importHelp}</p>
        </div>
        <section className="mb-4 rounded border border-[#34463b] bg-[#101a15] p-3" data-map-layer-controls><h3 className="text-sm font-semibold text-white">{plannerCopy.layers}</h3><div className="mt-2 flex flex-wrap gap-2">{tacticalPlan.layers.map((layer) => <button key={layer.id} type="button" aria-pressed={layer.enabled} className="rounded border border-[#34463b] px-3 py-1.5 text-xs font-semibold text-[#cfe0d8] aria-pressed:border-[#69c78f] aria-pressed:bg-[#183322]" onClick={() => updateTacticalPlan((previous) => toggleTacticalLayer(previous, layer.id))}>{plannerCopy[layer.id]}</button>)}</div></section>
        <section className="mb-4 rounded border border-[#34463b] bg-[#101a15] p-3" data-community-poi-panel>
          <label className="flex min-h-11 items-center gap-2 font-semibold text-white"><input type="checkbox" checked={tacticalPlan.communityPois !== false} onChange={(event) => updateTacticalPlan((previous) => ({...previous, communityPois: event.target.checked}))} />{plannerCopy.community} ({currentPois.length})</label>
          <p className="text-xs leading-5 text-[#d7bb73]">{plannerCopy.communityHelp} <a href={COMMUNITY_POI_SOURCE} title="GitHub · Apollyon" target="_blank" rel="noreferrer" className="underline">GitHub · Apollyon</a> · <a href={assetPath("/licenses/apollyon-map-data.txt")} title="MIT" className="underline">MIT</a></p>
          <ul className="mt-3 grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-2">{visiblePois.map((poi) => <li key={poi.id} className={`rounded border p-2 ${selectedPoi === poi.id ? "border-[#e7bd63]" : "border-[#34463b]"}`}><button className="min-h-11 text-left text-sm font-semibold text-[#f3da8e]" onClick={() => {setSelectedPoi(poi.id); focusPoint(poi);}}>{poiLabel(poi)}</button><div className="flex flex-wrap gap-2 text-xs text-[#bacbc0]"><button className="min-h-11 rounded border border-[#43534a] px-2" onClick={() => addMarker(poi, poiLabel(poi), communityPoiLayer(poi))}>{plannerCopy.useMarker}</button><button className="min-h-11 rounded border border-[#43534a] px-2" onClick={() => {addRoutePoint(poi); setMode("route"); setPanel(false);}}>{plannerCopy.routePoint}</button></div></li>)}</ul>
        </section>
        <div className="grid gap-6 md:grid-cols-2">
          <section><h3 className="text-sm font-semibold text-white">{copy.references}</h3><ul className="mt-2 space-y-3">{visibleReferences.map((record) => <li key={record.id} className="border-b border-[#35463b] pb-2 text-sm" data-map-reference>
            <a className="text-[#9adeb4] underline" href={publicRoutePath(`/${locale}/guides/${record.guideSlug}`)} title={atlasCopy.entries[record.id].title}>{atlasCopy.entries[record.id].title}</a><p className="my-1 text-xs text-[#d7bb73]">{copy.unlocated}</p><a className="break-words text-xs text-[#b8c8be]" href={record.evidence.sourceUrl} title={record.sourceLabel} rel="noreferrer" target="_blank">{record.sourceLabel}</a>
          </li>)}</ul>{!visibleReferences.length && <p className="mt-2 text-sm text-[#b8c8be]">{copy.empty}</p>}</section>
          <section><h3 className="text-sm font-semibold text-white">{copy.manual} ({state.markers.length}/{MAX_MARKERS})</h3><p className="mt-2 text-xs text-[#b8c8be]">{copy.privacy}</p>
            {state.markers.length > 0 && !tacticalPlan.fireSupport.points[0] && <p className="mt-2 text-xs text-[#d7bb73]">{plannerCopy.gunRequired}</p>}
            <ul className="mt-3 space-y-3">{state.markers.filter((marker) => `${marker.label} ${plannerCopy[marker.kind ?? "intel"]}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).map((marker) => <li key={marker.id} className="rounded border border-[#35463b] p-2">
              <div className="flex gap-2"><input id={`${id}-${marker.id}`} aria-label={copy.label} maxLength={60} value={marker.label} className="min-h-11 min-w-0 flex-1 rounded border border-[#46594d] bg-[#111b15] px-2 text-sm text-white" onChange={(event) => {const label = event.target.value; updateState((previous) => ({...previous, markers: previous.markers.map((entry) => entry.id === marker.id ? {...entry, label} : entry)}));}} onBlur={() => updateState((previous) => ({...previous, markers: previous.markers.map((entry) => ({...entry, label: entry.label.trim() || copy.marker}))}))} /><button aria-label={`${copy.remove}: ${marker.label}`} title={copy.remove} className={controlClass} onClick={() => updateState((previous) => ({...previous, markers: previous.markers.filter(({id: markerId}) => markerId !== marker.id)}))}><Trash2 size={18} /></button></div>
              <div className="mt-2 grid grid-cols-2 gap-2"><label className="col-span-2 text-xs text-[#bacbc0]">{plannerCopy.kind}<select value={marker.kind ?? "intel"} className="ml-2 min-h-11 rounded border border-[#43534a] bg-[#18231e] p-2" onChange={(event) => updateState((previous) => ({...previous, markers: previous.markers.map((entry) => entry.id === marker.id ? {...entry, kind: event.target.value as MarkerKind} : entry)}))}>{markerKinds.map((kind) => <option key={kind} value={kind}>{plannerCopy[kind]}</option>)}</select></label>{(["x", "y"] as const).map((axis) => <label key={axis} className="text-xs text-[#bacbc0]">{plannerCopy[axis]}<input type="number" min={0} max={100} step="0.01" value={Number((marker[axis] * 100).toFixed(4))} className="mt-1 min-h-11 w-full min-w-0 rounded border border-[#46594d] bg-[#111b15] px-2" onChange={(event) => {const value = event.target.valueAsNumber / 100; if (Number.isFinite(value) && value >= 0 && value <= 1) updateState((previous) => ({...previous, markers: previous.markers.map((entry) => entry.id === marker.id ? {...entry, [axis]: value} : entry)}));}} /></label>)}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#9adeb4]">
                <button className="min-h-11 rounded border border-[#46594d] px-2" onClick={() => focusPoint(marker)}>{plannerCopy.focus}</button>
                <button className="min-h-11 rounded border border-[#46594d] px-2" onClick={() => setMissionPoint(marker, false)}>{plannerCopy.setGun}</button>
                <button className="min-h-11 rounded border border-[#46594d] px-2 disabled:cursor-not-allowed disabled:opacity-50" disabled={!tacticalPlan.fireSupport.points[0]} onClick={() => setMissionPoint(marker, true)}>{plannerCopy.setTarget}</button>
                <button className="min-h-11 rounded border border-[#46594d] px-2" onClick={() => {addRoutePoint(marker); setMode("route"); setPanel(false);}}>{plannerCopy.routePoint}</button>
              </div>
            </li>)}</ul></section>
        </div>
      </div>}
      <details className="border-t border-[#35463b] p-3 text-xs leading-6 text-[#b8c8be]"><summary className="cursor-pointer">{copy.provenance} · {copy.version}</summary><p className="mt-2">{copy.source}</p><a className="text-[#9adeb4] underline" href={assetPath(`/images/maps/${state.map}/README.txt`)} title={`${mapNames[state.map]}: ${copy.notes}`} target="_blank" rel="noreferrer">{copy.notes}</a></details>
    </div>
  );
}
