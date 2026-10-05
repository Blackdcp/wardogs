"use client";

import Image from "next/image";
import {useEffect, useId, useRef, useState} from "react";
import {ExternalLink, Maximize2, RotateCcw, X, ZoomIn, ZoomOut} from "lucide-react";
import type {Locale} from "@/config/site";
import type {CatalogueMediaSource} from "@/features/catalogue/catalogue-media-sources";
import {assetPath} from "@/lib/assets";
import {ItemImageInspection} from "./item-image-inspection";

const english = {
  open: "Inspect image", close: "Close image", actual: "Actual pixels", fit: "Fit image", file: "Open stored image", source: "Image source", scope: "Source and processing notes",
  unknown: "No image-specific source record is available.", processing: "Displayed file is the site's stored image. Crop, re-encoding and other processing are not fully recorded; it is not presented as the untouched source original. Source attribution is not independent license certification.",
  retrieved: "Recorded", captured: "Source frame", failed: "Image could not load", retry: "Retry", loading: "Loading image",
};
export const imageViewerCopyByLocale: Record<Locale, typeof english> = {
  en: english,
  "zh-cn": {open: "查看大图", close: "关闭大图", actual: "原始像素", fit: "适应窗口", file: "打开本站保存图片", source: "图片来源", scope: "来源与加工说明", unknown: "暂无这张图片的独立来源记录。", processing: "展示的是本站保存的图片。裁切、重编码等加工记录尚不完整，不称为来源的未加工原图。标注来源不等于独立许可认证。", retrieved: "记录日期", captured: "来源画面", failed: "图片加载失败", retry: "重试", loading: "图片加载中"},
  "zh-tw": {open: "檢視大圖", close: "關閉大圖", actual: "原始像素", fit: "符合視窗", file: "開啟本站儲存圖片", source: "圖片來源", scope: "來源與加工說明", unknown: "尚無這張圖片的獨立來源記錄。", processing: "展示的是本站儲存的圖片。裁切、重新編碼等加工記錄尚不完整，不稱為未加工原圖。標註來源不等於獨立許可認證。", retrieved: "記錄日期", captured: "來源畫面", failed: "圖片載入失敗", retry: "重試", loading: "圖片載入中"},
  ja: {
    open: "画像を拡大", close: "画像を閉じる", actual: "実際のピクセル", fit: "画面に合わせる", file: "保存画像を開く", source: "画像の出典", scope: "出典と加工の記録",
    unknown: "この画像に固有の出典記録はありません。",
    processing: "表示しているのは当サイトに保存された画像です。切り抜き、再エンコードなどの加工履歴は完全には記録されておらず、未加工の原本として提示するものではありません。出典の表示は、利用許諾を独立して確認・認証したことを意味しません。",
    retrieved: "記録日", captured: "出典のフレーム", failed: "画像を読み込めません", retry: "再試行", loading: "画像を読み込み中",
  },
  de: {
    open: "Bild ansehen", close: "Bild schließen", actual: "Tatsächliche Pixel", fit: "Bild einpassen", file: "Gespeichertes Bild öffnen", source: "Bildquelle", scope: "Hinweise zu Quelle und Bearbeitung",
    unknown: "Für dieses Bild liegt kein eigener Quellennachweis vor.",
    processing: "Angezeigt wird die auf dieser Website gespeicherte Bilddatei. Zuschnitt, Neukodierung und weitere Bearbeitungen sind nicht vollständig dokumentiert; die Datei wird nicht als unbearbeitetes Original der Quelle dargestellt. Die Quellenangabe ist keine unabhängige Bestätigung einer Nutzungslizenz.",
    retrieved: "Erfasst am", captured: "Einzelbild der Quelle", failed: "Bild konnte nicht geladen werden", retry: "Erneut versuchen", loading: "Bild wird geladen",
  },
  ru: {
    open: "Открыть изображение", close: "Закрыть изображение", actual: "Фактические пиксели", fit: "Вписать изображение", file: "Открыть сохранённый файл", source: "Источник изображения", scope: "Сведения об источнике и обработке",
    unknown: "Отдельные сведения об источнике этого изображения отсутствуют.",
    processing: "Показан файл изображения, сохранённый на этом сайте. Кадрирование, перекодирование и другие изменения задокументированы не полностью; файл не выдаётся за необработанный оригинал из источника. Указание источника не является независимым подтверждением лицензии на использование.",
    retrieved: "Дата записи", captured: "Кадр источника", failed: "Не удалось загрузить изображение", retry: "Повторить", loading: "Загрузка изображения",
  },
  "pt-br": {
    open: "Inspecionar imagem", close: "Fechar imagem", actual: "Pixels reais", fit: "Ajustar imagem", file: "Abrir imagem salva", source: "Fonte da imagem", scope: "Notas sobre a fonte e o processamento",
    unknown: "Não há um registro de fonte específico para esta imagem.",
    processing: "O arquivo exibido é a imagem armazenada neste site. Recortes, recodificação e outros processamentos não estão totalmente documentados; o arquivo não é apresentado como o original sem alterações da fonte. A atribuição da fonte não constitui uma certificação independente da licença de uso.",
    retrieved: "Data do registro", captured: "Quadro da fonte", failed: "Não foi possível carregar a imagem", retry: "Tentar novamente", loading: "Carregando imagem",
  },
  pl: {
    open: "Obejrzyj obraz", close: "Zamknij obraz", actual: "Oryginalne piksele", fit: "Dopasuj obraz", file: "Otwórz zapisany obraz", source: "Źródło obrazu", retry: "Ponów",
    scope: "Źródło i obróbka obrazu", unknown: "Brak osobnego zapisu źródła tego obrazu.",
    processing: "Wyświetlany plik jest obrazem zapisanym przez ten serwis. Kadrowanie, ponowne kodowanie i pozostałe przekształcenia nie zostały w pełni udokumentowane; nie przedstawiamy go jako niezmienionego oryginału źródłowego. Podanie źródła nie jest niezależnym potwierdzeniem licencji.",
    retrieved: "Data zapisu", captured: "Klatka źródłowa", failed: "Nie udało się wczytać obrazu", loading: "Wczytywanie obrazu",
  },
};
type Props = {src: string; alt: string; locale: Locale; source?: CatalogueMediaSource};
const buttonClass = "inline-flex size-11 shrink-0 items-center justify-center rounded border border-[#506459] text-white hover:bg-[#2e4538]";

