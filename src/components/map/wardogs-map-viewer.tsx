"use client";

import {useCallback, useEffect, useRef, useState, type PointerEvent, type WheelEvent} from "react";
import {Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut} from "lucide-react";
import type {Locale} from "@/config/site";

type MapId = "bakurani" | "ozeti" | "zestafona";
const mapNames: Record<MapId, string> = {bakurani: "Bakurani", ozeti: "Ozeti", zestafona: "Zestafona"};

const labels: Record<Locale, {map: string; zoomIn: string; zoomOut: string; reset: string; fullscreen: string; exitFullscreen: string}> = {
  en: {map: "Map", zoomIn: "Zoom in", zoomOut: "Zoom out", reset: "Reset view", fullscreen: "Fullscreen", exitFullscreen: "Exit fullscreen"},
  de: {map: "Karte", zoomIn: "Vergrößern", zoomOut: "Verkleinern", reset: "Ansicht zurücksetzen", fullscreen: "Vollbild", exitFullscreen: "Vollbild verlassen"},
  ru: {map: "Карта", zoomIn: "Увеличить", zoomOut: "Уменьшить", reset: "Сбросить вид", fullscreen: "Полный экран", exitFullscreen: "Выйти из полного экрана"},
  "pt-br": {map: "Mapa", zoomIn: "Ampliar", zoomOut: "Reduzir", reset: "Redefinir vista", fullscreen: "Tela cheia", exitFullscreen: "Sair da tela cheia"},
  ja: {map: "マップ", zoomIn: "拡大", zoomOut: "縮小", reset: "表示をリセット", fullscreen: "全画面", exitFullscreen: "全画面を終了"},
  "zh-cn": {map: "地图", zoomIn: "放大", zoomOut: "缩小", reset: "重置视角", fullscreen: "全屏", exitFullscreen: "退出全屏"},
};

type Props = {initialMap?: MapId; locale?: Locale; className?: string};

export function WardogsMapViewer({initialMap = "bakurani", locale = "en", className = ""}: Props) {
  const [currentMap, setCurrentMap] = useState<MapId>(initialMap);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({x: 0, y: 0});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{pointerId: number; startX: number; startY: number; originX: number; originY: number} | null>(null);
  const copy = labels[locale];

  const reset = useCallback(() => {
    setScale(1);
    setPosition({x: 0, y: 0});
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const zoom = (direction: 1 | -1) => setScale((previous) => Math.max(1, Math.min(6, Number((previous + direction * 0.35).toFixed(2)))));

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (dragRef.current) return;
    dragRef.current = {pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: position.x, originY: position.y};
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const bound = containerRef.current;
    if (!bound) return;
    const maxX = bound.clientWidth * (scale - 1) / 2;
    const maxY = bound.clientHeight * (scale - 1) / 2;
    setPosition({
      x: Math.max(-maxX, Math.min(maxX, drag.originX + event.clientX - drag.startX)),
      y: Math.max(-maxY, Math.min(maxY, drag.originY + event.clientY - drag.startY)),
    });
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    zoom(event.deltaY < 0 ? 1 : -1);
  };

  const toggleFullscreen = async () => {
    if (document.fullscreenElement === containerRef.current) await document.exitFullscreen();
    else await containerRef.current?.requestFullscreen();
  };

  const controlClass = "flex size-11 items-center justify-center rounded-lg border border-slate-600 bg-slate-900/95 text-white shadow-lg hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

  return (
    <div ref={containerRef} className={`relative h-[480px] w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-2xl md:h-[700px] ${isFullscreen ? "fixed inset-0 z-50 h-screen w-screen rounded-none" : ""} ${className}`}>
      <div className="absolute left-3 top-3 z-20 rounded-lg border border-slate-600 bg-slate-900/95 px-3 py-2 shadow-lg">
        <label className="mr-2 text-sm font-semibold text-slate-200" htmlFor={`wardogs-map-selector-${initialMap}`}>{copy.map}</label>
        <select
          className="max-w-[58vw] bg-slate-900 text-sm font-semibold text-white outline-none"
          id={`wardogs-map-selector-${initialMap}`}
          onChange={(event) => { setCurrentMap(event.target.value as MapId); reset(); }}
          value={currentMap}
        >
          {(Object.keys(mapNames) as MapId[]).map((id) => <option key={id} value={id}>{mapNames[id]}</option>)}
        </select>
      </div>

      <div className="absolute right-3 top-16 z-20 flex flex-col gap-2">
        <button aria-label={copy.zoomIn} className={controlClass} onClick={() => zoom(1)} title={copy.zoomIn} type="button"><ZoomIn aria-hidden="true" size={20} /></button>
        <button aria-label={copy.zoomOut} className={controlClass} onClick={() => zoom(-1)} title={copy.zoomOut} type="button"><ZoomOut aria-hidden="true" size={20} /></button>
        <button aria-label={copy.reset} className={controlClass} onClick={reset} title={copy.reset} type="button"><RotateCcw aria-hidden="true" size={20} /></button>
        <button aria-label={isFullscreen ? copy.exitFullscreen : copy.fullscreen} className={controlClass} onClick={toggleFullscreen} title={isFullscreen ? copy.exitFullscreen : copy.fullscreen} type="button">
          {isFullscreen ? <Minimize2 aria-hidden="true" size={20} /> : <Maximize2 aria-hidden="true" size={20} />}
        </button>
      </div>

      <div
        className="flex h-full w-full cursor-grab touch-none select-none items-center justify-center overflow-hidden active:cursor-grabbing"
        data-map-viewport
        onPointerCancel={onPointerEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onWheel={onWheel}
      >
        <div
          className="aspect-square w-full max-w-[1400px]"
          data-map-content
          style={{transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`, transition: isDragging ? "none" : "transform 0.12s ease-out"}}
        >
          {/* The map is already an optimized WebP; the public path is selected in the browser. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={`WARDOGS ${mapNames[currentMap]} map`} className="pointer-events-none h-full w-full object-contain" draggable={false} height={2048} src={`/images/maps/${currentMap}/overview.webp`} width={2048} />
        </div>
      </div>
    </div>
  );
}
