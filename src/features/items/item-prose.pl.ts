import type {WardogsItem} from "./item-library";

type ItemProse = Pick<WardogsItem, "summary" | "description" | "role" | "strengths" | "cautions" | "confirmedFacts" | "unconfirmedFacts">;
type AuthoredProse = Omit<ItemProse, "confirmedFacts">;

const authored: Record<string, AuthoredProse> = {
  mortar: {
    summary: "Narzędzie ostrzału pośredniego do wywierania presji na skupiska graczy na dachach, wieżach, w obronie FOB i w statycznych walkach o cele.",
    description: "Moździerz to pierwszy element uzbrojenia WARDOGS zasługujący na osobną stronę, ponieważ materiały wideo pokazują, że wzbudza rzeczywiste zainteresowanie w wyszukiwarkach. Traktuj tę stronę jako poradnik taktyczny dotyczący warunków użycia, przeciwdziałania i dowodów, a nie ostateczną tabelę statystyk.",
    role: "Wykorzystuj moździerze, aby zamieniać meldunki sojuszników w presję i wypierać przeciwników z przewidywalnych pozycji.",
    strengths: [
      "Kara graczy skupionych na dachach, wieżach i oczywistych podejściach do celu.",
      "Może osłabić obronę FOB, zanim nadejdzie natarcie piechoty lub pojazdów.",
      "Nagradza oddziały, które przekazują oznaczenia celów i korekty ostrzału.",
    ],
    cautions: [
      "Ostateczne obrażenia, czas przeładowania, limity amunicji i zasady odblokowania nie są potwierdzone.",
      "Obsługa moździerza może znaleźć się pod presją, jeśli wrogowie zlokalizują stanowisko ogniowe.",
      "Niedokładne informacje sprawiają, że strzały stają się zgadywaniem, zamiast dawać wiarygodne rezultaty.",
    ],
  },
  "mobile-fob": {
    summary: "Rozstawiana wysunięta baza operacyjna, która stanowi oparcie dla zaopatrzenia, presji związanej z odradzaniem, obrony i kontroli Hot Zone.",
    description: "Mobilne FOB to najbardziej wyrazisty element warstwy strategicznej WARDOGS. Łączą logistykę, teren, dostawy zaopatrzenia, obronę i presję na cele, dlatego zasługują na obszerniejsze omówienie niż krótki wpis o wyposażeniu.",
    role: "Stawiaj FOB tam, gdzie sojusznicy mogą uzupełniać zapasy, bronić pozycji, odbierać dostawy i reagować na pobliskie zagrożenia.",
    strengths: [
      "Tworzy wysunięty punkt dostępu do amunicji, bandaży, materiałów i podtrzymywania tempa działań zespołu.",
      "Materiały sprzed premiery pokazują możliwość wsparcia ulepszeń obronnych, takich jak mury, okopy, moździerze i środki przeciwlotnicze.",
      "Sprawia, że ukształtowanie terenu i dostęp dla dostaw stają się istotnymi decyzjami strategicznymi.",
    ],
    cautions: [
      "FOB wymaga zaopatrzenia i obsługi przez sojuszników, zamiast bez końca utrzymywać się samodzielnie.",
      "Złe położenie może narażać dostawy i podnosić koszt obrony bazy.",
      "Dokładne menu budowy, koszty ulepszeń i ostateczne zasady nie są potwierdzone.",
    ],
  },
  littlebird: {
    summary: "Szybki pojazd śmigłowcowy do rozpoznania, desantu, zmiany pozycji i niespodziewanego wywierania presji.",
    description: "Nagrania śmigłowca typu Littlebird pozwalają przygotować praktyczną stronę o pojeździe, zanim gotowa będzie pełna baza pojazdów. Najbardziej użyteczne jest omówienie mobilności i ryzyka, a nie ostatecznych statystyk pancerza lub uzbrojenia.",
    role: "Transportuj oddziały, rozpoznawaj zagrożenia i szybko zmieniaj pozycję, gdy trasy lądowe są zbyt wolne lub pozostają pod ostrzałem.",
    strengths: [
      "Szybka zmiana pozycji na rozległym polu walki.",
      "Przydatny do rozpoznania i wysadzania sojuszników w pobliżu punktów nacisku.",
      "Zmusza pilotów i oddziały lądowe do uwzględniania zagrożeń w pionie.",
    ],
    cautions: [
      "Ostateczne prowadzenie, wytrzymałość, liczba miejsc i zestaw uzbrojenia nie są potwierdzone.",
      "Pojazdy powietrzne mogą szybko przyciągać uwagę podczas dużych starć.",
      "Nieudane lądowanie może zamienić korzyść z transportu w utratę całego oddziału.",
    ],
  },
  tank: {
    summary: "Ciężki pojazd do przełamywania kierunków walki, zagrażania skupionym pozycjom i zmuszania piechoty do respektowania pancerza.",
    description: "Strona o czołgu powinna wyjaśniać, jak ciężki pancerz zmienia walkę w WARDOGS, bez wymyślania ostatecznych wartości opancerzenia. Najpierw jest to opis roli na polu walki, a dopiero później strona ze statystykami.",
    role: "Wykorzystuj czołgi do nacisku na odsłonięte kierunki i wspierania natarcia na cele, przy których sama piechota nie może utrzymać terenu.",
    strengths: [
      "Zmusza wrogą piechotę do zmiany tras lub zaangażowania środków przeciwdziałania.",
      "Może wpływać na walkę w otwartym terenie i wspierać natarcie na sporny obszar.",
      "Naturalnie współpracuje z zaopatrzeniem i osłoną piechoty.",
    ],
    cautions: [
      "Ostateczny pancerz, obrażenia, liczebność załogi i koszty ekonomiczne nie są potwierdzone.",
      "Czołg bez wsparcia piechoty może zostać odizolowany.",
      "Teren i zagrożenie ze strony broni przeciwpojazdowej mogą ograniczać bezpieczne trasy.",
    ],
  },
  "attack-helicopter": {
    summary: "Pojazd wsparcia powietrznego, który może sprawić, że ruch w otwartym terenie, walka na dachach i natarcie na cele staną się bardzo ryzykowne.",
    description: "Omówienie śmigłowca szturmowego powinno koncentrować się na wpływie na pole walki i sposobach przeciwdziałania, dopóki oficjalne dane premierowe nie potwierdzą dokładnego uzbrojenia i wytrzymałości.",
    role: "Wywieraj presję z powietrza, karz ruch bez osłony i zmuszaj przeciwników do planowania obrony przeciwlotniczej.",
    strengths: [
      "Kontroluje linie widzenia, które oddziały lądowe mogą przeoczyć.",
      "Może karać przemieszczanie się w skupieniu i odsłonięte pojazdy.",
      "Zwiększa znaczenie planowania obrony przeciwlotniczej wokół FOB.",
    ],
    cautions: [
      "Ostateczne systemy uzbrojenia, punkty wytrzymałości i szczegóły środków obronnych nie są potwierdzone.",
      "Wsparcie powietrzne zależy od umiejętności pilota i orientacji na polu walki.",
      "Środki przeciwlotnicze mogą szybko zmienić opłacalność agresywnych tras przelotu.",
    ],
  },
  "armored-transport": {
    summary: "Osłonięty środek przemieszczania graczy i zaopatrzenia przez niebezpieczne trasy.",
    description: "Transport opancerzony to dobry temat na wczesny wpis o pojeździe, ponieważ łączy logistyczne założenia WARDOGS z rzeczywistymi potrzebami meczu: przewozem ludzi, dostawami i wywieraniem presji bez konieczności marszu pieszo.",
    role: "Przewoź sojuszników i zaopatrzenie w stronę spornych obszarów, ograniczając narażenie na ostrzał na otwartych drogach.",
    strengths: [
      "Wspiera zmianę pozycji oddziałów i wzmacnianie linii frontu.",
      "Może uczynić dostawy bezpieczniejszymi niż przemieszczanie się pieszo bez osłony.",
      "Pasuje do tożsamości WARDOGS opartej na rolach wsparcia i dużym znaczeniu logistyki.",
    ],
    cautions: [
      "Ostateczna liczba miejsc, pancerz, działanie ładunku i cena nie są potwierdzone.",
      "Przewidywalna jazda drogą nadal może skończyć się zasadzką.",
      "Transport ma znaczenie tylko wtedy, gdy oddział dotrze tam, gdzie jest potrzebny.",
    ],
  },
  "a-91": {
    summary: "W Alpha 1 A-91 był karabinem ze ścieżki Assault XP, łączącym amunicję 5.56x45mm z ogniem pojedynczym i seriami przy masie 3.17 kg.",
    description: "A-91 w WARDOGS reprezentował kontrolowane serie wśród karabinów szturmowych Alpha 1. Nie zarejestrowano jego ceny, lecz zaobserwowany kaliber, dwa tryby ognia, masa i ścieżka Assault XP wskazują na model do rozważnego nacisku na kierunek walki, a nie podstawę założeń o balansie premierowym.",
    role: "Używaj A-91 do oddawania starannych strzałów pojedynczych na dystans i krótkich serii, gdy cel przecina bardziej ruchliwy kierunek; uwzględnij nadal nieznaną cenę zakupu, zanim uznasz go za domyślny karabin.",
    strengths: [
      "Ogień pojedynczy i serie zapewniają modelowi z Alpha 1 dwa kontrolowane rytmy prowadzenia walki.",
      "Zaobserwowany kaliber 5.56x45mm należy do najliczniejszej rodziny broni w katalogu.",
      "Zaobserwowana masa 3.17 kg jest niższa niż w zapisach FAL i Galil z wersji Alpha.",
    ],
    cautions: [
      "Nie zarejestrowano ceny zakupu w Alpha 1, więc pełne porównanie ekonomiczne nie jest możliwe.",
      "W zaobserwowanym wpisie nie było ognia ciągłego; nacisk z bliska może wymagać zdyscyplinowanych serii.",
      "Magazynki STANAG skatalogowano osobno, lecz nie potwierdzono ich zgodności konkretnie z A-91.",
    ],
    unconfirmedFacts: [
      "Nie zarejestrowano ceny z Alpha 1; ceny we wczesnym dostępie i pełnej wersji pozostają niepotwierdzone.",
      "Obrażenia, odrzut, zgodność dodatków i balans mogą zmienić się we wczesnym dostępie lub pełnej wersji.",
    ],
  },
  ak74: {
    summary: "AK74 z Alpha 1 był ważącym 3 kg karabinem ze ścieżki Assault XP, zasilanym amunicją 5.45x39mm i oferującym ogień pojedynczy oraz ciągły.",
    description: "AK74 wyróżniał się w zarejestrowanym zestawie Alpha 1 jako jedyny model korzystający z 5.45x39mm. Odrębne koszty i zaopatrzenie amunicyjne, przełącznik ognia pojedynczego/ciągłego oraz masa 3 kg określają jego przedpremierową tożsamość, mimo że nie zarejestrowano ceny u sprzedawcy.",
    role: "Utrzymuj ogień pojedynczy dla oszczędności amunicji i przełączaj się na ciągły podczas natarć z bliska, pamiętając, że AK74 wiąże wyposażenie z rzadziej współdzielonym zaopatrzeniem 5.45x39mm.",
    strengths: [
      "Ogień pojedynczy i ciągły umożliwiają zarówno miarowe strzały, jak i natychmiastowy nacisk na krótkim dystansie.",
      "Przy masie 3 kg w Alpha 1 był lżejszy od pozostałych zarejestrowanych karabinów szturmowych.",
      "Zarejestrowany bęben AK74 na 75 nabojów daje kontekst dużej pojemności przy planowaniu wyposażenia.",
    ],
    cautions: [
      "Nie zarejestrowano ceny u sprzedawcy w Alpha 1.",
      "Tylko jedna zarejestrowana broń używała 5.45x39mm, więc możliwości dzielenia się amunicją były mniejsze niż dla 5.56x45mm.",
      "Nie zarejestrowano ceny bębna na 75 nabojów, jego wpływu na obsługę ani ostatecznej dostępności.",
    ],
    unconfirmedFacts: [
      "Nie zarejestrowano ceny z Alpha 1; ceny we wczesnym dostępie i pełnej wersji pozostają niepotwierdzone.",
      "Cena bębna, ostateczny odrzut, obrażenia i ustawienia postępu pozostają niepotwierdzone dla wczesnego dostępu i pełnej wersji.",
    ],
  },
  "amp-9": {
    summary: "AMP-9 był w Alpha 1 pistoletem maszynowym ze ścieżki Medic XP za $900, używającym 9x19mm z ogniem pojedynczym i ciągłym przy zaobserwowanej masie 1.4 kg.",
    description: "AMP-9 łączył najniższą zarejestrowaną masę broni palnej wśród tych 14 modeli z wymaganiem Medic XP i udokumentowaną rodziną czterech wielkości magazynków. Dowody z Alpha 1 wskazują na mobilną broń wsparcia, której całkowity koszt zależy od wyboru magazynka i zapasu 9x19mm, a nie tylko ceny bazowej $900.",
    role: "Noś AMP-9, gdy medyk potrzebuje lekkiej broni głównej do ochrony z bliska; oszczędzaj 9x19mm ogniem pojedynczym i używaj ciągłego, gdy reanimacja lub cele sprowadzają bezpośrednie zagrożenie.",
    strengths: [
      "Masa 1.4 kg w Alpha 1 pozostawia więcej miejsca na narzędzia medyczne i ochronę.",
      "Ogień pojedynczy i ciągły pozwalają graczowi wsparcia wybrać oszczędność lub siłę ognia z bliska.",
      "Zaobserwowane magazynki AMP-9 na 15, 20, 30 i 50 nabojów umożliwiają różne kompromisy pojemności i kosztu.",
    ],
    cautions: [
      "Cena $900 z Alpha 1 nie obejmuje amunicji ani kosztów wymiany magazynków.",
      "Zaobserwowany magazynek na 50 nabojów kosztował $180, wyraźnie podnosząc koszt budżetowego pistoletu maszynowego.",
      "W dowodach katalogowych nie zarejestrowano skuteczności na dystansie, odrzutu ani spadku obrażeń.",
    ],
    unconfirmedFacts: [
      "Obrażenia, odrzut, zachowanie na dystansie i wymagania Medic XP mogą zmienić się we wczesnym dostępie lub pełnej wersji.",
      "Ceny magazynków i ich zgodność z Alpha 1 nie są potwierdzone jako wartości pełnej wersji.",
    ],
  },
  "amr-50": {
    summary: "AMR 50 był w Alpha 1 karabinem snajperskim ze ścieżki Recon XP za $8,800, strzelającym .50 Cal z zamkiem powtarzalnym i magazynkiem przy masie 12.5 kg.",
    description: "AMR 50 znajdował się na skraju zarejestrowanej ekonomii uzbrojenia: był najdroższym i najcięższym z tych 14 modeli. Amunicję .50 Cal wyceniono też na $50 za nabój i $250 za pudełko, więc każde użycie oznaczało specjalistyczne zaangażowanie zasobów Recon w Alpha 1.",
    role: "Rozstaw AMR 50 na przygotowanej pozycji obserwacyjno-ogniowej, gdzie koszt zastąpienia, masa 12.5 kg i droga amunicja są uzasadnione celami, z którymi lżejszy karabin nie poradzi sobie równie pewnie.",
    strengths: [
      "Kaliber .50 Cal nadaje modelowi odrębną rolę ciężkiego karabinu w katalogu Alpha.",
      "Zamek powtarzalny i zasilanie z magazynka pozwalają na rozważne kolejne strzały bez cyklu ładowania po każdym strzale.",
      "Zarejestrowany magazynek AMR 50 na 10 nabojów kosztował $30, dając konkretną opcję pojemności.",
    ],
    cautions: [
      "Cena zakupu $8,800 w Alpha 1 naraża na stratę dużą część trwałego salda.",
      "Przy 12.5 kg zaobserwowany karabin był zdecydowanie cięższy niż BMR-308 i karabiny szturmowe.",
      "Amunicja .50 Cal miała najwyższy zarejestrowany koszt jednostkowy, $50 za nabój, jeszcze przed ostatecznymi zmianami balansu.",
    ],
    unconfirmedFacts: [
      "Obrażenia przeciw piechocie, interakcje z pancerzem, kołysanie i obsługa mogą zmienić się we wczesnym dostępie lub pełnej wersji.",
      "Cena karabinu $8,800 i koszty amunicji .50 Cal to obserwacje z Alpha 1, a nie potwierdzona ekonomia pełnej wersji.",
    ],
  },
  "bmr-308": {
    summary: "BMR-308 był w Alpha 1 samopowtarzalnym karabinem wyborowym ze ścieżki Recon XP za $6,000, używającym .308 Winchester przy masie 3.9 kg.",
    description: "BMR-308 oferował ścieżce Recon w Alpha 1 samopowtarzalne rozwiązanie pośrednie między masywnym AMR 50 a nietypowym Compound Bow. Kaliber .308 Winchester łączył go też z FAL i wpisem wspólnego magazynka na 20 nabojów, choć nie można zakładać ostatecznej zgodności.",
    role: "Używaj BMR-308 do powtarzanego precyzyjnego ostrzału na średnich i długich liniach widzenia, zachowując środki na .308 Winchester i unikając zużywania amunicji z bliska w stylu karabinu szturmowego.",
    strengths: [
      "Ogień samopowtarzalny pozwala szybciej korygować strzały niż zaobserwowany zamek powtarzalny AMR 50.",
      "Masa 3.9 kg w Alpha 1 była łatwiejsza do udźwignięcia niż 12.5 kg ciężkiego karabinu snajperskiego.",
      "Dla rodziny FAL i BMR-308 zarejestrowano magazynek na 20 nabojów za $150.",
    ],
    cautions: [
      "Cena $6,000 w Alpha 1 sprawia, że zastąpienie utraconego karabinu jest kosztowne.",
      "Standardową amunicję .308 Winchester zaobserwowano w cenie $4 za nabój i $40 za pudełko.",
      "Zgodność optyki, obsługa magazynków, obrażenia i skuteczny zasięg nie zostały zarejestrowane jako ostateczne parametry.",
    ],
    unconfirmedFacts: [
      "Zgodność optyki, odrzut, obrażenia i ustawienia zasięgu pozostają niepotwierdzone dla wczesnego dostępu i pełnej wersji.",
      "Zaobserwowana cena Alpha $6,000 i ekonomia magazynków mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  "bushmaster-m17s": {
    summary: "Bushmaster M17S pojawił się w Alpha 1 z ceną $0 jako karabin ze ścieżki Assault XP o masie 3.17 kg, używający 5.56x45mm z ogniem pojedynczym i seriami.",
    description: "Bushmaster M17S dzielił z A-91 i KH-2002 zarejestrowany profil 5.56x45mm, ogień pojedynczy/serie i masę 3.17 kg, lecz sprzedawca wyświetlał cenę $0. Wartość tę należy traktować jako obserwację z Alpha 1, a nie dowód na bezpłatną broń dostępną na stałe po premierze.",
    role: "Traktuj M17S jako karabin szturmowy do kontrolowanych serii w materiałach z Alpha; używaj wyświetlonej ceny $0 wyłącznie do historycznych porównań wyposażenia, dopóki późniejsze wersje nie potwierdzą sposobu zdobycia.",
    strengths: [
      "Wyświetlana wartość $0 w Alpha 1 sprowadzała zarejestrowany koszt samej broni do zera.",
      "Ogień pojedynczy i serie wspierają oszczędny ostrzał zamiast wymuszać zużycie amunicji w ogniu ciągłym.",
      "Kaliber 5.56x45mm należał do najliczniej reprezentowanej rodziny amunicji w katalogu.",
    ],
    cautions: [
      "Przedpremierowa cena $0 u sprzedawcy może oznaczać dostęp początkowy, dane zastępcze lub tymczasowe ustawienia.",
      "Zaobserwowany wpis nie obejmował ognia ciągłego.",
      "Osobne wpisy magazynków STANAG nie dowodzą, że każda pojemność pasuje do M17S.",
    ],
    unconfirmedFacts: [
      "Wyświetlona cena $0 w Alpha 1 nie jest potwierdzona dla wczesnego dostępu ani pełnej wersji.",
      "Zasady zdobycia, obrażenia, odrzut i zgodność dodatków mogą zmienić się we wczesnym dostępie lub pełnej wersji.",
    ],
  },
  "compound-bow": {
    summary: "Compound Bow był w Alpha 1 bronią ze ścieżki Recon XP za $800, ważącą 1.3 kg i używającą Standard Arrows z naciąganiem i zwalnianiem cięciwy.",
    description: "Compound Bow był najlżejszym zarejestrowanym modelem i jedyną bronią z tej grupy opartą na Standard Arrows oraz wyczuciu naciągnięcia i zwolnienia cięciwy. Cena $800 w Alpha 1 czyniła go tanim na tle karabinów Recon, lecz nie zarejestrowano obrażeń strzał, możliwości ich odzyskiwania, prędkości ani pojemności.",
    role: "Używaj łuku jako lekkiego wyboru Recon, jeśli dobrze wyczuwasz naciągnięcie i zwolnienie cięciwy; noś broń krótką na sytuacje, w których konwencjonalny magazynek wybacza więcej błędów.",
    strengths: [
      "Przy masie 1.3 kg był najlżejszym spośród 14 zarejestrowanych modeli broni.",
      "Cena $800 w Alpha 1 była znacznie niższa niż ceny opcji Recon BMR-308 i AMR 50.",
      "Standard Arrows stanowią odrębny wybór zaopatrzenia poza rodzinami kalibrów broni palnej.",
    ],
    cautions: [
      "Naciąganie i zwalnianie cięciwy nie daje żadnego zaobserwowanego trybu zastępczego ognia pojedynczego ani automatycznego.",
      "Nie zarejestrowano obrażeń strzał, prędkości, opadu, możliwości odzyskiwania ani przenoszonej liczby.",
      "Katalog nie ma osobnej podstrony przedmiotu dla strzał ani potwierdzonej tabeli zgodności dodatków.",
    ],
    unconfirmedFacts: [
      "Obrażenia strzał, prędkość, możliwość odzyskiwania i pojemność pozostają niepotwierdzone dla wczesnego dostępu i pełnej wersji.",
      "Cena Alpha $800 i wymagania Recon XP mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  deagle: {
    summary: "Deagle był w Alpha 1 samopowtarzalną bronią krótką kalibru .50 AE za $900; nie zarejestrowano jego masy ani ścieżki postępu.",
    description: "Deagle kosztował w wykazie broni krótkiej Alpha 1 $900, czyli kwotę typową dla broni głównej, i używał rzadkiego kalibru .50 AE. Magazynek na siedem nabojów zarejestrowano za $50, lecz brak danych o masie i postępie pozostawia ważne pytania dotyczące wyposażenia bez odpowiedzi.",
    role: "Wybierz Deagle, gdy do planu pasuje droga, samopowtarzalna broń zapasowa o małej pojemności; przed porównaniem z tańszą bronią krótką uwzględnij amunicję .50 AE i magazynki.",
    strengths: [
      "Kaliber .50 AE był unikatowy wśród 14 zarejestrowanych modeli broni.",
      "Działanie samopowtarzalne eliminuje wolniejszy cykl naciągania i zwalniania cięciwy lub ręcznej obsługi zamka broni specjalistycznej.",
      "Zarejestrowano konkretny magazynek Deagle na siedem nabojów, dokumentując pojemność tej broni krótkiej.",
    ],
    cautions: [
      "Cena $900 w Alpha 1 była równa cenie AMP-9, jeszcze przed doliczeniem amunicji i magazynków.",
      "Zarejestrowany magazynek na siedem nabojów kosztował $50 i pozostawia mały margines błędu.",
      "Season 1 potwierdza 85. poziom Career; niezweryfikowane pozostają jedynie aktualna masa i całkowite obciążenie przy przenoszeniu.",
    ],
    unconfirmedFacts: [
      "Alpha 1 nie zawierała masy ani postępu; Season 1 potwierdza 85. poziom Career, natomiast masa pozostaje niezweryfikowana dla wczesnego dostępu lub pełnej wersji.",
      "Obrażenia, odrzut i działanie magazynków mogą różnić się od aktualnej wersji; cena u sprzedawcy $900 z Alpha 1 pozostaje niezweryfikowana dla wczesnego dostępu.",
    ],
  },
  fal: {
    summary: "FAL był w Alpha 1 karabinem ze ścieżki Assault XP za $5,500, strzelającym .308 Winchester ogniem pojedynczym lub ciągłym przy zaobserwowanej masie 4.25 kg.",
    description: "FAL był najcięższym i najdroższym zarejestrowanym karabinem szturmowym, zamieniając ekonomię popularnego 5.56x45mm na .308 Winchester i możliwość ognia ciągłego. Zarejestrowane magazynki na 20 i 30 nabojów również miały wyższe ceny niż wiele magazynków mniejszych kalibrów.",
    role: "Używaj ognia pojedynczego, aby kontrolować zużycie .308 Winchester, a ciągły zachowuj na krótki, zdecydowany nacisk, ponieważ karabin, amunicja i magazynki wiązały się w Alpha 1 ze znacznymi kosztami.",
    strengths: [
      "Ogień pojedynczy i ciągły pozwalają FAL przechodzić od precyzji do nacisku z bliska.",
      "Kaliber .308 Winchester odróżnia go od lżejszych karabinów szturmowych 5.56x45mm.",
      "Zaobserwowane wpisy magazynków na 20 i 30 nabojów dają dwa konkretne warianty pojemności.",
    ],
    cautions: [
      "Przy cenie $5,500 w Alpha 1 kosztował znacznie więcej niż zarejestrowane Galil i AMP-9.",
      "Zaobserwowana masa 4.25 kg była najwyższa wśród wpisów karabinów szturmowych Alpha.",
      "Magazynek FAL na 30 nabojów kosztował $250, a standardowe naboje .308 kosztowały $4 za sztukę.",
    ],
    unconfirmedFacts: [
      "Obrażenia, odrzut, kontrola ognia ciągłego i wymagania Assault XP mogą zmienić się we wczesnym dostępie lub pełnej wersji.",
      "Cena $5,500 i zarejestrowane koszty magazynków to obserwacje z Alpha 1, a nie potwierdzone wartości pełnej wersji.",
    ],
  },
  galil: {
    summary: "Galil był w Alpha 1 karabinem ze ścieżki Assault XP za $2,200 o masie 3.95 kg, używającym 5.56x45mm z ogniem pojedynczym i ciągłym.",
    description: "Galil pełnił w Alpha 1 rolę karabinu szturmowego ze średniej półki cenowej: droższego i cięższego niż zarejestrowane modele 5.56x45mm strzelające seriami, ale tańszego od FAL .308 i wyposażonego w ogień ciągły. Wpisy dedykowanych magazynków na 35 i 50 nabojów dostarczają przydatnego kontekstu pojemności.",
    role: "Używaj Galil jako elastycznej broni głównej do szturmu, dozując 5.56x45mm ogniem pojedynczym w otwartym terenie i korzystając z ognia ciągłego, gdy oddział skraca dystans lub oczyszcza bronioną pozycję.",
    strengths: [
      "Ogień pojedynczy i ciągły wspierają zarówno oszczędność, jak i presję na krótkim dystansie.",
      "W katalogu Alpha zarejestrowano dedykowane magazynki Galil na 35 i 50 nabojów.",
      "Cena $2,200 w Alpha 1 była znacznie niższa niż cena FAL, przy zachowaniu ognia automatycznego.",
    ],
    cautions: [
      "Zaobserwowana masa 3.95 kg była wyższa niż w A-91, AK74, M17S i KH-2002.",
      "Magazynek na 50 nabojów kosztował w Alpha 1 $110 przed doliczeniem amunicji.",
      "Odrzut, czas przeładowania, obrażenia i wpływ dodatków nie zostały zarejestrowane jako ostateczne wartości.",
    ],
    unconfirmedFacts: [
      "Odrzut, obrażenia, zgodność dodatków i ustawienia Assault XP pozostają niepotwierdzone dla wczesnego dostępu i pełnej wersji.",
      "Ceny karabinu i magazynków z Alpha 1 mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  "ggx-17": {
    summary: "GGX 17 był w Alpha 1 samopowtarzalną bronią krótką kalibru 9x19mm; nie zarejestrowano ceny, masy ani ścieżki postępu.",
    description: "GGX 17 reprezentował konwencjonalną, samopowtarzalną połowę zarejestrowanej pary broni krótkiej GGX. Kaliber 9x19mm łączy go z najtańszym zaobserwowanym pudełkiem amunicji, lecz trzy brakujące pola u sprzedawcy uniemożliwiają wiarygodne porównanie całkowitego kosztu i masy przenoszonego wyposażenia.",
    role: "Używaj GGX 17 jako broni zapasowej 9x19mm do miarowego ostrzału, a nie zamiennika zaobserwowanego ognia ciągłego GGX 18; zachowaj zapas budżetu do czasu potwierdzenia ceny zdobycia w późniejszej wersji.",
    strengths: [
      "Ogień samopowtarzalny zachęca do kontrolowanych strzałów z broni zapasowej i oszczędzania amunicji.",
      "Standardową amunicję 9x19mm zaobserwowano w cenie $1 za nabój i $10 za pudełko.",
      "Wspólny kaliber może upraszczać uzupełnianie zapasów obok AMP-9 i GGX 18.",
    ],
    cautions: [
      "We wpisie Alpha 1 brakowało ceny, masy i postępu.",
      "Zarejestrowano magazynki marki GGX na 33 i 50 nabojów, lecz nie udowodniono zgodności z konkretnym modelem.",
      "Wpis broni nie zawierał obrażeń, odrzutu, pojemności ani charakterystyki obsługi.",
    ],
    unconfirmedFacts: [
      "Ceny, masy i postępu nie zarejestrowano w Alpha 1 i pozostają one niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Zgodność magazynków, obrażenia, odrzut i pojemność mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  "ggx-18": {
    summary: "GGX 18 był w Alpha 1 bronią krótką 9x19mm z ogniem pojedynczym i ciągłym; nie zarejestrowano ceny, masy ani ścieżki postępu.",
    description: "GGX 18 różnił się od GGX 17 zaobserwowanym trybem ognia ciągłego, wprowadzając do zestawu broni krótkiej Alpha 1 rolę kompaktowej broni automatycznej. Wpis jasno potwierdza tę możliwość, lecz brak ceny, masy, postępu i potwierdzonej zgodności magazynków sprawia, że ocena opłacalności po premierze byłaby przedwczesna.",
    role: "Przy zwykłym użyciu zapasowym pozostaw GGX 18 w trybie pojedynczym, a ogień ciągły zachowuj na pilny nacisk z bliska, gdy szybkie zużycie 9x19mm jest warte utraty kontroli nad zapasem.",
    strengths: [
      "Ogień pojedynczy i ciągły czynią go bardziej elastyczną zarejestrowaną bronią krótką GGX.",
      "9x19mm miało niski zaobserwowany koszt standardowy: $1 za nabój i $10 za pudełko.",
      "Wspólny kaliber może pasować do planu zaopatrzenia oddziału opartego na AMP-9.",
    ],
    cautions: [
      "We wpisie Alpha 1 nie zarejestrowano ceny, masy ani postępu.",
      "Ogień ciągły z broni krótkiej może szybko opróżnić magazynek, nawet gdy amunicja jest tania.",
      "Wpisy magazynka GGX na 33 naboje za $70 i bębna na 50 za $110 nie dowodzą ostatecznej zgodności z GGX 18.",
    ],
    unconfirmedFacts: [
      "Ceny, masy i postępu nie zarejestrowano w Alpha 1 i pozostają one niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Ustawienia ognia ciągłego, zgodność magazynków, odrzut i obrażenia mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  judge: {
    summary: "Judge był w Alpha 1 bronią krótką kalibru .45 Colt za $250; nie zarejestrowano trybu ognia, masy ani ścieżki postępu.",
    description: "Judge miał najniższą niezerową zarejestrowaną cenę broni, $250, i był jedynym wymienionym modelem używającym .45 Colt. Katalog amunicji pokazywał pudełko za $33, lecz brak trybu ognia, masy i postępu sprawia, że jego praktyczne działanie jest mniej pewne niż cena.",
    role: "Traktuj Judge jako kandydata na broń krótką o niskim koszcie bazowym, której rzeczywisty rytm walki nadal wymaga potwierdzenia w grze; planując wymiany, uwzględnij stosunkowo drogie pudełko .45 Colt.",
    strengths: [
      "Cena $250 w Alpha 1 była najniższą zarejestrowaną niezerową ceną zakupu broni wśród tych modeli.",
      "Kaliber .45 Colt nadaje mu odrębną tożsamość zaopatrzeniową wśród broni krótkiej.",
      "Zaobserwowano pudełko amunicji .45 Colt za $33, więc przynajmniej część kosztów odtwarzania wyposażenia jest udokumentowana.",
    ],
    cautions: [
      "We wpisie broni z Alpha 1 nie zarejestrowano trybu ognia, masy ani postępu.",
      "Dla Judge nie był dostępny wpis dedykowanego magazynka ani pojemności.",
      "Cena bazowa $250 nie określa obrażeń, szybkości przeładowania, skutecznego zasięgu ani ostatecznej opłacalności.",
    ],
    unconfirmedFacts: [
      "Trybu ognia, masy i postępu nie zarejestrowano w Alpha 1 i pozostają one niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Pojemność, przeładowanie, obrażenia i cena Alpha $250 mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  "kh-2002": {
    summary: "KH-2002 był w Alpha 1 karabinem ze ścieżki Assault XP o masie 3.17 kg, używającym 5.56x45mm z ogniem pojedynczym i seriami; ceny nie zarejestrowano.",
    description: "KH-2002 uzupełniał zarejestrowaną trójkę karabinów szturmowych 5.56x45mm o masie 3.17 kg, strzelających seriami. W odróżnieniu od wyświetlonej ceny $0 M17S jego ceny w Alpha 1 nie zarejestrowano, więc nawet przy zbieżnych głównych parametrach wyboru modelu nie można sprowadzić do kosztu.",
    role: "Używaj KH-2002 do kontrolowanego ostrzału szturmowego, wybierając ogień pojedynczy na dłuższych kierunkach i serie przy krótkich oknach ekspozycji; odróżnienie jego ekonomii i obsługi nadal wymaga dowodów z późniejszych wersji.",
    strengths: [
      "Ogień pojedynczy i serie zapewniają dwa kontrolowane sposoby zużycia amunicji.",
      "Masa 3.17 kg w Alpha 1 była niższa niż w zapisach Galil i FAL.",
      "5.56x45mm było najczęściej współdzielonym zarejestrowanym kalibrem, dając szerszy kontekst zaopatrzenia oddziału.",
    ],
    cautions: [
      "Nie zarejestrowano ceny zakupu w Alpha 1.",
      "Zaobserwowany wpis nie ustala, czym obsługa różni się od A-91 lub M17S.",
      "Istnieją wpisy pojemności STANAG i optyki, lecz nie potwierdzono zgodności z KH-2002.",
    ],
    unconfirmedFacts: [
      "Nie zarejestrowano ceny z Alpha 1; ceny we wczesnym dostępie i pełnej wersji pozostają niepotwierdzone.",
      "Charakterystyczna dla modelu obsługa, obrażenia, odrzut i zgodność dodatków mogą zmienić się we wczesnym dostępie lub pełnej wersji.",
    ],
  },
  "ah-6m-miniguns": {
    summary: "AH-6M Miniguns pojawił się w Alpha 1 jako śmigłowiec bojowy za $7,000, lecz wymagania zakupu były nieczytelne.",
    description: "AH-6M Miniguns to uzbrojony przedstawiciel lekkiej rodziny AH-6 zarejestrowany u sprzedawcy w Alpha 1. Etykieta śmigłowca bojowego i cena $7,000 odróżniają go od transportowego MH-6, natomiast nieczytelne wymagania i niezarejestrowane działanie broni sprawiają, że to poradnik o roli, a nie ostateczna karta osiągów.",
    role: "Traktuj AH-6M jako lekką opcję nacisku z powietrza podczas krótkich nalotów, po czym chroń maszynę między starciami, ponieważ każda wymiana obciąża zaobserwowaną ekonomię Alpha.",
    strengths: [
      "Zaobserwowana cena $7,000 w Alpha 1 była niższa niż ceny AH-6R Rockets i Havoc.",
      "Rola śmigłowca bojowego odróżnia go od transportowego MH-6 dostępnego bez wymagań zakupu.",
      "Oznaczenie Miniguns daje oddziałom wyraźny powód do porównania go przed zakupem z AH-6R uzbrojonym w rakiety.",
    ],
    cautions: [
      "Wymagania zakupu w Alpha 1 były nieczytelne, więc nie można wnioskować o dostępności wyłącznie z ceny.",
      "Nie zarejestrowano obrażeń minigunów, amunicji, punktu zbieżności ostrzału ani skutecznego zasięgu.",
      "Wytrzymałość, wymagania dotyczące załogi, pilotaż i środki obronne pozostają nieznane.",
    ],
    unconfirmedFacts: [
      "Nieczytelne wymagania z Alpha 1 pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Skuteczność minigunów, pilotaż, wytrzymałość i cena Alpha $7,000 mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  "ah-6r-rockets": {
    summary: "AH-6R Rockets figurował w Alpha 1 jako śmigłowiec rakietowy za $12,500 z nieczytelnymi wymaganiami dostępu.",
    description: "AH-6R Rockets zamienia minigunową tożsamość lekkiej rodziny na rolę śmigłowca rakietowego i znacznie wyższą zarejestrowaną cenę. Oferta $12,500 w Alpha 1 sugeruje bardziej przemyślany zakup niż w przypadku AH-6M, lecz liczba rakiet, wybuch, przeładowanie i warunki odblokowania nie były na tyle czytelne, by uznać je za ustalone.",
    role: "Zachowuj AH-6R na zaplanowane okna nalotu, w których oddział może wskazać wartościowy cel i wesprzeć bezpieczny odwrót, zamiast narażać drogi śmigłowiec bez koordynacji.",
    strengths: [
      "Etykieta śmigłowca rakietowego wskazuje inną rolę uderzeniową niż AH-6M Miniguns.",
      "Zaobserwowane nazewnictwo rodziny czyni AH-6M bezpośrednim punktem porównania kosztu i roli.",
      "Przy cenie $12,500 w Alpha 1 kosztował mniej niż Havoc, pozostając wyspecjalizowaną maszyną bojową.",
    ],
    cautions: [
      "Wymagania zakupu były nieczytelne w materiale z Alpha 1.",
      "Nie zarejestrowano liczby rakiet, obrażeń obszarowych, celności ani uzupełniania uzbrojenia.",
      "Wysoka zaobserwowana cena zastąpienia zwiększa ryzyko nalotów bez wsparcia.",
    ],
    unconfirmedFacts: [
      "Nieczytelne wymagania z Alpha 1 pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Zapas rakiet, obrażenia, uzupełnianie, pilotaż i cena mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  bobcat: {
    summary: "Bobcat był lekkim transportem za $500, dostępnym u sprzedawcy pojazdów w Alpha 1 bez wymagań zakupu.",
    description: "Bobcat zajmował najtańszy kraniec zarejestrowanego katalogu pojazdów. Rola lekkiego transportu i zaobserwowany zakup bez wymagań czynią go najczytelniejszym punktem odniesienia dla podstawowej mobilności w Alpha 1, lecz wpis nie ustala liczby miejsc, przestrzeni ładunkowej, ochrony, prędkości ani zachowania tego dostępu w wersjach premierowych.",
    role: "Używaj Bobcat jako taniego zobowiązania transportowego do krótkich zmian pozycji i wypraw po odbiór, gdy oddział bardziej potrzebuje mobilności niż uzbrojenia, ochrony lub zdolności przewozu ładunków.",
    strengths: [
      "Zaobserwowana cena $500 była najniższa wśród 20 zarejestrowanych modeli pojazdów.",
      "W Alpha 1 widoczny był zakup bez wymagań, a wpis nie pokazywał ścieżki poziomów.",
      "Etykieta lekkiego transportu koncentruje decyzję zakupową na przemieszczaniu, nie wyposażeniu bojowym.",
    ],
    cautions: [
      "Zakup bez wymagań zaobserwowano tylko w Alpha 1 i nie stanowi on obietnicy ostatecznej dostępności.",
      "Nie zarejestrowano liczby miejsc, schowków, prędkości, wytrzymałości ani prowadzenia w terenie.",
      "Niska cena u sprzedawcy nie dowodzi niskich kosztów paliwa, napraw lub wymiany.",
    ],
    unconfirmedFacts: [
      "Zakup bez wymagań i cena $500 to obserwacje z Alpha 1, a nie potwierdzone zasady wczesnego dostępu lub pełnej wersji.",
      "Pojemność, ochrona, prowadzenie, schowki i koszty eksploatacji pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
    ],
  },
  "dune-buggy": {
    summary: "Dune Buggy pojawił się w Alpha 1 jako szybki transport za $1,500, wymagający 10. poziomu Driver.",
    description: "Dune Buggy był w zarejestrowanym katalogu transportem lądowym wyraźnie ukierunkowanym na szybkość. Wymóg 10. poziomu Driver i cena $1,500 w Alpha 1 stawiają go ponad podstawową mobilnością Bobcat, lecz określenie szybki jest etykietą roli u sprzedawcy, a nie dowodem ostatecznej prędkości maksymalnej, przyspieszenia, przyczepności czy odporności na kolizje.",
    role: "Wybieraj Dune Buggy do szybkiego zwiadu i zmiany tras, gdy czas dotarcia ma większe znaczenie niż ochrona; unikaj planów zakładających niezweryfikowaną liczbę pasażerów lub pojemność ładunkową.",
    strengths: [
      "Szybki transport był wyraźną etykietą roli tego modelu w Alpha 1.",
      "Zaobserwowana cena $1,500 była niższa niż w większych rodzinach Kodiak i Humvee.",
      "10. poziom Driver dawał czytelny wymóg postępu, zamiast nieczytelnych warunków.",
    ],
    cautions: [
      "Nie zarejestrowano ostatecznej prędkości, przyspieszenia, trakcji ani zachowania przy przewróceniu.",
      "Season 1 podaje 8. poziom Driver; wymóg 10. poziomu Driver z Alpha 1 ma znaczenie historyczne.",
      "Nie zapisano parametrów ochrony, liczby miejsc ani ładunku.",
    ],
    unconfirmedFacts: [
      "Season 1 podaje odblokowanie na ścieżce Driver za $25,000; cena zakupu pojazdu $1,500 z Alpha 1 pozostaje niezweryfikowana dla wczesnego dostępu.",
      "Prędkość, prowadzenie, wytrzymałość, miejsca i działanie ładunku mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  "flakpanzer-gepard": {
    summary: "Flakpanzer Gepard figurował w Alpha 1 jako przeciwlotniczy pojazd opancerzony za $8,000, wymagający 45. poziomu Wardog.",
    description: "Flakpanzer Gepard to wyspecjalizowany przeciwlotniczy pojazd opancerzony w zarejestrowanym zestawie, łączący wymóg postępu Wardog z ceną niższą niż L2A6 i SPH-2. Rola katalogowa wspiera interpretację ograniczania działań lotnictwa, lecz wykrywanie celów, działanie dział, pancerz, potrzeby załogi i skuteczny obszar osłony nie zostały udokumentowane jako ostateczne systemy.",
    role: "Ustaw Gepard tak, aby chronić cenne zasoby naziemne i prawdopodobne kierunki nalotu, utrzymując wsparcie lądowe w pobliżu; nie traktuj roli przeciwlotniczej jako dowodu bezpieczeństwa wobec każdego zagrożenia.",
    strengths: [
      "Przeciwlotniczy pojazd opancerzony był unikatową rolą wśród 20 zaobserwowanych wpisów pojazdów.",
      "Cena $8,000 w Alpha 1 była niższa niż obu pozostałych ciężkich jednostek ze ścieżki Wardog.",
      "45. poziom Wardog stanowił czytelny cel postępu w zarejestrowanej ofercie sprzedawcy.",
    ],
    cautions: [
      "Nie zarejestrowano zasięgu wykrywania, amunicji, obrażeń dział, kąta podniesienia ani śledzenia celu.",
      "Etykieta przeciwlotnicza nie określa ochrony przed czołgami, artylerią lub piechotą.",
      "45. poziom Wardog i cena $8,000 są wyłącznie obserwacjami sprzed premiery.",
    ],
    unconfirmedFacts: [
      "45. poziom Wardog i cena $8,000 pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Pancerz, wykrywanie celów powietrznych, skuteczność broni, potrzeby załogi i amunicja mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  havoc: {
    summary: "Cena Havoc $18,000 dotyczy wyłącznie Alpha; relacja pilota z Season 1 opisuje wyższy koszt wyposażonego lotu bojowego i skuteczne środki przeciwlotnicze.",
    description: "Havoc zajmował szczyt zaobserwowanego cennika pojazdów i miał ogólną rolę śmigłowca szturmowego, zamiast etykiety konkretnego uzbrojenia jak AH-6. Czyni go to największym zobowiązaniem ekonomicznym w powietrzu w zestawieniu Alpha 1, natomiast wyposażenie, pancerz, układ załogi i warunki dostępu pozostają niedostępne do ostatecznego porównania.",
    role: "Angażuj Havoc tylko wtedy, gdy zespół może wesprzeć zakup kosztownej maszyny szturmowej informacjami o celach, orientacją w przestrzeni powietrznej i trasą ucieczki przed skoncentrowanym ogniem zwrotnym.",
    strengths: [
      "Śmigłowiec szturmowy był jego wyraźną rolą w Alpha 1, odróżniającą go od maszyn transportowych.",
      "Cena $18,000 wyznacza najczytelniejszy wybór lotniczy wymagający dużej inwestycji w zaobserwowanej ofercie sprzedawcy.",
      "Ta rola daje przydatny punkt porównania dla tańszych wariantów szturmowych AH-6M i AH-6R.",
    ],
    cautions: [
      "Wymagania zakupu były nieczytelne, więc nie zarejestrowano drogi uzyskania dostępu.",
      "Nie zapisano uzbrojenia, pancerza, czujników, środków obronnych ani wymagań dotyczących załogi.",
      "Najnowsze twierdzenia o kosztach pilota i odblokowaniu pochodzą z jednej relacji gracza, a nie oficjalnego cennika.",
      "Kosztowną maszynę może wyeliminować skoordynowana osłona przeciwlotnicza; oceń trasę przed wydaniem pieniędzy.",
    ],
    unconfirmedFacts: [
      "Nieczytelne wymagania z Alpha 1 pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "20 września pilot z Season 1 podał 35. poziom Pilot i około $22,000–$30,000 za wyposażony lot bojowy; to niezweryfikowana obserwacja społeczności.",
      "Wyposażenie, pancerz, układ załogi, model lotu, środki obronne i aktualna cena wymagają sprawdzenia w bieżącym kliencie gry.",
    ],
  },
  "humvee-m249": {
    summary: "Humvee M249 łączył rolę uzbrojonego transportu, cenę $3,750 w Alpha 1 i wymóg 25. poziomu Driver.",
    description: "Humvee M249 dodaje nazwany typ broni wsparcia do chronionej platformy Humvee, bez osiągania zarejestrowanej ceny wariantu Minigun. Wymóg 25. poziomu Driver pojawiał się znacznie później niż dla Kodiak M249, dlatego dwa uzbrojone transporty za $3,750 oznaczały różne decyzje dotyczące postępu, choć nie zapisano osiągów broni i szczegółów mocowania.",
    role: "Używaj Humvee M249 do przewozu małego zespołu, zapewniając pasażerowi lub strzelcowi rolę obronną; planuj trasy niezależne od niepotwierdzonej ochrony stanowiska i kabiny.",
    strengths: [
      "Zaobserwowana rola uzbrojonego transportu łączy przemieszczanie z nazwanym stanowiskiem M249.",
      "Cena $3,750 w Alpha 1 była o $750 wyższa od nieuzbrojonego Humvee i niższa od modelu Minigun.",
      "25. poziom Driver wyraźnie odróżniał jego postęp od Kodiak M249 wymagającego 8. poziomu Driver.",
    ],
    cautions: [
      "Nie zarejestrowano amunicji M249, zakresu obrotu, ochrony, celności ani narażenia strzelca.",
      "Wymóg 25. poziomu Driver to obserwacja z Alpha 1, a nie ostateczny warunek odblokowania.",
      "Liczba miejsc, ochrona kabiny, pojemność ładunkowa i działanie napraw pozostają nieznane.",
    ],
    unconfirmedFacts: [
      "25. poziom Driver i cena $3,750 pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Działanie M249, ochrona, miejsca, pojemność ładunkowa i prowadzenie mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  "humvee-minigun": {
    summary: "Humvee Minigun był w Alpha 1 ciężkim uzbrojonym transportem za $4,500; jego wymagania dostępu były nieczytelne w materiale od sprzedawcy.",
    description: "Humvee Minigun był najdroższym zarejestrowanym Humvee i jedynym oznaczonym jako ciężki uzbrojony transport. Dopłata $1,500 względem modelu bazowego wskazuje odrębną półkę zakupową Alpha 1, lecz nieczytelne wymagania i brak danych broni uniemożliwiają twierdzenia o szybkostrzelności, zapasie amunicji, pancerzu czy opłacalności względem wariantu M249.",
    role: "Traktuj Humvee Minigun jako mobilną platformę ciężkiego ognia, która nadal potrzebuje osłoniętej trasy, skoordynowanego strzelca i planu odwrotu, zamiast używać jej jako niezweryfikowanego pancernego pojazdu pierwszej linii.",
    strengths: [
      "Ciężki uzbrojony transport był odrębną zaobserwowaną rolą w rodzinie Humvee.",
      "Nazwa Minigun odróżnia zamierzony typ uzbrojenia od tańszego wariantu M249.",
      "Cena $4,500 w Alpha 1 pozostawała niższa niż większego uzbrojonego Ural Defender M249.",
    ],
    cautions: [
      "Wymagania Alpha 1 były nieczytelne, więc droga uzyskania dostępu pozostaje nieznana.",
      "Nie zarejestrowano amunicji miniguna, rozkręcania luf, zakresu obrotu, obrażeń ani narażenia strzelca.",
      "Ciężki uzbrojony transport to etykieta roli, a nie potwierdzenie ochrony porównywalnej z czołgiem.",
    ],
    unconfirmedFacts: [
      "Nieczytelne wymagania z Alpha 1 pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Skuteczność miniguna, ochrona pojazdu, pojemność, prowadzenie i cena mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  humvee: {
    summary: "Podstawowy Humvee był w ofercie Alpha 1 chronionym transportem za $3,000, odblokowywanym na 15. poziomie Driver.",
    description: "Nieuzbrojony Humvee wyznaczał bazę chronionego transportu swojej rodziny w Alpha 1. Kosztował tyle co ładunkowy Kodiak Pickup i mniej od obu uzbrojonych Humvee, lecz określenie chroniony pozostaje etykietą klasy: nie zarejestrowano progu pancerza, układu miejsc, limitu schowków ani porównania przeżywalności.",
    role: "Używaj podstawowego Humvee do osłoniętego przewozu ludzi i zmiany pozycji na spornych drogach, gdy zamontowana broń jest mniej ważna niż utrzymanie zaobserwowanego kosztu zakupu poniżej wariantów uzbrojonych.",
    strengths: [
      "Chroniony transport był jego wyraźną rolą w Alpha 1, a nie domysłem dotyczącym opancerzenia.",
      "Zaobserwowana cena $3,000 była niższa niż obu wariantów Humvee wyposażonych w broń.",
      "15. poziom Driver umieszczał go między Dune Buggy a Humvee M249 na zarejestrowanej ścieżce Driver.",
    ],
    cautions: [
      "Nie zarejestrowano wartości pancerza, modelu uszkodzeń, liczby miejsc ani limitu ładunku.",
      "Chroniony transport nie gwarantuje bezpieczeństwa przed minami, ciężką bronią lub zasadzkami.",
      "15. poziom Driver i cena $3,000 mogą zmienić się po Alpha 1.",
    ],
    unconfirmedFacts: [
      "15. poziom Driver i cena $3,000 pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Ochrona, miejsca, schowki, mobilność, paliwo i naprawy mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  "kodiak-m249": {
    summary: "Kodiak M249 był w Alpha 1 uzbrojonym transportem za $3,750, wymagającym 8. poziomu Driver.",
    description: "Kodiak M249 był w zarejestrowanym katalogu uzbrojonym transportem z najwcześniejszym czytelnym wymogiem ścieżki Driver. Dzielił z Humvee M249 cenę $3,750 i rolę, lecz pojawiał się na 8. zamiast 25. poziomie Driver; wybór podwozia i moment postępu były więc osobnymi kwestiami jeszcze przed uwzględnieniem niezapisanych parametrów prowadzenia, ochrony i stanowiska broni.",
    role: "Wybierz Kodiak M249, gdy oddział na wczesnym etapie ścieżki Driver chce mobilnego wsparcia ogniowego bez przechodzenia do chronionej rodziny Ural Defender, traktując osiągi podwozia jako niepotwierdzone.",
    strengths: [
      "8. poziom Driver był najniższym zaobserwowanym wymogiem poziomu wśród uzbrojonych pojazdów lądowych.",
      "Rola uzbrojonego transportu łączy użytkową rodzinę Kodiak z nazwanym stanowiskiem M249.",
      "Cena $3,750 w Alpha 1 odpowiadała później odblokowywanemu Humvee M249, umożliwiając bezpośrednie porównanie postępu.",
    ],
    cautions: [
      "Wpis nie zawierał amunicji broni, zakresu obrotu, ochrony ani narażenia strzelca.",
      "8. poziom Driver nie dowodzi, że model pozostanie wczesnym odblokowaniem.",
      "Nie zapisano miejsc, kompromisów ładunkowych, prowadzenia, wytrzymałości ani kosztów napraw.",
    ],
    unconfirmedFacts: [
      "8. poziom Driver i cena $3,750 pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Działanie M249, miejsca, ładunek, ochrona, prowadzenie i wytrzymałość mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  "kodiak-pickup": {
    summary: "Kodiak Pickup figurował w Alpha 1 jako transport ładunkowy za $3,000 po odblokowaniu za $15,000.",
    description: "Kodiak Pickup jest jedynym zarejestrowanym pojazdem wyraźnie oznaczonym jako transport ładunkowy. Sprzedawca pokazywał zarówno cenę zakupu $3,000, jak i oddzielne odblokowanie za $15,000, tworząc dwuetapowy koszt Alpha 1 odmienny od modeli wymagających poziomu; nie zarejestrowano objętości ładunku, zasad załadunku ani trwałości odblokowania.",
    role: "Używaj Kodiak Pickup do wypraw zaopatrzeniowych, gdy rola ładunkowa jest ważniejsza niż niższa zaobserwowana cena podstawowego Kodiak lub stanowisko broni wariantu M249.",
    strengths: [
      "Transport ładunkowy był unikatową rolą w zaobserwowanym wykazie pojazdów.",
      "Cena zakupu $3,000 w Alpha 1 odpowiadała podstawowemu Humvee, ale służyła innemu celowi logistycznemu.",
      "Osobne odblokowanie za $15,000 było czytelne, pozwalając jawnie omówić pełny zaobserwowany koszt wejścia.",
    ],
    cautions: [
      "Wpis nie wyjaśnia, czy odblokowanie za $15,000 było trwałe, powtarzalne lub przypisane do konta.",
      "Nie zarejestrowano slotów ładunku, interakcji załadunku, ograniczeń przedmiotów ani zachowania przy utracie.",
      "Nie zapisano ochrony, miejsc, prędkości, prowadzenia w terenie ani działania paliwa.",
    ],
    unconfirmedFacts: [
      "Odblokowanie za $15,000 i cena zakupu $3,000 pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Trwałość odblokowania, zasady ładunku, pojemność, miejsca, ochrona i prowadzenie mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  kodiak: {
    summary: "Podstawowy Kodiak pojawił się w Alpha 1 jako transport użytkowy za $2,500 dostępny bez wymagań zakupu.",
    description: "Podstawowy Kodiak plasował się w zaobserwowanej ofercie między Bobcat a wyspecjalizowanymi wariantami Kodiak. Etykieta transportu użytkowego i zakup bez wymagań czynią go uniwersalnym przedstawicielem rodziny w Alpha 1, natomiast wpis nie określa dokładnych zastosowań: przestrzeni pasażerskiej, schowków, holowania ani jazdy terenowej.",
    role: "Używaj Kodiak jako ogólnego środka przemieszczania, gdy oddział nie potrzebuje wyraźnej roli ładunkowej Pickup ani stanowiska broni modelu M249; sprawdź praktyczną pojemność w aktywnej wersji gry.",
    strengths: [
      "W Alpha 1 zaobserwowano zakup bez wymagań, bez podanej ścieżki Driver lub pieniężnego odblokowania.",
      "Cena $2,500 była niższa niż obu wyspecjalizowanych wariantów Kodiak.",
      "Transport użytkowy nadaje mu szerszą zaobserwowaną rolę niż nastawiony na szybkość Dune Buggy.",
    ],
    cautions: [
      "Zakup bez wymagań był stanem z Alpha 1 i może nie pozostać dostępny.",
      "Etykieta użytkowy nie określa miejsc, ładunku, holowania, ochrony ani osiągów terenowych.",
      "Nie zarejestrowano różnic między modelem bazowym a Pickup poza rolą i ceną.",
    ],
    unconfirmedFacts: [
      "Zakup bez wymagań i cena $2,500 nie są potwierdzonymi zasadami wczesnego dostępu lub pełnej wersji.",
      "Miejsca, ładunek, holowanie, ochrona, prowadzenie, paliwo i naprawy pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
    ],
  },
  l2a6: {
    summary: "L2A6 był w katalogu Alpha 1 czołgiem podstawowym za $14,000, wymagającym 35. poziomu Wardog.",
    description: "L2A6 miał jedyną w zestawie etykietę czołgu podstawowego i drugą najwyższą zarejestrowaną cenę pojazdu. Wymóg 35. poziomu Wardog pojawiał się wcześniej niż wymagania Gepard i SPH-2, lecz wpis Alpha 1 nie określał stref pancerza, uzbrojenia, stanowisk załogi, amunicji, mobilności ani wsparcia potrzebnego do utrzymania sprawności.",
    role: "Używaj L2A6 jako wspieranego przez zespół ciężkiego narzędzia nacisku na odsłonięte kierunki, łącząc go z rozpoznaniem piechoty i logistyką zamiast zakładać, że etykieta czołgu podstawowego usuwa ryzyko złej pozycji.",
    strengths: [
      "Czołg podstawowy był unikatową zaobserwowaną klasą w katalogu 20 modeli.",
      "35. poziom Wardog był najwcześniejszym czytelnym wymogiem wśród trzech wpisów pojazdów pancernych i artylerii.",
      "Cena $14,000 w Alpha 1 wyraźnie oddzielała go od transportów i lżejszego przeciwlotniczego pojazdu opancerzonego.",
    ],
    cautions: [
      "Nie zarejestrowano wartości pancerza, słabych punktów, broni, amunicji, liczebności załogi ani systemów napraw.",
      "Rola czołgu podstawowego nie dowodzi odporności na zagrożenia ze strony piechoty, lotnictwa czy artylerii.",
      "35. poziom Wardog i cena zakupu $14,000 nie są twierdzeniami o ostatecznym postępie lub ekonomii.",
    ],
    unconfirmedFacts: [
      "35. poziom Wardog i cena $14,000 pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Pancerz, uzbrojenie, amunicja, role załogi, mobilność, paliwo i naprawy mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  "mh-6": {
    summary: "MH-6 był w Alpha 1 lekkim transportem powietrznym za $6,250, z zaobserwowanym zakupem bez wymagań.",
    description: "MH-6 był najtańszym śmigłowcem w zarejestrowanym katalogu i jedyną maszyną z rolą transportową oraz zaobserwowanym zakupem bez wymagań. Daje niebojowy punkt porównania dla rodziny AH-6, lecz nie zapisano miejsc pasażerów, zachowania przy lądowaniu, udźwigu, przeżywalności ani ewentualnych wymagań pilota poza warunkami u sprzedawcy.",
    role: "Używaj MH-6 do lekkiego desantu powietrznego, odbioru i szybkiej zmiany pozycji, gdy transport jest ważniejszy niż etykieta pokładowego uzbrojenia; ostrożnie wybieraj lądowiska i trasy powrotne.",
    strengths: [
      "Cena $6,250 w Alpha 1 była najniższą zaobserwowaną ofertą maszyny latającej.",
      "W zarejestrowanej ofercie widoczny był zakup bez wymagań, zamiast nieczytelnego warunku lub wymogu poziomu.",
      "Lekki transport powietrzny daje mu odrębną rolę mobilności obok uzbrojonych wariantów AH-6.",
    ],
    cautions: [
      "Zakup bez wymagań zaobserwowano tylko w Alpha 1 i nie stanowi on obietnicy ostatecznej dostępności.",
      "Nie zarejestrowano liczby miejsc, narażenia pasażerów, pilotażu, wytrzymałości ani tolerancji błędów lądowania.",
      "Etykieta transportowa nie określa możliwości przewozu ładunków ani nie dowodzi braku uzbrojenia w ostatecznym wyposażeniu.",
    ],
    unconfirmedFacts: [
      "Zakup bez wymagań i cena $6,250 nie są potwierdzonymi zasadami wczesnego dostępu lub pełnej wersji.",
      "Miejsca, wyposażenie, pilotaż, wytrzymałość, działanie ładunku i wymagania pilota pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
    ],
  },
  "sph-2": {
    summary: "Season 1 przeniósł kategorię Artillery Tank na 90. poziom Career z odblokowaniem za $500,000; ceny SPH-2 u sprzedawcy i praca załogi pozostają obserwacjami przypisanymi do wersji.",
    description: "SPH-2 był jedynym modelem artylerii samobieżnej w zarejestrowanej ofercie i wymagał 55. poziomu Wardog. Późniejsze nagrania Closed Beta pokazały trzy stanowiska załogi, etap stabilizacji, ustawianie dystansu ostrzału pośredniego, amunicję 155 mm i sekwencję ręcznego przeładowania. Materiał Alpha podawał zakup za $10,000, a późniejszy poradnik twórcy pokazywał ponowny zakup za $8,000 po osobnym odblokowaniu za $400,000; rozbieżność zachowano jako dowody dotyczące wersji, zamiast sprowadzać ją do jednej ostatecznej ceny.",
    role: "Używaj SPH-2 jako skoordynowanego środka ostrzału pośredniego, zależnego od informacji o celach, osłoniętych stanowisk i logistyki; zmieniaj pozycję, gdy staje się przewidywalna.",
    strengths: [
      "Stabilizacja utrzymuje użyteczny obraz celownika przy kolejnych korektach ostrzału pośredniego.",
      "Zaobserwowane stanowiska załogi rozdzielają prowadzenie, główne działo 155 mm i obronę z górnego stanowiska.",
      "Prawidłowe wykonanie ręcznej sekwencji przeładowania może skrócić opóźnienie.",
    ],
    cautions: [
      "Kierowca nie może strzelać podczas jazdy; samotny operator musi zatrzymać pojazd i zmienić miejsce.",
      "Przewidywalne stanowisko ogniowe jest narażone na drony, lotnictwo, ogień kontrbateryjny i polującą piechotę.",
      "Season 1 potwierdza wymagania kategorii Artillery Tank, a nie aktualną cenę SPH-2 u sprzedawcy; sprawdź cenę, zasięg i parametry pocisków w bieżącej wersji.",
    ],
    unconfirmedFacts: [
      "Zakup za $10,000 w Alpha i późniejszy ponowny zakup za $8,000 w Beta są sprzeczne; żadna z tych wartości nie jest potwierdzona dla wczesnego dostępu.",
      "Jeden gracz Season 1 podaje ponowny zakup za $8,000 i wyposażony wyjazd bojowy za $11,000–$13,000; nie zweryfikowano tego niezależnie w aktualnej ofercie sprzedawcy.",
      "Oficjalna lista zmian wymienia Artillery Tank, a nie SPH-2; aktualna tożsamość modelu i cena ponownego zakupu wymagają sprawdzenia w bieżącym kliencie gry.",
      "Zasięg, wybuch, pancerz i ekonomia amunicji wymagają sprawdzenia w bieżącym kliencie gry.",
    ],
  },
  "uh-1y-miniguns": {
    summary: "UH-1Y Miniguns był w Alpha 1 uzbrojonym śmigłowcem wielozadaniowym za $8,000 z nieczytelnymi wymaganiami dostępu.",
    description: "UH-1Y Miniguns dodaje rolę uzbrojonego śmigłowca wielozadaniowego do większej rodziny UH-1Y za zaledwie $600 ponad zarejestrowaną cenę bazowego transportu. Ta niewielka różnica ceny w Alpha 1 zwiększa znaczenie nieczytelnych wymagań: bez danych o dostępie, broni, miejscach i udźwigu nie można traktować uzbrojonego wariantu jako zawsze lepszego transportu.",
    role: "Używaj UH-1Y Miniguns do osłanianego desantu i ewakuacji, w których pokładowy ogień osłonowy może mieć znaczenie; zachowuj priorytet zadania transportowego zamiast gonić za niezweryfikowaną siłą ognia.",
    strengths: [
      "Uzbrojony śmigłowiec wielozadaniowy łączy tożsamość rodziny transportowej z określonym uzbrojeniem.",
      "Zaobserwowana cena $8,000 była tylko o $600 wyższa od bazowego UH-1Y.",
      "Para modeli z jednej rodziny umożliwia czytelne porównanie zakupu wersji uzbrojonej i transportowej.",
    ],
    cautions: [
      "Wymagania Alpha 1 były nieczytelne, więc dostępu nie można bezpośrednio porównać z wymogiem Pilot modelu bazowego.",
      "Nie zarejestrowano liczby minigunów, sektorów ostrzału, amunicji, obrażeń ani narażenia strzelca.",
      "Liczba pasażerów, działanie ładunku, wytrzymałość i różnice pilotażu pozostają nieznane.",
    ],
    unconfirmedFacts: [
      "Nieczytelne wymagania z Alpha 1 pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Działanie minigunów, miejsca, udźwig, wytrzymałość, pilotaż i cena mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  "uh-1y": {
    summary: "Podstawowy UH-1Y był w Alpha 1 transportem powietrznym za $7,400, wymagającym 10. poziomu Pilot.",
    description: "Podstawowy UH-1Y był w zarejestrowanym katalogu transportem powietrznym wymagającym postępu, droższym od dostępnego bez wymagań MH-6 i nieco tańszym od uzbrojonego UH-1Y Miniguns. 10. poziom Pilot był czytelny w Alpha 1, lecz nie udokumentowano miejsc, ładunku, charakterystyki lotu, ochrony ani dokładnych różnic względem wariantu uzbrojonego.",
    role: "Używaj UH-1Y do zaplanowanego przewozu oddziałów i powtarzalnej logistyki powietrznej po spełnieniu zaobserwowanego wymogu Pilot; dobieraj lądowiska według bezpieczeństwa transportu, a nie braku etykiety uzbrojenia.",
    strengths: [
      "Transport powietrzny był jego wyraźną rolą w Alpha 1, odrębną od klas lekkich i uzbrojonych śmigłowców.",
      "10. poziom Pilot stanowił jedyny czytelny wymóg ścieżki Pilot w zarejestrowanym zestawie pojazdów.",
      "Zaobserwowana cena $7,400 umieszczała go między MH-6 a UH-1Y Miniguns przy porównaniu rodziny.",
    ],
    cautions: [
      "10. poziom Pilot i cena $7,400 nie są potwierdzonymi ostatecznymi zasadami dostępu.",
      "Nie zarejestrowano miejsc pasażerskich, pojemności ładunkowej, modelu lotu, wytrzymałości ani środków obronnych.",
      "Etykieta transportu powietrznego nie dowodzi, że model będzie nieuzbrojony lub chroniony w późniejszych wersjach.",
    ],
    unconfirmedFacts: [
      "10. poziom Pilot i cena $7,400 pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Miejsca, ładunek, wyposażenie, ochrona, pilotaż i środki obronne mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  "ural-defender-m249": {
    summary: "Ural Defender M249 był w Alpha 1 uzbrojonym pojazdem logistycznym za $6,750, wymagającym 40. poziomu Driver.",
    description: "Ural Defender M249 był najwyższym wariantem zarejestrowanej rodziny Ural: z rolą uzbrojonej logistyki, wymogiem 40. poziomu Driver i ceną $6,750 w Alpha 1. Dodaje nazwaną broń do chronionej koncepcji Defender, lecz żaden wpis nie ustalał, ile ładunku, ochrony lub mobilności poświęca na stanowisko M249.",
    role: "Używaj Ural Defender M249 do eskorty cennych dostaw z pokładową rolą obronną, stawiając bezpieczeństwo trasy i priorytet rozładunku ponad nieosłonięte wypady bojowe.",
    strengths: [
      "Uzbrojona logistyka była unikatową rolą wśród zaobserwowanych modeli pojazdów.",
      "Oznaczenie M249 odróżnia go zarówno od podstawowego Ural, jak i chronionego Defender.",
      "40. poziom Driver i $6,750 czyniły zarejestrowane etapy postępu i zakupu czytelnymi.",
    ],
    cautions: [
      "Nie zarejestrowano amunicji M249, sektorów ostrzału, ochrony, celności ani narażenia strzelca.",
      "Pojemność ładunkowa i kompromis między przestrzenią logistyczną a uzbrojeniem pozostają nieznane.",
      "40. poziom Driver i cena $6,750 mogą zmienić się po Alpha 1.",
    ],
    unconfirmedFacts: [
      "40. poziom Driver i cena $6,750 pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Działanie broni, ładunek, ochrona, miejsca, mobilność i koszty eksploatacji mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  "ural-defender": {
    summary: "Ural Defender pojawił się w Alpha 1 jako chroniony pojazd logistyczny za $6,000, wymagający 30. poziomu Driver.",
    description: "Ural Defender wprowadzał etap chronionej logistyki między podstawową ciężarówką a uzbrojonym modelem M249. Wymóg 30. poziomu Driver i cena $6,000 w Alpha 1 były czytelne, lecz określenie chroniony nie jest pomiarem pancerza, a wpis nie definiuje objętości ładunku, miejsc pasażerskich, osiągów na trasie ani wzrostu ochrony względem Ural.",
    role: "Używaj Ural Defender na bardziej ryzykownych trasach zaopatrzenia, gdzie zaobserwowana rola chronionej logistyki ma większe znaczenie niż niższa cena podstawowego Ural lub broń osłonowa wariantu uzbrojonego.",
    strengths: [
      "Chroniona logistyka była odrębną zaobserwowaną rolą, a nie ogólnym transportem.",
      "Cena $6,000 w Alpha 1 plasowała go dokładnie pomiędzy Ural a Ural Defender M249.",
      "30. poziom Driver dawał czytelny etap postępu dla środkowego wariantu Ural.",
    ],
    cautions: [
      "Nie zarejestrowano poziomu pancerza, modelu uszkodzeń, pojemności ładunkowej ani liczby miejsc.",
      "Chroniona logistyka nie potwierdza ochrony przed każdą zasadzką lub typem broni.",
      "30. poziom Driver i cena $6,000 pozostają obserwacjami sprzed premiery.",
    ],
    unconfirmedFacts: [
      "30. poziom Driver i cena $6,000 pozostają niepotwierdzone dla wczesnego dostępu lub pełnej wersji.",
      "Ochrona, ładunek, miejsca, prowadzenie, paliwo, naprawy i zachowanie przy utracie mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  ural: {
    summary: "Podstawowy Ural był u sprzedawcy w Alpha 1 ciężarówką logistyczną za $5,000 po odblokowaniu za $60,000.",
    description: "Podstawowy Ural stanowił fundament wyspecjalizowanej rodziny logistycznej z ceną zakupu $5,000 i najwyższą pieniężną opłatą odblokowania widoczną w zarejestrowanym katalogu pojazdów. Oddzielne odblokowanie za $60,000 w Alpha 1 dominuje w omówieniu kosztu wejścia, ale wpis nie wyjaśnia trwałości odblokowania ani nie określa liczbowo ładunku, pasażerów, ochrony, prędkości czy interakcji zaopatrzeniowych.",
    role: "Używaj Ural do zaplanowanej logistyki większych ładunków i powtarzalnych tras dostaw, uwzględniając obie zaobserwowane warstwy kosztów; eskorta i dyscyplina tras powinny rekompensować niezarejestrowaną ochronę.",
    strengths: [
      "Ciężarówka logistyczna była jego wyraźną rolą w Alpha 1, odróżniającą go od zwykłego przewozu ludzi.",
      "Zaobserwowana cena zakupu $5,000 była niższa niż obu wariantów Ural Defender.",
      "Odblokowanie za $60,000 było czytelne, ujawniając ważny drugi koszt zamiast ukrywać go pod etykietą poziomu.",
    ],
    cautions: [
      "Season 1 podaje 3. poziom Driver i odblokowanie na ścieżce Driver za $35,000, odrębne od każdego ponownego zakupu pojazdu.",
      "Nie zarejestrowano pojemności ładunkowej, zasad załadunku, typów zaopatrzenia, miejsc pasażerskich ani zachowania przy utracie.",
      "Nie zapisano parametrów ochrony, prowadzenia, paliwa, napraw ani jazdy terenowej.",
    ],
    unconfirmedFacts: [
      "Cena zakupu pojazdu $5,000 z Alpha 1 pozostaje niezweryfikowana dla wczesnego dostępu; odblokowanie za $60,000 z Alpha 1 ma znaczenie historyczne.",
      "Trwałość odblokowania, zasady ładunku, interakcje zaopatrzeniowe, ochrona, miejsca i prowadzenie mogą różnić się od aktualnej wersji wczesnego dostępu lub pełnego wydania.",
    ],
  },
  stingray: {
    summary: "Stingray to odpalany z ziemi dron przeciwpojazdowy pokazany w rozgrywce Beta; jego aktualna cena, odblokowanie i obrażenia nie są zweryfikowane.",
    description: "Stingray to system wyrzutni i kontrolera dla jednorazowego drona przeciwpojazdowego, a nie konwencjonalny pojazd do prowadzenia. Materiał o budowaniu z Closed Beta pokazuje tubę startową i ręczny kontroler. Wrześniowy klip z rozgrywki demonstruje atakowanie wrogich pojazdów i artylerii, lecz żadne z tych źródeł nie ustala aktualnej ceny sklepowej, odblokowania, wartości obrażeń ani gwarantowanego zniszczenia.",
    role: "Przed startem wybierz potwierdzony, wartościowy pojazd lub nieruchomą artylerię jako cel, ustaw operatora za osłoną i pozostaw sojusznika do pilnowania miejsca startu. Starszy instruktaż lotu zaleca kontrolowane końcowe korekty zamiast zużywania całego przyspieszenia podczas dolotu; ponownie sprawdź sterowanie w bieżącej wersji.",
    strengths: [
      "Zdalny atak przeciwpojazdowy może wywierać presję na znaną, nieruchomą artylerię lub pozycję wspierającą odradzanie.",
      "Wyrzutnia i kontroler są bezpośrednio widoczne w cytowanym materiale o budowaniu z Beta.",
      "Wrześniowy klip z rozgrywki daje nowszy pokaz użycia Stingray przeciw pojazdom.",
    ],
    cautions: [
      "Operator może być odsłonięty podczas sterowania dronem, więc startuj zza osłony, a nie z otwartego FOB.",
      "Nie zakładaj, że pilotaż, naprowadzanie lub obrażenia z Beta nadal odpowiadają bieżącej wersji.",
      "Aktualna cena zakupu, wymóg odblokowania, koszt wystawienia i obrażenia nie są niezależnie zweryfikowane.",
    ],
    unconfirmedFacts: [
      "Żaden aktualny zrzut sklepu ani oficjalna notatka nie potwierdza ceny, odblokowania, kosztu wystawienia ani obrażeń.",
      "Sposób lotu z Beta może różnić się od aktualnego sterowania i naprowadzania.",
    ],
  },
};

const generatedSlugs = new Set([
  "m4", "t-21", "m249-saw", "pkm", "sks", "svd", "m1911", "m500", "mp43", "mp5",
  "pp-19-vityaz", "super-45", "mk22", "mosin-nagant", "scout-rifle-td", "sv98",
  "9k333-verba", "maaws", "mgl-40", "rpg-7", "loudspeaker", "talon-9k-sam", "l81-mortar", "vanguard-ciws",
]);

const summaries: Record<string, string> = {
  "Assault XP rifle observed with 5.56x45mm ammunition and semi or full-auto fire in Alpha 1.":
    "Karabin ze ścieżki Assault XP zaobserwowany w Alpha 1 z amunicją 5.56x45mm oraz ogniem pojedynczym lub ciągłym.",
  "Support XP light machine gun using 5.56x45mm; price was not captured in the observed build.":
    "Lekki karabin maszynowy ze ścieżki Support XP używający 5.56x45mm; nie zarejestrowano ceny w zaobserwowanej wersji.",
  "Support XP light machine gun observed with 7.62x54mmR ammunition and full-auto capability.":
    "Lekki karabin maszynowy ze ścieżki Support XP zaobserwowany z amunicją 7.62x54mmR i możliwością ognia ciągłego.",
  "Recon XP semi-automatic marksman rifle using 7.62x39mm ammunition.":
    "Samopowtarzalny karabin wyborowy ze ścieżki Recon XP używający amunicji 7.62x39mm.",
  "Recon XP semi-automatic marksman rifle using 7.62x54mmR ammunition.":
    "Samopowtarzalny karabin wyborowy ze ścieżki Recon XP używający amunicji 7.62x54mmR.",
  "Semi-automatic .45 ACP sidearm observed in the pre-release catalogue.":
    "Samopowtarzalna broń krótka kalibru .45 ACP zaobserwowana w katalogu sprzed premiery.",
  "Support XP 12 Gauge shotgun observed in the pre-release catalogue.":
    "Strzelba kalibru 12 ze ścieżki Support XP zaobserwowana w katalogu sprzed premiery.",
  "Support XP break-action 12 Gauge shotgun observed as a low-cost option.":
    "Łamana strzelba kalibru 12 ze ścieżki Support XP zaobserwowana jako tania opcja.",
  "Medic XP SMG using 9x19mm ammunition with semi and full-auto fire.":
    "Pistolet maszynowy ze ścieżki Medic XP używający amunicji 9x19mm z ogniem pojedynczym i ciągłym.",
  "Medic XP SMG using .45 ACP ammunition with semi and full-auto fire.":
    "Pistolet maszynowy ze ścieżki Medic XP używający amunicji .45 ACP z ogniem pojedynczym i ciągłym.",
  "Recon XP bolt-action sniper rifle using .308 Winchester ammunition.":
    "Powtarzalny karabin snajperski ze ścieżki Recon XP używający amunicji .308 Winchester.",
  "Recon XP bolt-action sniper rifle using 7.62x54mmR ammunition.":
    "Powtarzalny karabin snajperski ze ścieżki Recon XP używający amunicji 7.62x54mmR.",
  "Recon XP light break-action rifle using 5.56x45mm ammunition.":
    "Lekki karabin łamany ze ścieżki Recon XP używający amunicji 5.56x45mm.",
  "Specialist launcher identified in Closed Beta catalogue coverage; exact ammunition, price, and unlock remain unconfirmed.":
    "Specjalistyczna wyrzutnia zidentyfikowana w materiałach katalogowych Closed Beta; dokładna amunicja, cena i odblokowanie pozostają niepotwierdzone.",
  "84mm specialist launcher observed in pre-release catalogue coverage.":
    "Specjalistyczna wyrzutnia 84mm zaobserwowana w materiałach katalogowych sprzed premiery.",
  "40mm multiple grenade launcher observed in pre-release catalogue coverage.":
    "Wielostrzałowy granatnik 40mm zaobserwowany w materiałach katalogowych sprzed premiery.",
  "93mm specialist launcher observed in the Alpha catalogue.":
    "Specjalistyczna wyrzutnia 93mm zaobserwowana w katalogu Alpha.",
  "Stationary support-system identifier observed in Closed Beta catalogue coverage; exact function and cost remain build-sensitive.":
    "Identyfikator stacjonarnego systemu wsparcia zaobserwowany w materiałach katalogowych Closed Beta; dokładna funkcja i koszt pozostają zależne od wersji.",
  "Stationary anti-air system identified in Closed Beta catalogue coverage; cost and deployment rules remain unconfirmed.":
    "Stacjonarny system przeciwlotniczy zidentyfikowany w materiałach katalogowych Closed Beta; koszt i zasady rozstawiania pozostają niepotwierdzone.",
  "Stationary mortar system identified in Closed Beta catalogue coverage; range, ammunition, and cost remain unconfirmed.":
    "Stacjonarny system moździerzowy zidentyfikowany w materiałach katalogowych Closed Beta; zasięg, amunicja i koszt pozostają niepotwierdzone.",
  "Stationary close-in defense system identified in Closed Beta catalogue coverage; exact behavior remains unconfirmed.":
    "Stacjonarny system obrony bezpośredniej zidentyfikowany w materiałach katalogowych Closed Beta; dokładne działanie pozostaje niepotwierdzone.",
};

const subtypes: Record<string, string> = {
  "Assault rifle": "karabin szturmowy",
  LMG: "lekki karabin maszynowy",
  "Marksman rifle": "karabin wyborowy",
  Sidearm: "broń krótka",
  Shotgun: "strzelba",
  SMG: "pistolet maszynowy",
  "Sniper rifle": "karabin snajperski",
  Launcher: "wyrzutnia",
  "Stationary support": "wsparcie stacjonarne",
  "Stationary anti-air": "stacjonarna obrona przeciwlotnicza",
  "Stationary artillery": "artyleria stacjonarna",
  "Stationary defense": "obrona stacjonarna",
};

const factLabels: Record<string, string> = {
  "Alpha price": "Cena w Alpha",
  Ammunition: "Amunicja",
  "Fire modes": "Tryby ognia",
  Weight: "Masa",
  Progression: "Postęp",
  Role: "Rola",
  "Observed gate": "Zaobserwowane wymagania",
  Track: "Ścieżka",
};

const factValues: Record<string, Readonly<Record<string, string>>> = {
  Ammunition: {
    "5.56x45mm": "5.56x45mm", "5.45x39mm": "5.45x39mm", "9x19mm": "9x19mm",
    ".50 Cal": ".50 Cal", ".308 Winchester": ".308 Winchester", "Standard Arrows": "Standardowe strzały",
    ".50 AE": ".50 AE", ".45 Colt": ".45 Colt", "7.62x54mmR": "7.62x54mmR", "7.62x39mm": "7.62x39mm",
    ".45 ACP": ".45 ACP", "12 Gauge": "Kaliber 12", "84mm": "84mm", "40mm": "40mm", "93mm": "93mm",
  },
  "Fire modes": {
    "Semi / Burst": "Pojedynczy / serie",
    "Semi / Full Auto": "Pojedynczy / ciągły",
    "Bolt-action / Magazine": "Zamek powtarzalny / magazynek",
    "Semi automatic": "Samopowtarzalny",
    "Pull and Release": "Naciągnięcie i zwolnienie cięciwy",
    "Break-action": "Łamany",
    "Bolt action": "Zamek powtarzalny",
  },
  Progression: {
    "Assault XP": "Assault XP", "Medic XP": "Medic XP", "Recon XP": "Recon XP", "Support XP": "Support XP",
  },
  Role: {
    "Combat helicopter": "Śmigłowiec bojowy",
    "Rocket helicopter": "Śmigłowiec rakietowy",
    "Light transport": "Lekki transport",
    "Fast transport": "Szybki transport",
    "Anti-air armor": "Przeciwlotniczy pojazd opancerzony",
    "Attack helicopter": "Śmigłowiec szturmowy",
    "Armed transport": "Uzbrojony transport",
    "Heavy armed transport": "Ciężki uzbrojony transport",
    "Protected transport": "Chroniony transport",
    "Cargo transport": "Transport ładunkowy",
    "Utility transport": "Transport użytkowy",
    "Main battle tank": "Czołg podstawowy",
    "Light air transport": "Lekki transport powietrzny",
    "Self-propelled artillery": "Artyleria samobieżna",
    "Armed utility helicopter": "Uzbrojony śmigłowiec wielozadaniowy",
    "Air transport": "Transport powietrzny",
    "Armed logistics": "Uzbrojona logistyka",
    "Protected logistics": "Chroniona logistyka",
    "Logistics truck": "Ciężarówka logistyczna",
    "Anti-air launcher": "Wyrzutnia przeciwlotnicza",
    "Anti-vehicle launcher": "Wyrzutnia przeciwpojazdowa",
    "Grenade launcher": "Granatnik",
    "Stationary support": "Wsparcie stacjonarne",
    "Stationary anti-air": "Stacjonarna obrona przeciwlotnicza",
    "Stationary artillery": "Artyleria stacjonarna",
    "Stationary defense": "Obrona stacjonarna",
  },
  "Observed gate": {
    "Open purchase": "Zakup bez wymagań",
    "Driver Level 10": "10. poziom Driver",
    "Wardog Level 45": "45. poziom Wardog",
    "Driver Level 25": "25. poziom Driver",
    "Driver Level 15": "15. poziom Driver",
    "Driver Level 8": "8. poziom Driver",
    "$15,000 unlock": "Odblokowanie za $15,000",
    "Wardog Level 35": "35. poziom Wardog",
    "Wardog Level 55": "55. poziom Wardog",
    "Pilot Level 10": "10. poziom Pilot",
    "Driver Level 40": "40. poziom Driver",
    "Driver Level 30": "30. poziom Driver",
    "$60,000 unlock": "Odblokowanie za $60,000",
  },
  Track: {Driver: "Driver", Wardog: "Wardog", Pilot: "Pilot"},
};

const factSentences: Record<string, string> = {
  "Evidence tier: build-capture.": "Poziom dowodów: materiał z wersji gry.",
  "Evidence tier: corroborated-community.": "Poziom dowodów: informacje społeczności potwierdzone innymi materiałami.",
  "Official Team17 press-kit gameplay frame identifies the equipped M4 in the HUD; Alpha values remain build-sensitive and use the separate catalogue evidence set.":
    "Kadr z rozgrywki w oficjalnym pakiecie prasowym Team17 identyfikuje wyposażone M4 w HUD; wartości Alpha pozostają zależne od wersji i korzystają z oddzielnego zestawu dowodów katalogowych.",
  "Official Team17 press-kit gameplay frame identifies the equipped Super-45 and .45 ACP ammunition in the HUD; Alpha values remain build-sensitive and use the separate catalogue evidence set.":
    "Kadr z rozgrywki w oficjalnym pakiecie prasowym Team17 identyfikuje wyposażone Super-45 i amunicję .45 ACP w HUD; wartości Alpha pozostają zależne od wersji i korzystają z oddzielnego zestawu dowodów katalogowych.",
  "Observed across creator footage: stabilize the platform before firing and use a manual reload sequence":
    "Zaobserwowano w nagraniach twórców: ustabilizuj platformę przed strzałem i wykonaj ręczną sekwencję przeładowania",
  "Observed across creator footage: driver, main-gun and top-gunner positions":
    "Zaobserwowano w nagraniach twórców: stanowiska kierowcy, głównego działa i górnego strzelca",
  "Official Season 1 Artillery Tank category: Career level 90 and $500,000 one-time unlock; model association comes from the versioned catalogue":
    "Oficjalna kategoria Artillery Tank w Season 1: 90. poziom Career i jednorazowe odblokowanie za $500,000; powiązanie z modelem pochodzi z katalogu przypisanego do wersji",
  "The launch tube and handheld controller are visible in the cited Closed Beta building footage.":
    "Tuba startowa i ręczny kontroler są widoczne w cytowanym materiale o budowaniu z Closed Beta.",
  "The cited September gameplay clip shows Stingray use against enemy vehicles and artillery.":
    "Cytowany wrześniowy klip z rozgrywki pokazuje użycie Stingray przeciw wrogim pojazdom i artylerii.",
};

function lookup(dictionary: Readonly<Record<string, string>>, source: string): string {
  if (!Object.hasOwn(dictionary, source)) {
    throw new Error(`Missing Polish item prose translation: ${source}`);
  }
  return dictionary[source];
}

function translateFact(source: string): string {
  if (Object.hasOwn(factSentences, source)) return factSentences[source];

  const capture = source.match(/^Creator gameplay capture from (Every Weapon Tested in WARDOGS|WARDOGS All Weapons Vendor|WARDOGS Beta live gameplay|WARDOGS Building 101) at (\d{2}:\d{2}(?::\d{2})?); the visible item name or model was matched before publication\. Numeric fields remain build-sensitive\.$/);
  if (capture) {
    return `Materiał z rozgrywki twórcy z ${capture[1]} w ${capture[2]}; przed publikacją dopasowano widoczną nazwę przedmiotu lub model. Pola liczbowe pozostają zależne od wersji.`;
  }

  const observed = source.match(/^Observed in (Alpha 1|Closed Beta - 21-23 Aug 2026): ([^:]+): (.+)$/);
  if (observed) {
    const [, build, label, value] = observed;
    const translatedLabel = lookup(factLabels, label);
    let translatedValue: string;
    if ((label === "Alpha price" && /^\$\d[\d,]*$/.test(value)) || (label === "Weight" && /^\d+(?:\.\d+)? kg$/.test(value))) {
      translatedValue = value;
    } else {
      translatedValue = lookup(factValues[label] ?? {}, value);
    }
    const translatedBuild = build === "Alpha 1" ? "Alpha 1" : "Closed Beta - 21-23 sierpnia 2026";
    return `Zaobserwowano w ${translatedBuild}: ${translatedLabel}: ${translatedValue}`;
  }
  throw new Error(`Missing Polish item fact translation: ${source}`);
}

function localizeGenerated(item: WardogsItem): ItemProse {
  const summary = lookup(summaries, item.summary);
  const subtype = lookup(subtypes, item.subtype);
  const sourceSubtype = item.subtype.toLowerCase();
  // Match the real factory sentences exactly so new prose cannot silently reuse an old template.
  const sentences: Record<string, string> = {
    [`${item.summary} This record separates observed pre-release facts from unknown Early Access balance and will be updated when a newer first-party or directly visible build confirms changes.`]:
      `${summary} Ten wpis oddziela zaobserwowane fakty sprzed premiery od nieznanego balansu wczesnego dostępu i zostanie zaktualizowany, gdy nowsza wersja pokazana przez twórców gry lub bezpośrednio widoczna potwierdzi zmiany.`,
    [`Use the ${item.name} for its observed ${sourceSubtype} role only when the squad can support its ammunition, replacement cost, and current objective.`]:
      `Używaj ${item.name} w zaobserwowanej roli: ${subtype}, tylko gdy oddział może zapewnić amunicję, pokryć koszt zastąpienia i wspierać bieżący cel.`,
    [`${item.name} has a documented place in the pre-release catalogue rather than an inferred real-world role.`]:
      `${item.name} ma udokumentowane miejsce w katalogu sprzed premiery, zamiast roli wywnioskowanej z rzeczywistego odpowiednika.`,
    [`Its visible ${sourceSubtype} classification makes it comparable with records in the same catalogue filter.`]:
      `Widoczna klasyfikacja „${subtype}” pozwala porównywać go z wpisami w tym samym filtrze katalogu.`,
    "Unknown fields remain visible, which prevents an old test-build value from becoming a permanent recommendation.":
      "Nieznane pola pozostają widoczne, co zapobiega przekształceniu starej wartości z wersji testowej w stałą rekomendację.",
    "These pre-release observations may differ from the live Early Access build in price, handling, damage, availability, and unlock conditions.":
      "Te obserwacje sprzed premiery mogą różnić się od aktualnej wersji wczesnego dostępu ceną, obsługą, obrażeniami, dostępnością i warunkami odblokowania.",
    "A catalogue identifier does not prove final attachment, ammunition, or progression compatibility.":
      "Identyfikator katalogowy nie dowodzi ostatecznej zgodności dodatków, amunicji ani ścieżki postępu.",
    "Use the Build label on every fact before comparing this record with newer footage.":
      "Przed porównaniem tego wpisu z nowszym nagraniem sprawdź etykietę wersji gry przy każdym fakcie.",
    [`Current Early Access and full-release values for ${item.name} have not been verified from a current build.`]:
      `Aktualnych wartości ${item.name} dla wczesnego dostępu i pełnego wydania nie zweryfikowano w bieżącej wersji gry.`,
    "Damage, handling, price, availability, and compatibility can change with a new Build.":
      "Obrażenia, obsługa, cena, dostępność i zgodność mogą zmienić się wraz z nową wersją gry.",
  };
  return {
    summary,
    description: lookup(sentences, item.description),
    role: lookup(sentences, item.role),
    strengths: item.strengths.map((source) => lookup(sentences, source)),
    cautions: item.cautions.map((source) => lookup(sentences, source)),
    confirmedFacts: item.confirmedFacts?.map(translateFact),
    unconfirmedFacts: item.unconfirmedFacts?.map((source) => lookup(sentences, source)),
  };
}

export function localizeItemProsePl(item: WardogsItem): ItemProse {
  let prose: ItemProse;
  if (Object.hasOwn(authored, item.slug)) {
    const translation = authored[item.slug];
    prose = {
      ...translation,
      strengths: [...translation.strengths],
      cautions: [...translation.cautions],
      confirmedFacts: item.confirmedFacts?.map(translateFact),
      unconfirmedFacts: translation.unconfirmedFacts ? [...translation.unconfirmedFacts] : undefined,
    };
  } else if (generatedSlugs.has(item.slug)) {
    prose = localizeGenerated(item);
  } else {
    throw new Error(`Missing Polish item prose: ${item.type}/${item.slug}`);
  }
  for (const field of ["strengths", "cautions", "confirmedFacts", "unconfirmedFacts"] as const) {
    if ((item[field] === undefined) !== (prose[field] === undefined) || item[field]?.length !== prose[field]?.length) {
      throw new Error(`Polish item prose shape changed: ${item.slug}/${field}`);
    }
  }
  return prose;
}
