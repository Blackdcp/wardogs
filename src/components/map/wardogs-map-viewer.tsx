"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Layers,
  MapPin,
  Crosshair,
  Shield,
  Radio,
  Eye,
  EyeOff
} from "lucide-react";

interface TowerInfo {
  id: string;
  name: string;
  grid: string;
  xPct: number; // percentage in 16km
  yPct: number;
  desc: string;
}

const BAKURANI_TOWERS: TowerInfo[] = [
  { id: "T1", name: "Tower 01 (North Center)", grid: "H07", xPct: 49.1, yPct: 42.6, desc: "北部高地视野塔，俯瞰北部河谷与进镇主路" },
  { id: "T2", name: "Tower 02 (West Hill)", grid: "H07", xPct: 47.1, yPct: 42.7, desc: "西侧山丘制高点，扼守伐木场与西侧山路" },
  { id: "T3", name: "Tower 03 (West Valley)", grid: "H08", xPct: 47.1, yPct: 44.8, desc: "西南部山谷中继站，连接向日葵农田与镇区" },
  { id: "T4", name: "Tower 04 (East Depot)", grid: "I08", xPct: 51.0, yPct: 44.5, desc: "东部铸造厂/铁路货运站枢纽，重型物资集中点" },
  { id: "T5", name: "Tower 05 (Central Ridge)", grid: "I07", xPct: 50.2, yPct: 41.7, desc: "中心控制区最高瞭望塔，全图核心争议点" },
];

interface WardogsMapViewerProps {
  initialMap?: string;
  className?: string;
}

