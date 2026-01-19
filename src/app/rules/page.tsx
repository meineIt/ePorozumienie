import Navigation from "../components/indexPageSections/Navigation";
import Footer from "../components/indexPageSections/Footer";

export const metadata = {
    title: 'Regulamin | e-Porozumienie',
    description: 'Regulamin korzystania z platformy e-Porozumienie - pierwszej platformy do mediacji online.',
  };

export default function Rules() {
    return (
        <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 pt-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8 md:p-12">
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                            REGULAMIN ŚWIADCZENIA USŁUG DROGĄ ELEKTRONICZNĄ EPOROZUMIENIE.PL
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 text-center">
                            <strong>Wersja: 1.0</strong> | <strong>Data publikacji: 16.01.2025</strong>
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. POSTANOWIENIA OGÓLNE</h2>

                        <p>1.1. Niniejszy Regulamin określa zasady świadczenia usług drogą elektroniczną za pośrednictwem platformy dostępnej pod adresem eporozumienie.pl (dalej jako: &bdquo;Serwis&rdquo;).</p>

                        <p>1.2. Usługodawcą i Administratorem danych są Organizatorzy narzędzia e-porozumienie (dalej jako: &bdquo;Usługodawca&rdquo;). Kontakt z Usługodawcą odbywa się pod adresem e-mail: eporozumienie@gmail.com</p>

                        <p>1.3. Regulamin określa w szczególności:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>rodzaje i zakres Usług świadczonych drogą elektroniczną;</li>
                            <li>warunki świadczenia Usług, w tym wymagania techniczne oraz zakazy dostarczania treści bezprawnych;</li>
                            <li>warunki zawierania i rozwiązywania umów o świadczenie Usług;</li>
                            <li>procedurę reklamacyjną.</li>
                        </ul>

                        <p>1.4. Akceptacja Regulaminu jest dobrowolna, ale konieczna w celu utworzenia Konta i korzystania z pełnej funkcjonalności Serwisu.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. DEFINICJE</h2>

                        <p>2.1. <strong>Asystent AI</strong> Inteligentny system oparty na sztucznej inteligencji, pełniący rolę bezstronnego asystenta, który analizuje spory, identyfikuje punkty wspólne oraz sporne i generuje propozycje ugód.</p>

                        <p>2.2. <strong>Konto</strong> Indywidualny panel Użytkownika, dostępny po rejestracji, umożliwiający zarządzanie procesem porozumienia i historią konwersacji.</p>

                        <p>2.3. <strong>Dokument</strong> Plik w formacie PDF, DOCX, TXT lub obraz (JPG, PNG) wgrany przez Użytkownika w celu automatycznej analizy przez systemy AI.</p>

                        <p>2.4. <strong>Użytkownik</strong> Osoba fizyczna posiadająca pełną zdolność do czynności prawnych (w tym przedsiębiorcy prowadzący działalność gospodarczą), która korzysta z Usług Serwisu.</p>

                        <p>2.5. <strong>LegalTech 2.0</strong> Model integracji technologii AI z procesem rozwiązywania konfliktów, mający na celu wsparcie człowieka w szybkim zawieraniu porozumień online.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. WARUNKI ŚWIADCZENIA USŁUG</h2>

                        <p>3.1. Korzystanie z Usług wymaga:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>posiadania urządzenia z dostępem do sieci Internet;</li>
                            <li>aktywnego konta poczty elektronicznej;</li>
                            <li>poprawnej konfiguracji przeglądarki internetowej obsługującej pliki cookies.</li>
                        </ul>

                        <p>3.2. Użytkownik zobowiązuje się do:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>podaawania prawdziwych danych podczas rejestracji;</li>
                            <li>korzystania z Serwisu w sposób nienaruszający praw osób trzecich oraz dobrych obyczajów;</li>
                            <li>nieudostępniania Konta osobom trzecim.</li>
                        </ul>

                        <p>3.3. <strong>Zakaz dostarczania treści bezprawnych</strong></p>
                        <p>Zabronione jest wprowadzanie do Serwisu treści naruszających prawo, nawołujących do przemocy, zawierających wirusy lub treści o charakterze manipulacyjnym.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. SYSTEM SZTUCZNEJ INTELIGENCJI I TRANSPARENTNOŚĆ</h2>

                        <p>4.1. <strong>Informacja o systemie AI</strong></p>
                        <p>Zgodnie z rozporządzeniem (UE) 2024/1689 (AI Act), Usługodawca informuje, że system E-porozumienie jest systemem sztucznej inteligencji przeznaczonym do interakcji z osobami fizycznymi. Wszystkie odpowiedzi są tworzone automatycznie.</p>

                        <p>4.2. <strong>Ograniczenia technologiczne</strong></p>
                        <p>Użytkownik przyjmuje do wiadomości, że odpowiedzi generowane przez AI są wynikiem analizy probabilistycznej i mogą zawierać błędy lub informacje nieprawdziwe. Każdy wynik pracy Asystenta AI wymaga krytycznej oceny i weryfikacji przez Użytkownika.</p>

                        <p>4.3. <strong>Brak charakteru porady prawnej</strong></p>
                        <p>Żadna treść wygenerowana przez Serwis nie stanowi porady prawnej, opinii prawnej ani oficjalnej wykładni prawa. Usługodawca nie świadczy pomocy prawnej w rozumieniu ustawy o adwokaturze i radcach prawnych.</p>

                        <p>4.4. <strong>Zasada bezstronności</strong></p>
                        <p>Asystent AI działa w sposób zaprogramowany na poszukiwanie kompromisu i punktów wspólnych. Użytkownik przyjmuje do wiadomości, że system nie pełni roli rzecznika interesów żadnej ze stron sporu.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. PRZETWARZANIE DOKUMENTÓW I ANONIMIZACJA</h2>

                        <p>5.1. <strong>Zakres analizy</strong></p>
                        <p>Serwis umożliwia wgrywanie Dokumentów w celu ekstrakcji tekstu (OCR) oraz analizy merytorycznej pod kątem sporu.</p>

                        <p>5.2. <strong>Wymóg anonimizacji</strong></p>
                        <p>Użytkownik zobowiązany jest do usunięcia z Dokumentów wszelkich danych osobowych osób fizycznych przed ich wgraniem do Serwisu. Administrator nie weryfikuje Dokumentów pod kątem obecności danych osobowych przed ich przesłaniem do modelu AI.</p>

                        <p>5.3. <strong>Odpowiedzialność za dane</strong></p>
                        <p>Użytkownik ponosi pełną odpowiedzialność za wprowadzenie do systemu danych osobowych osób trzecich bez ich zgody. W przypadku naruszenia tego obowiązku, Użytkownik zobowiązuje się do zwrotu Usługodawcy wszelkich kosztów wynikających z ewentualnych roszczeń lub kar administracyjnych.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. ZAWARCIE UMOWY I REJESTRACJA KONTA</h2>

                        <p>6.1. Umowa o świadczenie usług drogą elektroniczną zostaje zawarta z chwilą skutecznego wypełnienia formularza rejestracyjnego i akceptacji Regulaminu.</p>

                        <p>6.2. Użytkownik może w każdej chwili rozwiązać umowę poprzez usunięcie Konta lub przesłanie stosownej prośby na adres e-mail Usługodawcy.</p>

                        <p>6.3. Usługodawca zastrzega sobie prawo do zablokowania Konta w przypadku rażącego naruszenia postanowień Regulaminu lub podejmowania działań szkodliwych dla stabilności Serwisu.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. MODEL ABONAMENTOWY I PŁATNOŚCI</h2>

                        <p>7.1. Usługi w Serwisie mogą być świadczone w modelu darmowym (podstawowym) lub odpłatnym (Abonament).</p>

                        <p>7.2. Szczegółowy zakres funkcjonalności dostępnych w ramach poszczególnych Planów oraz wysokość opłat są określone w Cenniku dostępnym w Serwisie.</p>

                        <p>7.3. Płatności realizowane są za pośrednictwem zewnętrznych operatorów płatności (np. Stripe). Usługodawca nie przechowuje pełnych danych kart płatniczych Użytkowników.</p>

                        <p>7.4. Usługodawca wystawia faktury drogą elektroniczną na dane podane przez Użytkownika w panelu rozliczeniowym.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. ODPOWIEDZIALNOŚĆ I SIŁA WYŻSZA</h2>

                        <p>8.1. <strong>Wyłączenie odpowiedzialności</strong></p>
                        <p>Usługodawca nie ponosi odpowiedzialności za szkody powstałe w wyniku podjęcia przez Użytkownika działań lub decyzji na podstawie wyników wygenerowanych przez Asystenta AI.</p>

                        <p>8.2. <strong>Dostępność Serwisu</strong></p>
                        <p>Usługodawca dokłada starań, aby Serwis był dostępny 24/7, jednak zastrzega sobie prawo do przerw technicznych oraz nie odpowiada za przestoje wynikające z awarii infrastruktury dostawców modeli AI (np. OpenAI, Anthropic).</p>

                        <p>8.3. <strong>Siła Wyższa</strong></p>
                        <p>Usługodawca nie odpowiada za niewykonanie zobowiązań wynikające ze zdarzeń o charakterze siły wyższej (wojna, epidemia, ogólnopolskie awarie sieci telekomunikacyjnych).</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. PRAWA WŁASNOŚCI INTELEKTUALNEJ</h2>

                        <p>9.1. Prawa do Serwisu, nazwy e-porozumienie oraz oprogramowania Asystenta AI należą do Usługodawcy.</p>

                        <p>9.2. <strong>Własność wyników (Output)</strong></p>
                        <p>Usługodawca przenosi na Użytkownika autorskie prawa majątkowe do treści wygenerowanych specjalnie dla niego przez Asystenta AI (np. projekt ugody), o ile treści te spełniają cechy utworu w rozumieniu prawa autorskiego.</p>

                        <p>9.3. <strong>Zakaz inżynierii wstecznej</strong></p>
                        <p>Zabronione jest podejmowanie prób kopiowania kodu źródłowego Serwisu lub omijania zabezpieczeń mających na celu ochronę algorytmów AI.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. PROCEDURA REKLAMACYJNA</h2>

                        <p>10.1. Użytkownik ma prawo złożyć reklamację dotyczącą działania Serwisu.</p>

                        <p>10.2. Reklamacje należy składać drogą elektroniczną na adres: eporozumienie@gmail.com.</p>

                        <p>10.3. Reklamacja powinna zawierać opis problemu oraz dane umożliwiające identyfikację Konta Użytkownika. Usługodawca rozpatruje reklamacje w terminie 14 dni od ich otrzymania.</p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. POSTANOWIENIA KOŃCOWE</h2>

                        <p>11.1. Regulamin może ulec zmianie. O planowanych zmianach Użytkownicy zostaną poinformowani z 14-dniowym wyprzedzeniem za pośrednictwem poczty elektronicznej.</p>

                        <p>11.2. W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego, w szczególności Kodeksu Cywilnego oraz ustawy o świadczeniu usług drogą elektroniczną.</p>

                        <p>11.3. Wszelkie spory będą rozstrzygane przez sąd powszechny właściwy dla siedziby Administratora (po jego formalnej rejestracji w KRS).</p>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        </>
    )
}
