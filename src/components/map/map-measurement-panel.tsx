"use client";

import {useId, useState} from "react";
import {Check, Crosshair, RotateCcw, Trash2, X} from "lucide-react";
import {getMapPlannerCopy} from "@/features/maps/map-planner-copy";
import {getMapMeasurementCopy} from "@/features/maps/map-measurement-copy";
import {imageDistance, mapMeasurementSchema, resolveMapDistance, type MapMeasurement, type MeasurementMode} from "@/features/maps/map-measurement";

type Props = {
  state: MapMeasurement; locale: string; mode: MeasurementMode;
  onChange: (state: MapMeasurement) => void; onMode: (mode: MeasurementMode) => void;
  onCenter: () => void; onClose: () => void; ready: boolean;
};
const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded border border-[#43534a] px-3 text-sm text-white hover:bg-[#304538] disabled:opacity-40";
const input = "mt-1 h-11 w-full min-w-0 rounded border border-[#46594d] bg-[#111b15] px-2 text-sm text-white";
export function MapMeasurementPanel({state, locale, mode, onChange, onMode, onCenter, onClose, ready}: Props) {
  const copy = getMapMeasurementCopy(locale);
  const plannerCopy = getMapPlannerCopy(locale);
  const id = useId();
  const [error, setError] = useState(false);
  const result = resolveMapDistance(state.points, state.map, state);
  const number = (value: number) => new Intl.NumberFormat(locale, {maximumSignificantDigits: 4}).format(value);
  const endpoints = mode === "calibrate" ? state.reference : state.points;
  return <section className="border-t border-[#43534a] p-3 text-sm text-[#bacbc0]" data-map-measurement data-clarity-mask="true">
    <div className="flex flex-wrap items-center gap-2">
      <fieldset className="flex min-w-0 flex-wrap gap-3"><legend className="sr-only">{copy.title}</legend>
        {(["measure", "calibrate"] as const).map((value) => <label className="flex min-h-11 items-center gap-2" key={value}><input type="radio" name={`${id}-mode`} checked={mode === value} onChange={() => onMode(value)} />{value === "measure" ? copy.measure : copy.reference}</label>)}
      </fieldset>
      <button type="button" className={button} title={copy.center} aria-label={copy.center} disabled={!ready} onClick={onCenter}><Crosshair size={18} /></button>
      <button type="button" className={button} title={copy.clear} aria-label={copy.clear} onClick={() => {onChange({...state, ...(mode === "measure" ? {points: []} : {reference: [], calibration: undefined})}); setError(false);}}><RotateCcw size={18} /></button>
      <button type="button" className={`${button} ml-auto`} title={copy.close} aria-label={copy.close} onClick={onClose}><X size={18} /></button>
    </div>
    <p className="mt-2 text-[#d7bb73]" data-measurement-provenance>{state.calibration ? copy.calibrated : plannerCopy.nominalScale}</p>
    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2" aria-live="polite">
      <p>{copy.waiting}: {endpoints.length}/2</p>
      {result && <p data-image-distance>{copy.pixels}: {number(result.pixels)} px</p>}
      {result?.meters !== undefined && <p data-measured-distance>{copy.estimate}: {number(result.meters)} m</p>}
      {result?.lowerMeters !== undefined && result.upperMeters !== undefined && <p data-measurement-bounds>{copy.bounds}: {number(result.lowerMeters)} - {number(result.upperMeters)} m</p>}
    </div>
    {mode === "calibrate" && <form key={state.calibration ? "saved" : "draft"} className="mt-3" onSubmit={(event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const numeric = (key: string) => {const value = String(data.get(key) ?? "").trim(); return value ? Number(value) : NaN;};
      const parsed = mapMeasurementSchema.safeParse({...state, calibration: {
        provenance: "user-supplied", distanceMeters: numeric("distanceMeters"), distanceErrorMeters: numeric("distanceErrorMeters"), pointErrorPixels: numeric("pointErrorPixels"), source: data.get("source"), build: data.get("build"),
      }});
      setError(!parsed.success);
      if (parsed.success) {onChange(parsed.data); onMode("measure");}
    }}>
      <p className="mb-2">{copy.referenceLength}: {state.reference.length === 2 ? `${number(imageDistance(state.reference)!)} px` : "--"}</p>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {([
          ["distanceMeters", copy.distance], ["distanceErrorMeters", copy.distanceError], ["pointErrorPixels", copy.pointError],
        ] as const).map(([key, label]) => <label className="min-w-0" key={key}>{label}<input className={input} type="number" name={key} required min="0" step="any" defaultValue={state.calibration?.[key] ?? ""} /></label>)}
        <label className="min-w-0 sm:col-span-2">{copy.source}<input className={input} name="source" required maxLength={240} defaultValue={state.calibration?.source ?? ""} /></label>
        <label className="min-w-0">{copy.build}<input className={input} name="build" required maxLength={80} defaultValue={state.calibration?.build ?? ""} /></label>
      </div>
      <button className={`${button} mt-3`} type="submit" disabled={!ready || state.reference.length !== 2}><Check size={18} />{copy.apply}</button>
      {error && <p role="alert" className="mt-2 text-[#edb2b2]">{copy.invalid}</p>}
    </form>}
    {state.calibration && <div className="mt-3 flex flex-wrap items-start gap-3">
      <p className="min-w-0 flex-1 break-words" data-calibration-source>{copy.source}: {state.calibration.source}<br />{copy.build}: {state.calibration.build}</p>
      <button type="button" className={button} title={copy.remove} aria-label={copy.remove} onClick={() => onChange({...state, calibration: undefined})}><Trash2 size={18} /></button>
    </div>}
    <p className="mt-3 text-xs leading-5">{plannerCopy.limits}</p>
    <p className="mt-1 text-xs leading-5">{copy.privacy}</p>
  </section>;
}
