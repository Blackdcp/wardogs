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
  getWeaponRangeEnvelope,
  MAP_DIMENSIONS,
  WEAPON_REGISTRY,
  type FiringSolution,
  type TrajectoryMode,
  type WeaponId
} from "@/features/artillery/ballistics-data";
import {getArtilleryCopy} from "@/features/artillery/artillery-copy";
import {assetPath} from "@/lib/assets";
import {Link} from "@/i18n/navigation";
import {ANALYTICS_EVENTS, trackAnalyticsEvent} from "@/lib/analytics-events";

interface Props {
  locale: Locale;
}

function normalizeAzimuth(value: number) {
  return Number.isFinite(value) ? ((value % 360) + 360) % 360 : 0;
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
  const [mapCursor, setMapCursor] = useState<Point>({x: 0.50, y: 0.50});

  // Manual direct parameters
  const [directDistance, setDirectDistance] = useState<number>(380);
  const [directHeightDelta, setDirectHeightDelta] = useState<number>(0);
  const [directAzimuth, setDirectAzimuth] = useState<number>(45);

  // Timer & Audio
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [splashTriggered, setSplashTriggered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resultPending = useRef(false);
  const lastTrackedResult = useRef<string | null>(null);
  const audioEnabledRef = useRef(audioEnabled);
  useEffect(() => { audioEnabledRef.current = audioEnabled; }, [audioEnabled]);

  const weapon = WEAPON_REGISTRY[weaponId];

  const effectiveTrajectoryMode: TrajectoryMode =
    weaponId === "mortar" ? "single" : trajectoryMode === "single" ? "high" : trajectoryMode;

  const rangeEnvelope = getWeaponRangeEnvelope(weaponId, effectiveTrajectoryMode);

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
    const azimuthDegrees = normalizeAzimuth(directAzimuth);
    const azimuthMil = Math.round((azimuthDegrees / 360) * 6400) % 6400;
    solution = calculateFiringSolution({
      weaponId,
      mode: effectiveTrajectoryMode,
      distanceMeters: directDistance,
      heightDeltaMeters: directHeightDelta,
      azimuthDegrees,
      azimuthMil
    });
  }

  useEffect(() => {
    if (!resultPending.current) return;
    resultPending.current = false;
    const verdict = solution.valid ? "valid" : "invalid";
    const resultType = solution.valid ? "ready" : solution.reason ?? "out_of_range";
    const resultKey = `${weaponId}:${inputMode}:${verdict}:${resultType}`;
    if (lastTrackedResult.current !== resultKey) {
      lastTrackedResult.current = resultKey;
      trackAnalyticsEvent(ANALYTICS_EVENTS.toolResult, {tool: "artillery-calculator", result: verdict, result_type: resultType, weapon: weaponId, input_mode: inputMode, locale});
    }
  });

  function cancelCountdown() {
    if (timerRef.current !== null) clearInterval(timerRef.current);
    timerRef.current = null;
    setCountdown(null);
    setSplashTriggered(false);
  }

  function updateInputs(update: () => void) {
    cancelCountdown();
    resultPending.current = true;
    update();
  }

  // Audio Synth Beep Helper (using Web Audio API)
  const playBeep = useCallback((frequency: number, duration: number) => {
    if (!audioEnabledRef.current || typeof window === "undefined") return;
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
      osc.onended = () => { void ctx.close(); };
    } catch {
      // AudioContext unavailable or blocked
    }
  }, []);

  // Start Splash Countdown
  const startFireCountdown = () => {
    if (!solution.valid || solution.timeOfFlightSeconds <= 0) return;
    cancelCountdown();

    const deadline = performance.now() + solution.timeOfFlightSeconds * 1000;
    let previousRemaining = solution.timeOfFlightSeconds;
    setCountdown(previousRemaining);
    playBeep(880, 0.15); // Launch shot cue
    trackAnalyticsEvent(ANALYTICS_EVENTS.toolAction, {tool: "artillery-calculator", action: "fire", result: "valid", weapon: weaponId, locale});

    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, (deadline - performance.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setCountdown(0);
        setSplashTriggered(true);
        playBeep(440, 0.4); // Impact splash cue
      } else {
        setCountdown(Math.max(0.1, Math.round(remaining * 10) / 10));
        // A delayed callback may cross several cues; play one current warning.
        if ([3, 2, 1].some((seconds) => previousRemaining > seconds && remaining <= seconds)) {
          playBeep(660, 0.1);
        }
      }
      previousRemaining = remaining;
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, []);

  function placeMapPoint(point: Point) {
    updateInputs(() => {
      if (!placeTargetNext) setGunPoint(point);
      else setTargetPoint(point);
      setPlaceTargetNext(!placeTargetNext);
    });
  }

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const point = {
      x: Math.max(0.01, Math.min(0.99, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0.01, Math.min(0.99, (e.clientY - rect.top) / rect.height))
    };
    setMapCursor(point);
    placeMapPoint(point);
  };

  const handleMapKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const movement: Record<string, Point> = {ArrowLeft: {x: -0.01, y: 0}, ArrowRight: {x: 0.01, y: 0}, ArrowUp: {x: 0, y: -0.01}, ArrowDown: {x: 0, y: 0.01}};
    if (movement[e.key]) {
      e.preventDefault();
      const delta = movement[e.key];
      setMapCursor((point) => ({x: Math.max(0.01, Math.min(0.99, point.x + delta.x)), y: Math.max(0.01, Math.min(0.99, point.y + delta.y))}));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      placeMapPoint(mapCursor);
    }
  };

  const mapSpec = MAP_DIMENSIONS[mapId];
  const gunGrid = formatGridCoordinate(gunPoint, mapId);
  const targetGrid = formatGridCoordinate(targetPoint, mapId);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8" data-tool-calculator-shell="artillery">
      {/* 1. Header & Weapon Controls */}
      <div className="rounded-[6px] border border-[#344039] bg-[#111613] p-5">
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
                onClick={() => updateInputs(() => setInputMode("map"))}
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
                onClick={() => updateInputs(() => setInputMode("direct"))}
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
                onClick={() => updateInputs(() => {
                  setWeaponId("mortar");
                  setTrajectoryMode("single");
                  setDirectDistance((prev) => Math.max(80, Math.min(697, prev)));
                })}
                className={`flex-1 rounded-lg border py-2 text-xs font-bold transition-all ${
                  weaponId === "mortar"
                    ? "border-[#62b984] bg-[#1d3527] text-[#8ce2ad]"
                    : "border-[#32453a] bg-[#101713] text-[#8d9e95] hover:border-[#4b6656]"
                }`}
              >
                L81 Mortar (81mm)
              </button>
              <button
                type="button"
                onClick={() => updateInputs(() => {
                  setWeaponId("sph2");
                  const nextMode = trajectoryMode === "single" ? "high" : trajectoryMode;
                  if (trajectoryMode === "single") setTrajectoryMode("high");
                  const min = nextMode === "low" ? 1181 : 735;
                  setDirectDistance((prev) => Math.max(min, Math.min(2629, prev)));
                })}
                className={`flex-1 rounded-lg border py-2 text-xs font-bold transition-all ${
                  weaponId === "sph2"
                    ? "border-[#d88f48] bg-[#352516] text-[#f2ad6f]"
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
                    onClick={() => updateInputs(() => {
                      setTrajectoryMode("high");
                      setDirectDistance((prev) => Math.max(735, Math.min(2629, prev)));
                    })}
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
                    onClick={() => updateInputs(() => {
                      setTrajectoryMode("low");
                      setDirectDistance((prev) => Math.max(1181, Math.min(2629, prev)));
                    })}
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
                  onClick={() => updateInputs(() => setMapId(m))}
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
      <div className="relative overflow-hidden rounded-[6px] border border-[#3b5744] bg-[#111613] p-5" data-fire-solution-panel="true">
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
                {((Math.round(solution.azimuthDegrees * 10) / 10) % 360).toFixed(1)}°
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
                {rangeEnvelope.minRangeMeters}m - {rangeEnvelope.maxRangeMeters}m
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
                <button type="button" onClick={cancelCountdown} className="mt-2 rounded-lg border border-[#34453b] px-3 py-1 text-xs text-[#c4d2ca]">
                  {copy.cancelCountdown}
                </button>
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
                className="group relative flex items-center justify-center gap-2 rounded-[6px] border border-[#528d68] bg-[#24583a] px-6 py-4 text-sm font-bold text-white transition-colors hover:border-[#7ceb9e] hover:bg-[#2d6a46] disabled:opacity-40"
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
                onClick={() => updateInputs(() => setDirectHeightDelta((prev) => prev - 5))}
                className="rounded border border-[#3b4e42] bg-[#141d17] px-2 py-0.5 hover:bg-[#223328]"
              >
                -5m
              </button>
              <span className="px-1 font-bold text-[#8ce2ad]">
                {directHeightDelta >= 0 ? `+${directHeightDelta}` : directHeightDelta} m
              </span>
              <button
                type="button"
                onClick={() => updateInputs(() => setDirectHeightDelta((prev) => prev + 5))}
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
        <div className="rounded-[6px] border border-[#344039] bg-[#0c120f] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPlaceTargetNext(false)}
                aria-pressed={!placeTargetNext}
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
                aria-pressed={placeTargetNext}
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
              onClick={() => updateInputs(() => {
                setGunPoint({x: 0.48, y: 0.52});
                setTargetPoint({x: 0.50, y: 0.50});
                setMapCursor({x: 0.50, y: 0.50});
                setPlaceTargetNext(true);
              })}
              className="flex items-center gap-1 rounded-lg border border-[#34453b] bg-[#141c18] px-2.5 py-1 text-xs text-[#8da095] hover:bg-[#202e26]"
            >
              <RotateCcw size={13} />
              <span>{copy.resetButton}</span>
            </button>
          </div>

          {/* Interactive Map Canvas Area */}
          <p id="artillery-map-instructions" className="mb-2 text-xs text-[#a8b8ae]">{copy.mapKeyboardInstructions}</p>
          <p id="artillery-map-cursor" role="status" className="mb-3 text-xs text-[#8ce2ad]">
            {copy.mapCursor}: {formatGridCoordinate(mapCursor, mapId)} · {placeTargetNext ? copy.targetPosition : copy.gunPosition}
          </p>
          <div
            onClick={handleMapClick}
            onKeyDown={handleMapKeyDown}
            tabIndex={0}
            role="button"
            aria-label={copy.selectMap}
            aria-describedby="artillery-map-instructions artillery-map-cursor"
            className="group relative aspect-square w-full cursor-crosshair overflow-hidden rounded-lg border border-[#394d40] bg-black select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8ce2ad]"
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
                r={(rangeEnvelope.maxRangeMeters / mapSpec.sizeMeters) * 100}
                fill="rgba(124, 235, 158, 0.04)"
                stroke="#68c58f"
                strokeWidth="0.4"
                strokeDasharray="1.5 1.5"
              />

              {/* Range Circle (Min Range) */}
              <circle
                cx={gunPoint.x * 100}
                cy={gunPoint.y * 100}
                r={(rangeEnvelope.minRangeMeters / mapSpec.sizeMeters) * 100}
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
              <circle cx={mapCursor.x * 100} cy={mapCursor.y * 100} r="1.2" fill="none" stroke="white" strokeWidth="0.4" className="opacity-0 group-focus:opacity-100" />
            </svg>

            {/* Gun Marker (HTML Overlay) */}
            <div
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-none"
              style={{left: `${gunPoint.x * 100}%`, top: `${gunPoint.y * 100}%`}}
            >
              <div className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#10b981]">
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
              <div className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#ef4444]">
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
        <div className="rounded-[6px] border border-[#344039] bg-[#0c120f] p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#8ce2ad]">
            {copy.keypadTitle}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Distance Slider & Quick Adjusters */}
            <div>
              <label id="artillery-distance-label" htmlFor="artillery-distance" className="text-xs font-semibold text-[#8ca094]">
                {copy.directDistanceLabel}
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  aria-labelledby="artillery-distance-label"
                  min={rangeEnvelope.minRangeMeters}
                  max={rangeEnvelope.maxRangeMeters}
                  value={directDistance}
                  onChange={(e) => updateInputs(() => setDirectDistance(Number(e.target.value)))}
                  className="h-2 flex-1 cursor-pointer accent-[#62b984]"
                />
                <input
                  type="number"
                  id="artillery-distance"
                  value={directDistance}
                  onChange={(e) => updateInputs(() => setDirectDistance(Number(e.target.value)))}
                  className="w-24 rounded border border-[#384c3f] bg-[#141e17] px-2 py-1 text-center font-mono text-sm font-bold text-white"
                />
              </div>
              <div className="mt-3 flex gap-2">
                {[-50, -10, 10, 50].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => updateInputs(() =>
                      setDirectDistance((prev) =>
                        Math.max(rangeEnvelope.minRangeMeters, Math.min(rangeEnvelope.maxRangeMeters, prev + delta))
                      )
                    )}
                    className="flex-1 rounded border border-[#34463b] bg-[#131c16] py-1 text-xs font-semibold text-[#8ce2ad] hover:bg-[#202e25]"
                  >
                    {delta > 0 ? `+${delta}m` : `${delta}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Azimuth Angle Input */}
            <div>
              <label id="artillery-azimuth-label" htmlFor="artillery-azimuth" className="text-xs font-semibold text-[#8ca094]">
                {copy.directAzimuthLabel}
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  aria-labelledby="artillery-azimuth-label"
                  min={0}
                  max={359}
                  value={normalizeAzimuth(directAzimuth)}
                  onChange={(e) => updateInputs(() => setDirectAzimuth(Number(e.target.value)))}
                  className="h-2 flex-1 cursor-pointer accent-[#62b984]"
                />
                <input
                  type="number"
                  id="artillery-azimuth"
                  step="any"
                  value={directAzimuth}
                  onChange={(e) => updateInputs(() => setDirectAzimuth(Number(e.target.value)))}
                  onBlur={() => setDirectAzimuth(normalizeAzimuth(directAzimuth))}
                  className="w-24 rounded border border-[#384c3f] bg-[#141e17] px-2 py-1 text-center font-mono text-sm font-bold text-white"
                />
              </div>
              <div className="mt-3 flex gap-2">
                {[0, 90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => updateInputs(() => setDirectAzimuth(deg))}
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
          className="group flex flex-col justify-between rounded-[6px] border border-[#344039] bg-[#111613] p-4 transition-colors hover:border-[#69c78f] hover:bg-[#151d18]"
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
          className="group flex flex-col justify-between rounded-[6px] border border-[#344039] bg-[#111613] p-4 transition-colors hover:border-[#69c78f] hover:bg-[#151d18]"
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
          className="group flex flex-col justify-between rounded-[6px] border border-[#344039] bg-[#111613] p-4 transition-colors hover:border-[#69c78f] hover:bg-[#151d18]"
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
      <div className="rounded-[6px] border border-[#3c5645] bg-[#111613] p-5">
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