export function WardogsMapViewer({ initialMap = "bakurani", className = "" }: WardogsMapViewerProps) {
  const [currentMap, setCurrentMap] = useState(initialMap);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Layer toggles
  const [showTowers, setShowTowers] = useState(true);
  const [showZone, setShowZone] = useState(true);
  const [showGridCoords, setShowGridCoords] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTower, setActiveTower] = useState<TowerInfo | null>(null);

  // Coordinate display
  const [cursorCoord, setCursorCoord] = useState<{ grid: string; xM: number; yM: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Clamp position to avoid losing the map
  const clampPos = useCallback((newX: number, newY: number, newScale: number) => {
    if (!containerRef.current) return { x: newX, y: newY };
    const { clientWidth: cw, clientHeight: ch } = containerRef.current;
    const maxBoundX = (cw * newScale) / 2;
    const maxBoundY = (ch * newScale) / 2;
    return {
      x: Math.max(-maxBoundX, Math.min(maxBoundX, newX)),
      y: Math.max(-maxBoundY, Math.min(maxBoundY, newY)),
    };
  }, []);

  const handleZoom = (delta: number) => {
    setScale((prev) => {
      const next = Math.max(0.8, Math.min(6.0, prev + delta));
      return Number(next.toFixed(2));
    });
  };

  const handleReset = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
    setActiveTower(null);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Pointer drag events
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Primary button only
    setIsDragging(true);
    setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      const newPos = clampPos(e.clientX - dragStart.x, e.clientY - dragStart.y, scale);
      setPos(newPos);
    }

    // Compute coordinate
    if (contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;

      if (relX >= 0 && relX <= 1 && relY >= 0 && relY <= 1) {
        const totalKm = 16;
        const colIdx = Math.min(15, Math.floor(relX * totalKm));
        const rowIdx = Math.min(15, Math.floor(relY * totalKm));
        const cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];
        const grid = `${cols[colIdx]}${String(rowIdx + 1).padStart(2, "0")}`;
        const xM = Math.round(relX * 16000);
        const yM = Math.round(relY * 16000);
        setCursorCoord({ grid, xM, yM });
      } else {
        setCursorCoord(null);
      }
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Wheel zoom
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.25 : -0.25;
    handleZoom(zoomFactor);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950 select-none shadow-2xl ${
        isFullscreen ? "fixed inset-0 z-50 h-screen w-screen rounded-none" : "h-[650px] md:h-[750px]"
      } ${className}`}
    >
      {/* Top Header Overlay */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Map Selector & Status */}
        <div className="flex items-center gap-2 rounded-lg bg-slate-900/90 p-1.5 backdrop-blur-md border border-slate-700 pointer-events-auto shadow-lg">
          <Crosshair className="h-4 w-4 text-sky-400 ml-1.5" />
          <select
            value={currentMap}
            onChange={(e) => {
              setCurrentMap(e.target.value);
              handleReset();
            }}
            className="bg-transparent text-sm font-bold text-slate-100 outline-none cursor-pointer pr-2"
          >
            <option value="bakurani" className="bg-slate-900 text-slate-100">
              Bakurani / 巴库拉尼 (16×16 km)
            </option>
            <option value="ozeti" className="bg-slate-900 text-slate-400" disabled>
              Ozeti / 奥泽蒂 (待加入)
            </option>
            <option value="zestafona" className="bg-slate-900 text-slate-400" disabled>
              Zestafona / 泽斯塔福纳 (待加入)
            </option>
          </select>
          <span className="rounded bg-sky-950 px-2 py-0.5 text-xs font-semibold text-sky-400 border border-sky-800">
            2D 战术底图
          </span>
        </div>

        {/* Live Coordinate Box */}
        {cursorCoord && (
          <div className="flex items-center gap-3 rounded-lg bg-slate-900/90 px-3 py-1.5 text-xs font-mono text-slate-200 backdrop-blur-md border border-slate-700 shadow-lg pointer-events-auto">
            <span className="text-amber-400 font-bold">GRID: {cursorCoord.grid}</span>
            <span className="text-slate-400">|</span>
            <span>X: {cursorCoord.xM}m</span>
            <span>Y: {cursorCoord.yM}m</span>
          </div>
        )}
      </div>

      {/* Floating Control Toolbar (Right Side) */}
      <div className="absolute top-16 right-3 z-30 flex flex-col gap-2 pointer-events-auto">
        {/* Zoom In */}
        <button
          onClick={() => handleZoom(0.35)}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900/90 text-slate-200 shadow-md backdrop-blur-md border border-slate-700 transition hover:bg-slate-800 hover:text-sky-400"
          title="放大 (Zoom In)"
        >
          <ZoomIn className="h-5 w-5" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => handleZoom(-0.35)}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900/90 text-slate-200 shadow-md backdrop-blur-md border border-slate-700 transition hover:bg-slate-800 hover:text-sky-400"
          title="缩小 (Zoom Out)"
        >
          <ZoomOut className="h-5 w-5" />
        </button>

        {/* Reset View */}
        <button
          onClick={handleReset}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900/90 text-slate-200 shadow-md backdrop-blur-md border border-slate-700 transition hover:bg-slate-800 hover:text-sky-400"
          title="重置视角 (Reset View)"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900/90 text-slate-200 shadow-md backdrop-blur-md border border-slate-700 transition hover:bg-slate-800 hover:text-sky-400"
          title="全屏 (Fullscreen)"
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </button>

        {/* Layers Menu Button */}
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg shadow-md backdrop-blur-md border transition ${
            showMenu
              ? "bg-sky-600 text-white border-sky-400"
              : "bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800 hover:text-sky-400"
          }`}
          title="图层控制 (Layers)"
        >
          <Layers className="h-5 w-5" />
        </button>
      </div>

      {/* Layer Control Panel */}
      {showMenu && (
        <div className="absolute top-16 right-16 z-30 w-56 rounded-xl bg-slate-900/95 p-3 text-xs text-slate-200 backdrop-blur-md border border-slate-700 shadow-2xl pointer-events-auto">
          <div className="mb-2 font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
            <Layers className="h-3.5 w-3.5 text-sky-400" />
            <span>图层与标点显示</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center justify-between cursor-pointer py-1 hover:text-white">
              <span className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-sky-400" />
                <span>塔台终端 (Towers 1-5)</span>
              </span>
              <input
                type="checkbox"
                checked={showTowers}
                onChange={(e) => setShowTowers(e.target.checked)}
                className="rounded accent-sky-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1 hover:text-white">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-rose-400" />
                <span>2x2km 控制争夺区</span>
              </span>
              <input
                type="checkbox"
                checked={showZone}
                onChange={(e) => setShowZone(e.target.checked)}
                className="rounded accent-rose-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1 hover:text-white">
              <span className="flex items-center gap-2">
                <Crosshair className="h-4 w-4 text-amber-400" />
                <span>网格坐标代号 (A-P)</span>
              </span>
              <input
                type="checkbox"
                checked={showGridCoords}
                onChange={(e) => setShowGridCoords(e.target.checked)}
                className="rounded accent-amber-500"
              />
            </label>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
            提示：支持鼠标滚轮或双指缩放，按住左键拖拽平移。
          </div>
        </div>
      )}

      {/* Interactive Map Viewport */}
      <div
        className="h-full w-full cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
      >
        <div
          ref={contentRef}
          style={{
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${scale})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.12s ease-out",
          }}
          className="relative aspect-square w-full max-w-[1400px] max-h-[1400px]"
        >
          {/* Main 2D Vector Basemap */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/maps/bakurani/overview.svg"
            alt="WARDOGS Bakurani Tactical Map"
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />

          {/* Interactive Overlay Markers: Towers */}
          {showTowers &&
            BAKURANI_TOWERS.map((t) => (
              <button
                key={t.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTower(t);
                }}
                style={{
                  left: `${t.xPct}%`,
                  top: `${t.yPct}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute z-20 group pointer-events-auto p-1 focus:outline-none"
                title={`${t.id}: ${t.name}`}
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-8 w-8 rounded-full bg-sky-400/30 animate-ping" />
                  <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 border-2 border-white shadow-lg text-[10px] font-black text-white group-hover:scale-125 transition-transform">
                    {t.id.replace("T", "")}
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Selected Tower Detail Card Modal */}
      {activeTower && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 z-40 rounded-xl bg-slate-900/95 p-4 text-slate-100 backdrop-blur-md border border-sky-500/40 shadow-2xl pointer-events-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-600 text-sm font-black text-white">
                {activeTower.id}
              </span>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">{activeTower.name}</h4>
                <span className="text-xs font-mono text-sky-400">坐标方格: {activeTower.grid}</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTower(null)}
              className="text-slate-400 hover:text-white text-lg font-bold p-1 leading-none"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">{activeTower.desc}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
            <span>战术类型: 终端交互占领点</span>
            <span className="text-amber-400">建议人数: 3-5 人防守</span>
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="absolute bottom-2 right-3 z-20 text-[11px] font-mono text-slate-400/80 pointer-events-none hidden sm:block">
        <span>比例尺: 1:16000 | 缩放: {(scale * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
