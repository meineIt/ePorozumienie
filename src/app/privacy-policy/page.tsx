import Navigation from "../components/indexPageSections/Navigation";
import Footer from "../components/indexPageSections/Footer";

export const metadata = {
    title: 'Polityka Prywatności | e-Porozumienie',
    description: 'Polityka prywatności platformy e-Porozumienie - informacje o przetwarzaniu danych osobowych.',
  };

export default function PrivacyPolicy() {
    return (
        <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 pt-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8 md:p-12">
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                            POLITYKA PRYWATNOŚCI I PLIKÓW COOKIES SERWISU EPOROZUMIENIE.PL
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 text-center">
                            <strong>Wersja: 1.0</strong> | <strong>Data publikacji: 16 stycznia 2026 r.</strong>
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Postanowienia ogólne</h2>

                        <p>Administratorem danych osobowych osób korzystających z platformy eporozumienie.pl są Organizatorzy narzędzia e-porozumienie (dalej jako: Administrator).</p>

                        <p>Wszelkie pytania lub żądania dotyczące skorzystania z przysługujących Państwu praw prosimy składać na adres e-mail: kontakt@e-porozumienie.pl.</p>

                        <p>Państwa dane osobowe są przetwarzane zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (dalej jako: RODO).</p>

                        <p>W e-porozumienie szanujemy Państwa prywatność i podejmujemy działania w celu zapewnienia bezpieczeństwa informacji, które uzyskujemy od Państwa. Niniejsza Polityka Prywatności określa podejmowane przez nas czynności w zakresie danych osobowych, które otrzymujemy od Państwa podczas korzystania z naszego serwisu internetowego i świadczenia na Państwa rzecz usług wspomagania mediacji online.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Definicje stosowane w serwisie</h2>

                        <p><strong>Serwis</strong> – oznacza zorganizowaną platformę informatyczno-informacyjną dostępną pod adresem eporozumienie.pl oraz jej subdomenami.</p>

                        <p><strong>Asystent AI</strong> – oznacza system sztucznej inteligencji wykorzystujący zaawansowane modele językowe w celu analizy sporów, identyfikacji punktów wspólnych oraz generowania automatycznych propozycji ugód.</p>

                        <p><strong>Użytkownik</strong> – oznacza osobę fizyczną lub reprezentanta podmiotu korzystającego z funkcjonalności Serwisu po dokonaniu rejestracji.</p>

                        <p><strong>LegalTech 2.0</strong> – oznacza model narzędzia mający na celu integrację maszyny (AI) z człowiekiem w celu ułatwienia i przyspieszenia procesów zawierania porozumień online.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Informacje o systemie sztucznej inteligencji</h2>

                        <p>E-porozumienie wykorzystuje systemy sztucznej inteligencji przeznaczone do interakcji z osobami fizycznymi. Wszystkie analizy, raporty punktów wspólnych oraz propozycje ugód generowane przez system są tworzone automatycznie za pomocą algorytmów uczenia maszynowego.</p>

                        <p>Informujemy, że treści generowane przez Asystenta AI mają charakter wyłącznie pomocniczy i informacyjny. Nie stanowią one porady prawnej, opinii prawnej ani żadnej formy oficjalnego rozstrzygnięcia sporu w rozumieniu przepisów o adwokaturze i radcach prawnych.</p>

                        <p><strong>Specyfika działania algorytmów</strong></p>

                        <p>System może generować informacje niepełne, nieaktualne lub nieprecyzyjne. Każda propozycja ugody wygenerowana przez system wymaga uważnej weryfikacji i ostatecznego zatwierdzenia przez Użytkownika przed nadaniem jej jakiejkolwiek mocy prawnej.</p>

                        <p>Zgodnie z wymogami transparentności, Administrator monitoruje działanie systemu i prowadzi rejestry techniczne zdarzeń w celu zapewnienia bezpieczeństwa, stabilności procesu oraz eliminacji błędów algorytmicznych.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Podstawy prawne i cele zbierania danych</h2>

                        <p>Państwa dane osobowe będą przetwarzane przez Administratora w celu:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Realizacji umowy na świadczenie usług mediacji online oraz umożliwienia interakcji z Asystentem AI – na podstawie art. 6 ust. 1 lit. b RODO (niezbędność do wykonania umowy).</li>
                            <li>Zapewnienia bezpieczeństwa i stabilności Serwisu oraz monitorowania potencjalnych nadużyć systemu AI – na podstawie art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes Administratora).</li>
                            <li>Udzielenia odpowiedzi na zapytania kierowane do Administratora drogą e-mailową lub telefoniczną – na podstawie art. 6 ust. 1 lit. f RODO.</li>
                            <li>Wypełnienia prawnych obowiązków podatkowych i rachunkowych, w szczególności w zakresie przechowywania dokumentacji księgowej – na podstawie art. 6 ust. 1 lit. c RODO.</li>
                            <li>Rozwoju i poprawy jakości usług poprzez analizę zanonimizowanych wzorców użytkowania algorytmów sztucznej inteligencji – na podstawie art. 6 ust. 1 lit. f RODO.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Zakres zbieranych danych i zasady anonimizacji</h2>

                        <p>Administrator przetwarza dane podane przy rejestracji (imię, nazwisko, adres e-mail) oraz dane techniczne (adres IP, metadane sesji). W ramach korzystania z funkcji Asystenta AI przetwarzane są opisy sporów i konfliktów wprowadzane przez Użytkowników.</p>

                        <p><strong>Wymóg anonimizacji danych</strong></p>

                        <p>Platforma e-porozumienie służy do analizy logiki konfliktu i wypracowania płaszczyzny porozumienia. Użytkownik jest zobowiązany do odpowiedniej anonimizacji dokumentów i opisów sporów przed ich udostępnieniem w Serwisie.</p>

                        <p>Zaleca się, aby wszelkie dane osobowe osób trzecich, kwoty lub wrażliwe szczegóły identyfikacyjne zostały zastąpione określeniami neutralnymi (np. Strona A, Strona B, Bank, Kredytobiorca, Pracodawca). Administrator nie ponosi odpowiedzialności za niezgodne z prawem przekazanie mu przez Użytkownika danych osobowych osób trzecich bez ich zgody lub odpowiedniego przygotowania treści.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Odbiorcy danych i transfery międzynarodowe</h2>

                        <p>Państwa dane osobowe mogą być przekazywane Odbiorcom danych przetwarzającym dane w imieniu Administratora:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Dostawcom silników sztucznej inteligencji (API), takich jak OpenAI Ltd. lub Anthropic PBC, w zakresie niezbędnym do przetworzenia zapytań i wygenerowania propozycji ugody.</li>
                            <li>Dostawcom usług hostingu i infrastruktury IT (np. DigitalOcean), zapewniającym przechowywanie danych na bezpiecznych serwerach.</li>
                            <li>Podmiotom analitycznym i marketingowym (np. Google Analytics, Microsoft Clarity), pomagającym optymalizować działanie Serwisu.</li>
                        </ul>

                        <p>Administrator może przekazywać dane osobowe poza Europejski Obszar Gospodarczy (EOG). W takich przypadkach Administrator polega na Standardowych Klauzulach Umownych zatwierdzonych przez Komisję Europejską lub certyfikatach zgodności w ramach Data Privacy Framework, co zapewnia odpowiedni poziom ochrony danych.</p>

                        <p>Informujemy, że dane przekazywane do dostawców AI za pośrednictwem profesjonalnych interfejsów programistycznych (API) nie są wykorzystywane przez te podmioty do trenowania publicznych modeli językowych.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Okres przetwarzania danych osobowych</h2>

                        <p>Państwa dane osobowe będą przetwarzane wyłącznie przez okres niezbędny do realizacji celów:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Dane konta i realizacji umowy – przez cały okres posiadania konta w Serwisie, a po jego usunięciu przez okres do 6 lat (cele ochrony przed roszczeniami).</li>
                            <li>Zapytania e-mailowe – przez okres 1 roku od ostatniego kontaktu.</li>
                            <li>Rejestry techniczne AI – przez okres minimum 6 miesięcy od dnia ich wygenerowania (cele audytowe i bezpieczeństwa).</li>
                            <li>Dane podatkowe i księgowe – przez okres 5 lat licząc od końca roku kalendarzowego, w którym upłynął termin płatności podatku.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Prawa osób, których dane są przetwarzane</h2>

                        <p>W związku z przetwarzaniem danych osobowych, przysługują Państwu następujące prawa:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Prawo dostępu do przetwarzanych danych oraz otrzymania ich kopii.</li>
                            <li>Prawo do sprostowania, ograniczenia przetwarzania lub usunięcia danych (prawo do bycia zapomnianym).</li>
                            <li>Prawo do przenoszenia danych w ustrukturyzowanym, powszechnie używanym formacie.</li>
                            <li>Prawo do cofnięcia zgody w dowolnym momencie, jeśli przetwarzanie odbywało się na jej podstawie.</li>
                            <li>Prawo do wniesienia sprzeciwu wobec przetwarzania danych opartego na prawnie uzasadnionym interesie Administratora.</li>
                            <li>Prawo do wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Polityka plików cookies</h2>

                        <p>Serwis internetowy korzysta z informacji zapisywanych za pomocą plików cookies. Są one wykorzystywane w celu:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Zapewnienia prawidłowego działania Serwisu (cookies niezbędne).</li>
                            <li>Personalizacji interfejsu i zapamiętywania preferencji Użytkownika (cookies funkcjonalne).</li>
                            <li>Tworzenia anonimowych statystyk pomagających ulepszać strukturę strony (cookies analityczne).</li>
                        </ul>

                        <p>Użytkownik ma możliwość określenia warunków przechowywania plików cookies poprzez ustawienia swojej przeglądarki internetowej. Całkowite wyłączenie plików cookies niezbędnych może spowodować wadliwe działanie niektórych funkcjonalności Serwisu.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Zmiany Polityki Prywatności</h2>

                        <p>Niniejsza Polityka Prywatności może zostać zmieniona przez Administratora w przypadku rozwoju technologii AI, wprowadzenia nowych funkcjonalności w Serwisie lub zmiany powszechnie obowiązujących przepisów prawa.</p>

                        <p>O wszelkich istotnych zmianach Użytkownicy zostaną poinformowani drogą e-mailową na adres wskazany podczas rejestracji lub poprzez czytelny komunikat wyświetlany w Serwisie.</p>

                        <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-sm text-gray-600">
                                <strong>Inspektor Ochrony Danych:</strong> W sprawach związanych z ochroną danych osobowych prosimy o kontakt pod adresem:
                                <a href="mailto:kontakt@e-porozumienie.pl" className="text-blue-600 hover:text-blue-800 ml-1">kontakt@e-porozumienie.pl</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        </>
    )
}