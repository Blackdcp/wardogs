import type {Locale} from "@/config/site";

const en = {
  title: "Distance", measure: "Measure distance", reference: "Reference segment", center: "Set endpoint at view center", clear: "Clear measurement", close: "Close measurement",
  uncalibrated: "Image distance only - no verified meter scale", calibrated: "User-calibrated estimate - not game-verified",
  pixels: "Image pixels", estimate: "Estimated horizontal distance", bounds: "Bounds from supplied errors",
  waiting: "Endpoints", referenceLength: "Reference image length", distance: "Reference horizontal distance (m)",
  distanceError: "Reference distance error (+/- m)", pointError: "Each endpoint error (image px)", source: "Reference source / observation", build: "Observed game build",
  apply: "Apply calibration", remove: "Remove calibration", invalid: "Calibration needs two separated reference points, a positive distance, smaller distance error, endpoint errors smaller than half the reference length, a source and a build.",
  limits: "Uniform image scale assumed. Bounds cover supplied distance and endpoint errors only; projection, terrain and build mismatch are unverified. Not route length or line-of-sight range.",
  ballistics: "Ballistics unavailable: build-matched gravity, muzzle velocity, drag, elevation and platform attitude are not verified.",
  privacy: "Reference notes and build are included in shared links.", invalidLink: "Measurement link rejected: invalid calibration, map or asset version.",
};
export type MapMeasurementCopy = typeof en;
const zh: MapMeasurementCopy = {
  title: "测距", measure: "测量距离", reference: "校准基准线", center: "以视角中心设置端点", clear: "清除测量", close: "关闭测距",
  uncalibrated: "仅图片距离：无已验证的米制比例", calibrated: "用户校准估算：未经游戏实测验证",
  pixels: "图片像素", estimate: "估算水平距离", bounds: "基于所填误差的范围",
  waiting: "端点", referenceLength: "基准线图片长度", distance: "基准水平距离（米）", distanceError: "基准距离误差（正负米）", pointError: "每个端点误差（图片像素）", source: "基准来源或观测记录", build: "观测的游戏版本",
  apply: "应用校准", remove: "移除校准", invalid: "校准需要两个不同的基准点、正距离、小于距离的误差、小于基准线长度一半的端点误差，以及来源和游戏版本。",
  limits: "假设图片比例均匀。范围仅包含填写的距离及端点误差；投影、地形及版本差异未验证。不是路线长度或视线斜距。",
  ballistics: "弹道解算不可用：尚未验证对应游戏版本的重力、初速、阻力、高程及平台姿态。",
  privacy: "分享链接包含基准记录和游戏版本。", invalidLink: "测距链接已拒绝：校准、地图或素材版本无效。",
};
const translations: Record<Locale, MapMeasurementCopy> = {
  en, "zh-cn": zh,
  de: {
    title: "Entfernung", measure: "Entfernung messen", reference: "Referenzstrecke", center: "Endpunkt in der Ansichtsmitte setzen", clear: "Messung löschen", close: "Messung schließen",
    uncalibrated: "Nur Bildabstand: kein bestätigter Metermaßstab", calibrated: "Vom Nutzer kalibrierte Schätzung: nicht im Spiel bestätigt",
    pixels: "Bildpixel", estimate: "Geschätzte horizontale Entfernung", bounds: "Grenzen aus den angegebenen Fehlern",
    waiting: "Endpunkte", referenceLength: "Referenzlänge im Bild", distance: "Horizontale Referenzentfernung (m)", distanceError: "Fehler der Referenzentfernung (+/- m)", pointError: "Fehler je Endpunkt (Bildpixel)", source: "Referenzquelle / Beobachtung", build: "Beobachtete Spielversion",
    apply: "Kalibrierung anwenden", remove: "Kalibrierung entfernen", invalid: "Erforderlich sind zwei getrennte Referenzpunkte, eine positive Entfernung, ein kleinerer Entfernungsfehler, Endpunktfehler unter der halben Referenzlänge sowie Quelle und Spielversion.",
    limits: "Ein gleichmäßiger Bildmaßstab wird angenommen. Die Grenzen berücksichtigen nur die angegebenen Entfernungs- und Endpunktfehler. Projektion, Gelände und Versionsunterschiede sind unbestätigt. Keine Weglänge oder Sichtlinienentfernung.",
    ballistics: "Ballistik nicht verfügbar: Schwerkraft, Mündungsgeschwindigkeit, Widerstand, Höhen und Plattformneigung sind für diese Spielversion nicht bestätigt.",
    privacy: "Referenznotizen und Spielversion sind in geteilten Links enthalten.", invalidLink: "Messlink abgelehnt: ungültige Kalibrierung, Karte oder Bildversion.",
  },
  ru: {
    title: "Расстояние", measure: "Измерить расстояние", reference: "Опорный отрезок", center: "Поставить конец отрезка в центре вида", clear: "Очистить измерение", close: "Закрыть измерение",
    uncalibrated: "Только расстояние на изображении: масштаб в метрах не подтверждён", calibrated: "Оценка по калибровке пользователя: не проверена в игре",
    pixels: "Пиксели изображения", estimate: "Оценка горизонтального расстояния", bounds: "Границы по указанным погрешностям",
    waiting: "Концы отрезка", referenceLength: "Длина опорного отрезка на изображении", distance: "Опорное горизонтальное расстояние (м)", distanceError: "Погрешность опорного расстояния (+/- м)", pointError: "Погрешность каждой точки (пиксели)", source: "Источник / запись наблюдения", build: "Наблюдаемая версия игры",
    apply: "Применить калибровку", remove: "Удалить калибровку", invalid: "Нужны две разные опорные точки, положительное расстояние, меньшая погрешность расстояния, погрешность каждой точки менее половины длины опорного отрезка, источник и версия игры.",
    limits: "Предполагается равномерный масштаб изображения. Границы учитывают только указанные погрешности расстояния и точек. Проекция, рельеф и различия версий не проверены. Это не длина маршрута и не наклонная дальность.",
    ballistics: "Баллистика недоступна: гравитация, начальная скорость, сопротивление, высоты и наклон платформы не проверены для этой версии игры.",
    privacy: "Записи об источнике и версия игры входят в ссылку для обмена.", invalidLink: "Ссылка измерения отклонена: неверная калибровка, карта или версия изображения.",
  },
  "pt-br": {
    title: "Distância", measure: "Medir distância", reference: "Segmento de referência", center: "Definir extremidade no centro da vista", clear: "Limpar medição", close: "Fechar medição",
    uncalibrated: "Apenas distância na imagem: sem escala métrica verificada", calibrated: "Estimativa calibrada pelo usuário: não verificada no jogo",
    pixels: "Pixels da imagem", estimate: "Distância horizontal estimada", bounds: "Limites com base nos erros informados",
    waiting: "Extremidades", referenceLength: "Comprimento de referência na imagem", distance: "Distância horizontal de referência (m)", distanceError: "Erro da distância de referência (+/- m)", pointError: "Erro de cada extremidade (pixels)", source: "Fonte / registro da observação", build: "Versão observada do jogo",
    apply: "Aplicar calibração", remove: "Remover calibração", invalid: "São necessários dois pontos de referência distintos, distância positiva, erro de distância menor que a distância, erros de ponto menores que metade do segmento, fonte e versão do jogo.",
    limits: "Pressupõe escala uniforme da imagem. Os limites incluem apenas os erros informados de distância e pontos. Projeção, terreno e diferenças entre versões não foram verificados. Não é comprimento de rota nem distância em linha de visada.",
    ballistics: "Balística indisponível: gravidade, velocidade inicial, arrasto, elevação e inclinação da plataforma não foram verificados para esta versão do jogo.",
    privacy: "As notas da referência e a versão do jogo são incluídas nos links compartilhados.", invalidLink: "Link de medição rejeitado: calibração, mapa ou versão da imagem inválidos.",
  },
  ja: {
    title: "距離", measure: "距離を測定", reference: "基準線", center: "表示の中心に端点を設定", clear: "測定をクリア", close: "測定を閉じる",
    uncalibrated: "画像上の距離のみ：メートル単位の縮尺は未検証", calibrated: "ユーザー校正による推定値：ゲーム内では未検証",
    pixels: "画像ピクセル", estimate: "推定水平距離", bounds: "入力した誤差に基づく範囲",
    waiting: "端点", referenceLength: "画像上の基準線の長さ", distance: "基準水平距離（m）", distanceError: "基準距離の誤差（+/- m）", pointError: "各端点の誤差（画像ピクセル）", source: "基準の出典・観測記録", build: "観測したゲームのバージョン",
    apply: "校正を適用", remove: "校正を削除", invalid: "異なる2つの基準点、正の距離、距離より小さい距離誤差、基準線の半分未満の端点誤差、出典、ゲームのバージョンが必要です。",
    limits: "画像の縮尺が均一と仮定しています。範囲に含まれるのは入力した距離と端点の誤差のみです。投影、地形、バージョンの差異は未検証です。経路長や視線方向の斜距離ではありません。",
    ballistics: "弾道計算は利用不可：該当バージョンの重力、初速、抗力、標高、発射台の姿勢は未検証です。",
    privacy: "共有リンクには基準の記録とゲームのバージョンが含まれます。", invalidLink: "測定リンクを拒否しました：校正、マップ、画像バージョンのいずれかが無効です。",
  },

  pl: {title:"Odległość", measure:"Zmierz odległość", reference:"Odcinek odniesienia", center:"Ustaw punkt w środku widoku", clear:"Wyczyść pomiar", close:"Zamknij pomiar", uncalibrated:"Tylko odległość na obrazie; brak potwierdzonej skali metrycznej", calibrated:"Szacunek z kalibracji użytkownika; niezweryfikowany w grze", pixels:"Piksele obrazu", estimate:"Szacowana odległość pozioma", bounds:"Zakres z podanych błędów", waiting:"Punkty końcowe", referenceLength:"Długość odniesienia na obrazie", distance:"Pozioma odległość odniesienia (m)", distanceError:"Błąd odległości odniesienia (+/- m)", pointError:"Błąd każdego punktu (px obrazu)", source:"Źródło lub obserwacja odniesienia", build:"Zaobserwowana wersja gry", apply:"Zastosuj kalibrację", remove:"Usuń kalibrację", invalid:"Kalibracja wymaga dwóch różnych punktów, dodatniej odległości, mniejszego błędu odległości, błędów punktów mniejszych niż połowa odcinka odniesienia, źródła i wersji gry.", limits:"Założono jednolitą skalę obrazu. Zakres obejmuje tylko podane błędy odległości i punktów; odwzorowanie, teren i zgodność wersji nie są zweryfikowane. To nie długość trasy ani odległość w linii wzroku.", ballistics:"Obliczenia balistyczne niedostępne: nie zweryfikowano grawitacji, prędkości wylotowej, oporu, wysokości i orientacji platformy dla tej wersji.", privacy:"Notatki odniesienia i wersja gry są zawarte w udostępnianych linkach.", invalidLink:"Link pomiaru odrzucony: nieprawidłowa kalibracja, mapa lub wersja obrazu."},
  "zh-tw": {
    title: "測距", measure: "測量距離", reference: "校準基準線", center: "以視角中心設定端點", clear: "清除測量", close: "關閉測距",
    uncalibrated: "僅圖片距離：無已驗證的米制比例", calibrated: "使用者校準估算：未經遊戲實測驗證",
    pixels: "圖片畫素", estimate: "估算水平距離", bounds: "基於所填誤差的範圍",
    waiting: "端點", referenceLength: "基準線圖片長度", distance: "基準水平距離（米）", distanceError: "基準距離誤差（正負米）", pointError: "每個端點誤差（圖片畫素）", source: "基準來源或觀測記錄", build: "觀測的遊戲版本",
    apply: "應用校準", remove: "移除校準", invalid: "校準需要兩個不同的基準點、正距離、小於距離的誤差、小於基準線長度一半的端點誤差，以及來源和遊戲版本。",
    limits: "假設圖片比例均勻。範圍僅包含填寫的距離及端點誤差；投影、地形及版本差異未驗證。不是路線長度或視線斜距。",
    ballistics: "彈道解算不可用：尚未驗證對應遊戲版本的重力、初速、阻力、高程及平臺姿態。",
    privacy: "分享連結包含基準記錄和遊戲版本。", invalidLink: "測距連結已拒絕：校準、地圖或素材版本無效。",
}
};
export function getMapMeasurementCopy(locale: string): MapMeasurementCopy { return translations[locale as Locale] ?? en; }