export function ItemImageViewer({src, alt, locale, source}: Props) {
  const [open, setOpen] = useState(false);
  const [actual, setActual] = useState(false);
  const [load, setLoad] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const copy = imageViewerCopyByLocale[locale];
  const file = assetPath(src);
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);
  function close() { dialog.current?.close(); setOpen(false); trigger.current?.focus(); }

  return <figure className="mt-8 border border-[#2c3631] bg-[#151b18] p-2">
    <button ref={trigger} aria-label={`${copy.open}: ${alt}`} title={copy.open} className="group relative block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-[#9adeb4]" onClick={() => {setLoad("loading"); setActual(false); setOpen(true);}}>
      <Image alt={alt} className="aspect-video w-full object-contain" height={720} loading="eager" src={file} width={1280} />
      <span className="absolute bottom-2 right-2 flex size-11 items-center justify-center rounded border border-[#617669] bg-[#122019]/95 text-white"><Maximize2 size={20} aria-hidden="true" /></span>
    </button>
    <dialog ref={dialog} aria-labelledby={`${id}-title`} className="m-auto max-h-[94dvh] w-[min(1100px,96vw)] max-w-none overflow-y-auto rounded border border-[#506459] bg-[#101813] p-0 text-white backdrop:bg-black/85" onCancel={close} onClose={() => {setOpen(false); trigger.current?.focus();}} onClick={(event) => {if (event.target === event.currentTarget) {const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();}}}>
      {open && <>
        <header className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-[#43574a] bg-[#101813] p-3">
          <h2 id={`${id}-title`} className="min-w-0 flex-1 break-words text-sm font-semibold">{alt}</h2>
          <button className={buttonClass} aria-label={actual ? copy.fit : copy.actual} title={actual ? copy.fit : copy.actual} onClick={() => setActual(!actual)}>{actual ? <ZoomOut size={20} /> : <ZoomIn size={20} />}</button>
          <a href={file} target="_blank" rel="noreferrer" className={buttonClass} aria-label={copy.file} title={copy.file}><ExternalLink size={20} /></a>
          <button className={buttonClass} aria-label={copy.close} title={copy.close} onClick={close}><X size={20} /></button>
        </header>
        <div className="max-h-[64dvh] min-h-[180px] overflow-auto bg-[#070b09] p-2" data-item-image-canvas>
          {load === "loading" && <p role="status" className="p-4 text-center">{copy.loading}</p>}
          {load === "error" && <div role="alert" className="p-4 text-center"><p>{copy.failed}</p><button className="mx-auto mt-3 flex min-h-11 items-center gap-2 rounded border px-4" onClick={() => {setLoad("loading"); setAttempt((value) => value + 1);}}><RotateCcw size={18} />{copy.retry}</button></div>}
          {/* Inspect the stored bytes, without Next image resizing or invented original-source URLs. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={`${src}-${attempt}`} data-item-full-image src={`${file}${attempt ? `?retry=${attempt}` : ""}`} alt={alt}
            className={load === "error" ? "hidden" : "block"} style={{width: actual ? dimensions.width || 1280 : "100%", maxWidth: actual ? "none" : "100%", maxHeight: actual ? "none" : "60dvh", objectFit: "contain"}}
            onLoad={(event) => {setDimensions({width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight}); setLoad("ready");}} onError={() => setLoad("error")} />
        </div>
        <section className="space-y-2 border-t border-[#43574a] p-4 text-xs leading-6 text-[#bacbc0]" data-item-image-provenance>
          {load === "ready" && <p className="font-mono text-[#9adeb4]">{dimensions.width} × {dimensions.height} px</p>}
          <h3 className="text-sm font-semibold text-white">{copy.scope}</h3>
          {source ? <><p>{copy.source}: {source.sourceUrl ? <a className="break-words text-[#9adeb4] underline" href={source.sourceUrl} title={`${copy.source}: ${source.sourceLabel}`} target="_blank" rel="noreferrer">{source.sourceLabel}</a> : source.sourceLabel}</p><p>{copy.retrieved}: {source.retrievedAt}{source.capturedAt ? ` · ${copy.captured}: ${source.capturedAt}` : ""}</p><p>{source.usageNote}</p></> : <p>{copy.unknown}</p>}
          <ItemImageInspection inspection={source?.inspection} locale={locale} />
          <p>{copy.processing}</p>
        </section>
      </>}
    </dialog>
  </figure>;
}
