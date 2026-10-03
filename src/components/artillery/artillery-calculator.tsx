"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import Image from "next/image";
import {Crosshair, MapPin, RotateCcw, Volume2, VolumeX, ShieldAlert, Truck, BookOpen, Layers, Flame, ArrowRight, Zap} from "lucide-react";
import type {Locale} from "@/config/site";
import type {MapId, Point} from "@/features/maps/map-state";
import {
  calculateAzimuth,
  calculateDistanceMeters,
  calculateFiringSolution,
  formatGridCoordinate,
  MAP_DIMENSIONS,
  WEAPON_REGISTRY,
  type FiringSolution,
  type TrajectoryMode,
  type WeaponId
} from "@/features/artillery/ballistics-data";
import {getArtilleryCopy} from "@/features/artillery/artillery-copy";
import {assetPath} from "@/lib/assets";
import {Link} from "@/i18n/navigation";

interface Props {
  locale: Locale;
}

export function ArtilleryCalculator({locale}: Props) {
  const copy = getArtilleryCopy(locale);
  const [weaponId, setWeaponId] = useState<WeaponId>("mortar");
  const [trajectoryMode, setTrajectoryMode] = useState<TrajectoryMode>("single");
  const [mapId, setMapId] = useState<MapId>("bakurani");
  const [inputMode, setInputMode] = useState<"map" | "direct">("map");

  // Map points (normalized 0..1 coordinates)
  const [gunPoint, setGunPoint] = useState<Point>({x: 0.48, y: 0.52});
  const [targetPoint, setTargetPoint] = useState<Point>({x: 0.50, y: 0.50});
  const [placeTargetNext, setPlaceTargetNext] = useState(true);

  // Manual direct parameters
  const [directDistance, setDirectDistance] = useState<number>(380);
  const [directHeightDelta, setDirectHeightDelta] = useState<number>(0);
  const [directAzimuth, setDirectAzimuth] = useState<number>(45);

  // Timer & Audio
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [splashTriggered, setSplashTriggered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const weapon = WEAPON_REGISTRY[weaponId];

  const effectiveTrajectoryMode: TrajectoryMode =
    weaponId === "mortar" ? "single" : trajectoryMode === "single" ? "high" : trajectoryMode;

  // Compute Solution
  let solution: FiringSolution;
  if (inputMode === "map") {
    const distanceMeters = calculateDistanceMeters(gunPoint, targetPoint, mapId);
    const azimuth = calculateAzimuth(gunPoint, targetPoint);
    solution = calculateFiringSolution({
      weaponId,
      mode: effectiveTrajectoryMode,
      distanceMeters,
      heightDeltaMeters: directHeightDelta,
      azimuthDegrees: azimuth.degrees,
      azimuthMil: azimuth.mils
    });
  } else {
    const azimuthMil = Math.round((directAzimuth / 360) * 6400);
    solution = calculateFiringSolution({
      weaponId,
      mode: effectiveTrajectoryMode,
      distanceMeters: directDistance,
      heightDeltaMeters: directHeightDelta,
      azimuthDegrees: directAzimuth,
      azimuthMil
    });
  }

  // Audio Synth Beep Helper (using Web Audio API)
  const playBeep = useCallback((frequency: number, duration: number) => {
    if (!audioEnabled || typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext unavailable or blocked
    }
  }, [audioEnabled]);

  // Start Splash Countdown
  const startFireCountdown = () => {
    if (!solution.valid || solution.timeOfFlightSeconds <= 0) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSplashTriggered(false);
    let remaining = solution.timeOfFlightSeconds;
    setCountdown(remaining);
    playBeep(880, 0.15); // Launch shot cue

    timerRef.current = setInterval(() => {
      remaining = Math.round((remaining - 0.1) * 10) / 10;
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setCountdown(0);
        setSplashTriggered(true);
        playBeep(440, 0.4); // Impact splash cue
      } else {
        setCountdown(remaining);
        // Beep at 3, 2, 1 seconds before impact
        if (Math.abs(remaining - 3.0) < 0.05 || Math.abs(remaining - 2.0) < 0.05 || Math.abs(remaining - 1.0) < 0.05) {
          playBeep(660, 0.1);
        }
      }
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Map Click Handler
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0.01, Math.min(0.99, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0.01, Math.min(0.99, (e.clientY - rect.top) / rect.height));

    if (!placeTargetNext) {
      setGunPoint({x, y});
      setPlaceTargetNext(true);
    } else {
      setTargetPoint({x, y});
      setPlaceTargetNext(false);
    }
  };

  const mapSpec = MAP_DIMENSIONS[mapId];
  const gunGrid = formatGridCoordinate(gunPoint, mapId);
  const targetGrid = formatGridCoordinate(targetPoint, mapId);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* 1. Header & Weapon Controls */}
      <div className="rounded-xl border border-[#34453b] bg-gradient-to-b from-[#131c17] to-[#0c120e] p-5 shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-mono text-xs font-semibold tracking-wider text-[#7dd89f]">
              {copy.eyebrow}
            </span>
            <h1 className="display-font mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {copy.title}
            </h1>
            <p className="mt-1 text-xs text-[#9bb0a4] sm:text-sm">
              {copy.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAudioEnabled(!audioEnabled)}
              title={audioEnabled ? "Audio Cues Enabled" : "Audio Muted"}
              className={`flex size-10 items-center justify-center rounded-lg border transition-colors ${
                audioEnabled
                  ? "border-[#497058] bg-[#1a2d22] text-[#8ce2ad]"
                  : "border-[#404c45] bg-[#141b17] text-[#707e77]"
              }`}
            >
              {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <div className="flex rounded-lg border border-[#394a40] bg-[#0f1712] p-1">
              <button
                type="button"
                onClick={() => setInputMode("map")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  inputMode === "map"
                    ? "bg-[#274433] text-white shadow"
                    : "text-[#8ea096] hover:text-white"
                }`}
              >
                {copy.modeMap}
              </button>
              <button
                type="button"
                onClick={() => setInputMode("direct")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  inputMode === "direct"
                    ? "bg-[#274433] text-white shadow"
                    : "text-[#8ea096] hover:text-white"
                }`}
              >
                {copy.modeDirect}
              </button>
            </div>
          </div>
        </div>

        {/* Weapon & Map Selector Bar */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Weapon */}
          <div>
            <label className="text-[11px] font-semibold text-[#8ca094]">
              {copy.selectWeapon}
            </label>
            <div className="mt-1.5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setWeaponId("mortar");
                  setTrajectoryMode("single");
                }}
                className={`flex-1 rounded-lg border py-2 text-xs font-bold transition-all ${
                  weaponId === "mortar"
                    ? "border-[#62b984] bg-[#1d3527] text-[#8ce2ad] shadow-[0_0_12px_rgba(98,185,132,0.2)]"
                    : "border-[#32453a] bg-[#101713] text-[#8d9e95] hover:border-[#4b6656]"
                }`}
              >
                L81 Mortar (81mm)
              </button>
              <button
                type="button"
                onClick={() => {
                  setWeaponId("sph2");
                  if (trajectoryMode === "single") setTrajectoryMode("high");
                }}
                className={`flex-1 rounded-lg border py-2 text-xs font-bold transition-all ${
                  weaponId === "sph2"
                    ? "border-[#d88f48] bg-[#352516] text-[#f2ad6f] shadow-[0_0_12px_rgba(216,143,72,0.2)]"
                    : "border-[#32453a] bg-[#101713] text-[#8d9e95] hover:border-[#4b6656]"
                }`}
              >
                SPH-2 (155mm)
              </button>
            </div>
          </div>

          {/* Trajectory Mode (if SPH-2) */}
          <div>
            <label className="text-[11px] font-semibold text-[#8ca094]">
              {copy.trajectoryMode}
            </label>
            <div className="mt-1.5 flex gap-2">
              {weaponId === "mortar" ? (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-[#2b3a32] bg-[#0c120f] py-2 text-xs font-medium text-[#6f8378]">
                  {copy.highArc}
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setTrajectoryMode("high")}
                    className={`flex-1 rounded-lg border py-2 text-xs font-bold transition-all ${
                      trajectoryMode === "high"
                        ? "border-[#e0a256] bg-[#2d2114] text-[#f8be77]"
                        : "border-[#32453a] bg-[#101713] text-[#8d9e95]"
                    }`}
                  >
                    {copy.highArc}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrajectoryMode("low")}
                    className={`flex-1 rounded-lg border py-2 text-xs font-bold transition-all ${
                      trajectoryMode === "low"
                        ? "border-[#e0a256] bg-[#2d2114] text-[#f8be77]"
                        : "border-[#32453a] bg-[#101713] text-[#8d9e95]"
                    }`}
                  >
                    {copy.lowArc}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Operational Map */}
          <div>
            <label className="text-[11px] font-semibold text-[#8ca094]">
              {copy.selectMap}
            </label>
            <div className="mt-1.5 flex gap-2">
              {(["bakurani", "ozeti", "zestafona"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMapId(m)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-semibold capitalize transition-all ${
                    mapId === m
                      ? "border-[#62b984] bg-[#1a3023] text-white"
                      : "border-[#32453a] bg-[#101713] text-[#8d9e95] hover:border-[#4b6656]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tactical Fire Control HUD (The Core Result Display) */}
      <div className="relative overflow-hidden rounded-xl border-2 border-[#3c634c] bg-gradient-to-r from-[#0d1611] via-[#101a14] to-[#0c1410] p-6 shadow-[0_0_30px_rgba(50,90,70,0.25)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Main Firing Numbers */}
          <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
            {/* 1. ELEVATION (MIL) */}
            <div className="rounded-lg border border-[#2e4738] bg-[#0a110d] p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#81cfa0]">
                {copy.elevationMil}
              </span>
              <div className="display-font mt-1 text-3xl font-extrabold text-[#7ceb9e] sm:text-4xl">
                {solution.valid ? solution.elevationMil : "---"}
              </div>
              <span className="font-mono text-[10px] text-[#6b8577]">
                {weapon.minElevationMil} - {weapon.maxElevationMil} {copy.mils}
              </span>
            </div>

            {/* 2. AZIMUTH */}
            <div className="rounded-lg border border-[#2e4738] bg-[#0a110d] p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#81cfa0]">
                {copy.azimuth}
              </span>
              <div className="display-font mt-1 text-2xl font-extrabold text-white sm:text-3xl">
                {solution.azimuthDegrees.toFixed(1)}°
              </div>
              <span className="font-mono text-[11px] text-[#8ce2ad]">
                {solution.azimuthMil} {copy.mils}
              </span>
            </div>

            {/* 3. GROUND DISTANCE */}
            <div className="rounded-lg border border-[#2e4738] bg-[#0a110d] p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#81cfa0]">
                {copy.distance}
              </span>
              <div className="display-font mt-1 text-2xl font-extrabold text-white sm:text-3xl">
                {solution.distanceMeters.toFixed(0)}
                <span className="text-base text-[#8ca094]"> {copy.meters}</span>
              </div>
              <span className="font-mono text-[10px] text-[#6b8577]">
                {weapon.minRangeMeters}m - {weapon.maxRangeMeters}m
              </span>
            </div>

            {/* 4. TIME OF FLIGHT */}
            <div className="rounded-lg border border-[#2e4738] bg-[#0a110d] p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#81cfa0]">
                {copy.timeOfFlight}
              </span>
              <div className="display-font mt-1 text-2xl font-extrabold text-[#f3bd64] sm:text-3xl">
                {solution.valid ? `${solution.timeOfFlightSeconds.toFixed(1)}s` : "---"}
              </div>
              <span className="font-mono text-[10px] text-[#8f7d54]">
                {solution.valid ? copy.readyToFire : "Out of limits"}
              </span>
            </div>
          </div>

          {/* Interactive FIRE Countdown Button */}
          <div className="flex flex-col items-center justify-center gap-2 border-t border-[#25382d] pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            {countdown !== null && countdown > 0 ? (
              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#f3bd64] animate-pulse">
                  {copy.splashIn}
                </span>
                <div className="display-font text-4xl font-extrabold text-[#f8be77]">
                  {countdown.toFixed(1)}s
                </div>
                <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-[#202c24]">
                  <div
                    className="h-full bg-[#f3bd64] transition-all"
                    style={{
                      width: `${(countdown / solution.timeOfFlightSeconds) * 100}%`
                    }}
                  />
                </div>
              </div>
            ) : splashTriggered ? (
              <div className="flex flex-col items-center text-center">
                <div className="display-font text-xl font-bold text-[#6be896] animate-bounce">
                  {copy.splashImpact}
                </div>
                <button
                  type="button"
                  onClick={startFireCountdown}
                  className="mt-2 rounded-lg bg-[#274433] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#345c45]"
                >
                  Fire Again
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={startFireCountdown}
                disabled={!solution.valid}
                className="group relative flex items-center justify-center gap-2 rounded-xl border border-[#528d68] bg-gradient-to-r from-[#1f3f2c] to-[#142d1f] px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:border-[#7ceb9e] hover:shadow-[0_0_20px_rgba(124,235,158,0.3)] disabled:opacity-40"
              >
                <Flame className="size-5 text-[#f59e0b] group-hover:animate-pulse" />
                <span>{copy.fireButton}</span>
              </button>
            )}

            {/* Validation warning */}
            {!solution.valid && (
              <span className="flex items-center gap-1 text-xs font-semibold text-[#f87171]">
                <ShieldAlert size={14} />
                {solution.reason === "too_close" ? copy.tooClose : copy.outOfRange}
              </span>
            )}
          </div>
        </div>

        {/* Height delta control sub-bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between border-t border-[#23352b] pt-3 text-xs text-[#8da095]">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">{copy.heightDelta}:</span>
            <div className="flex items-center gap-1 font-mono">
              <button
                type="button"
                onClick={() => setDirectHeightDelta((prev) => prev - 5)}
                className="rounded border border-[#3b4e42] bg-[#141d17] px-2 py-0.5 hover:bg-[#223328]"
              >
                -5m
              </button>
              <span className="px-1 font-bold text-[#8ce2ad]">
                {directHeightDelta >= 0 ? `+${directHeightDelta}` : directHeightDelta} m
              </span>
              <button
                type="button"
                onClick={() => setDirectHeightDelta((prev) => prev + 5)}
                className="rounded border border-[#3b4e42] bg-[#141d17] px-2 py-0.5 hover:bg-[#223328]"
              >
                +5m
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span>{copy.gunPosition}: <strong className="text-white font-mono">{gunGrid}</strong></span>
            <span>{copy.targetPosition}: <strong className="text-white font-mono">{targetGrid}</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Main Operational Area: Interactive Map vs Direct Keypad */}
      {inputMode === "map" ? (
        <div className="rounded-xl border border-[#34453b] bg-[#0c120f] p-4 shadow-xl">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPlaceTargetNext(false)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  !placeTargetNext
                    ? "border-[#52a473] bg-[#1c3827] text-white"
                    : "border-[#32453a] bg-[#101713] text-[#8ca094]"
                }`}
              >
                <MapPin className="inline size-3.5 mr-1 text-[#8ce2ad]" />
                {copy.clickToSetGun}
              </button>
              <button
                type="button"
                onClick={() => setPlaceTargetNext(true)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  placeTargetNext
                    ? "border-[#e05d5d] bg-[#3a1a1a] text-white"
                    : "border-[#32453a] bg-[#101713] text-[#8ca094]"
                }`}
              >
                <Crosshair className="inline size-3.5 mr-1 text-[#f87171]" />
                {copy.clickToSetTarget}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setGunPoint({x: 0.48, y: 0.52});
                setTargetPoint({x: 0.50, y: 0.50});
                setPlaceTargetNext(true);
              }}
              className="flex items-center gap-1 rounded-lg border border-[#34453b] bg-[#141c18] px-2.5 py-1 text-xs text-[#8da095] hover:bg-[#202e26]"
            >
              <RotateCcw size={13} />
              <span>{copy.resetButton}</span>
            </button>
          </div>

          {/* Interactive Map Canvas Area */}
          <div
            onClick={handleMapClick}
            className="group relative aspect-square w-full cursor-crosshair overflow-hidden rounded-lg border border-[#394d40] bg-black select-none"
          >
            {/* Basemap Image */}
            <Image
              src={assetPath(`/images/maps/${mapId}/overview.webp`)}
              alt={`${mapSpec.name} Map`}
              fill
              className="object-cover pointer-events-none opacity-85 group-hover:opacity-95 transition-opacity"
              priority
            />

            {/* Tactical Map SVG Overlay */}
            <svg
              className="absolute inset-0 size-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Range Circle (Max Range) */}
              <circle
                cx={gunPoint.x * 100}
                cy={gunPoint.y * 100}
                r={(weapon.maxRangeMeters / mapSpec.sizeMeters) * 100}
                fill="rgba(124, 235, 158, 0.04)"
                stroke="#68c58f"
                strokeWidth="0.4"
                strokeDasharray="1.5 1.5"
              />

              {/* Range Circle (Min Range) */}
              <circle
                cx={gunPoint.x * 100}
                cy={gunPoint.y * 100}
                r={(weapon.minRangeMeters / mapSpec.sizeMeters) * 100}
                fill="none"
                stroke="#f87171"
                strokeWidth="0.3"
                strokeDasharray="1 1"
              />

              {/* Firing Line from Gun to Target */}
              <line
                x1={gunPoint.x * 100}
                y1={gunPoint.y * 100}
                x2={targetPoint.x * 100}
                y2={targetPoint.y * 100}
                stroke={solution.valid ? "#8ce2ad" : "#f87171"}
                strokeWidth="0.6"
              />
            </svg>

            {/* Gun Marker (HTML Overlay) */}
            <div
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-none"
              style={{left: `${gunPoint.x * 100}%`, top: `${gunPoint.y * 100}%`}}
            >
              <div className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#10b981] shadow-lg">
                <MapPin className="size-4 text-black" />
              </div>
              <span className="absolute -top-5 whitespace-nowrap rounded bg-black/80 px-1 font-mono text-[9px] font-bold text-[#8ce2ad]">
                GUN: {gunGrid}
              </span>
            </div>

            {/* Target Marker (HTML Overlay) */}
            <div
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-none"
              style={{left: `${targetPoint.x * 100}%`, top: `${targetPoint.y * 100}%`}}
            >
              <div className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#ef4444] shadow-lg">
                <Crosshair className="size-4 text-white" />
              </div>
              <span className="absolute -top-5 whitespace-nowrap rounded bg-black/80 px-1 font-mono text-[9px] font-bold text-[#fca5a5]">
                TGT: {targetGrid}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Direct Keypad & Distance Input Mode */
        <div className="rounded-xl border border-[#34453b] bg-[#0c120f] p-6 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#8ce2ad]">
            {copy.keypadTitle}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Distance Slider & Quick Adjusters */}
            <div>
              <label className="text-xs font-semibold text-[#8ca094]">
                {copy.directDistanceLabel}
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={weapon.minRangeMeters}
                  max={weapon.maxRangeMeters}
                  value={directDistance}
                  onChange={(e) => setDirectDistance(Number(e.target.value))}
                  className="h-2 flex-1 cursor-pointer accent-[#62b984]"
                />
                <input
                  type="number"
                  value={directDistance}
                  onChange={(e) => setDirectDistance(Number(e.target.value))}
                  className="w-24 rounded border border-[#384c3f] bg-[#141e17] px-2 py-1 text-center font-mono text-sm font-bold text-white"
                />
              </div>
              <div className="mt-3 flex gap-2">
                {[-50, -10, 10, 50].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() =>
                      setDirectDistance((prev) =>
                        Math.max(weapon.minRangeMeters, Math.min(weapon.maxRangeMeters, prev + delta))
                      )
                    }
                    className="flex-1 rounded border border-[#34463b] bg-[#131c16] py-1 text-xs font-semibold text-[#8ce2ad] hover:bg-[#202e25]"
                  >
                    {delta > 0 ? `+${delta}m` : `${delta}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Azimuth Angle Input */}
            <div>
              <label className="text-xs font-semibold text-[#8ca094]">
                {copy.directAzimuthLabel}
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={359}
                  value={directAzimuth}
                  onChange={(e) => setDirectAzimuth(Number(e.target.value))}
                  className="h-2 flex-1 cursor-pointer accent-[#62b984]"
                />
                <input
                  type="number"
                  value={directAzimuth}
                  onChange={(e) => setDirectAzimuth(Number(e.target.value))}
                  className="w-24 rounded border border-[#384c3f] bg-[#141e17] px-2 py-1 text-center font-mono text-sm font-bold text-white"
                />
              </div>
              <div className="mt-3 flex gap-2">
                {[0, 90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => setDirectAzimuth(deg)}
                    className="flex-1 rounded border border-[#34463b] bg-[#131c16] py-1 text-xs font-semibold text-[#8ce2ad] hover:bg-[#202e25]"
                  >
                    {deg === 0 ? "N (0°)" : deg === 90 ? "E (90°)" : deg === 180 ? "S (180°)" : "W (270°)"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Ecosystem & Wiki Deep Integration */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Link 1: Ammo Matcher */}
        <Link
          href="/tools/ammo-matcher"
          title={copy.quickTools.ammoTitle}
          className="group flex flex-col justify-between rounded-xl border border-[#314638] bg-[#111914] p-4 transition-all hover:border-[#69c78f] hover:shadow-[0_0_15px_rgba(105,199,143,0.15)]"
        >
          <div>
            <div className="flex size-9 items-center justify-center rounded-lg border border-[#385945] bg-[#1b2c21] text-[#8ce2ad]">
              <Layers size={18} />
            </div>
            <h3 className="mt-3 text-sm font-bold text-white group-hover:text-[#8ce2ad]">
              {copy.quickTools.ammoTitle}
            </h3>
            <p className="mt-1 text-xs text-[#8fa296]">
              {copy.quickTools.ammoDesc}
            </p>
          </div>
          <span className="mt-4 flex items-center text-xs font-semibold text-[#8ce2ad]">
            <span>Explore Ammunition</span>
            <ArrowRight size={13} className="ml-1 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        {/* Link 2: Logistics Route Planner */}
        <Link
          href="/tools/logistics-planner"
          title={copy.quickTools.logisticsTitle}
          className="group flex flex-col justify-between rounded-xl border border-[#314638] bg-[#111914] p-4 transition-all hover:border-[#69c78f] hover:shadow-[0_0_15px_rgba(105,199,143,0.15)]"
        >
          <div>
            <div className="flex size-9 items-center justify-center rounded-lg border border-[#385945] bg-[#1b2c21] text-[#8ce2ad]">
              <Truck size={18} />
            </div>
            <h3 className="mt-3 text-sm font-bold text-white group-hover:text-[#8ce2ad]">
              {copy.quickTools.logisticsTitle}
            </h3>
            <p className="mt-1 text-xs text-[#8fa296]">
              {copy.quickTools.logisticsDesc}
            </p>
          </div>
          <span className="mt-4 flex items-center text-xs font-semibold text-[#8ce2ad]">
            <span>Plan Supply Runs</span>
            <ArrowRight size={13} className="ml-1 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        {/* Link 3: Mortar Tactics Guide */}
        <Link
          href="/guides/wardogs-mortar-guide"
          title={copy.quickTools.guideTitle}
          className="group flex flex-col justify-between rounded-xl border border-[#314638] bg-[#111914] p-4 transition-all hover:border-[#69c78f] hover:shadow-[0_0_15px_rgba(105,199,143,0.15)]"
        >
          <div>
            <div className="flex size-9 items-center justify-center rounded-lg border border-[#385945] bg-[#1b2c21] text-[#8ce2ad]">
              <BookOpen size={18} />
            </div>
            <h3 className="mt-3 text-sm font-bold text-white group-hover:text-[#8ce2ad]">
              {copy.quickTools.guideTitle}
            </h3>
            <p className="mt-1 text-xs text-[#8fa296]">
              {copy.quickTools.guideDesc}
            </p>
          </div>
          <span className="mt-4 flex items-center text-xs font-semibold text-[#8ce2ad]">
            <span>Read Tactics Guide</span>
            <ArrowRight size={13} className="ml-1 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>

      {/* 5. Tactical Pro-Tip Banner */}
      <div className="rounded-xl border border-[#3c5645] bg-gradient-to-r from-[#17251d] to-[#121c17] p-5">
        <h4 className="flex items-center gap-2 text-sm font-bold text-[#8ce2ad]">
          <Zap size={16} className="text-[#f59e0b]" />
          {copy.tacticalTipTitle}
        </h4>
        <p className="mt-2 text-xs leading-5 text-[#a8b8ae]">
          {copy.tacticalTipBody}
        </p>
      </div>
    </div>
  );
}
