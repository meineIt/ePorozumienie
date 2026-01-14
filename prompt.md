# Prompt systemowy - zachowanie chatu
Analyze a supplied contract and the positions of two parties, then identify and summarize: (1) disputed points; (2) negotiable points; and (3) points of agreement.
Read and compare both the contract and each side's position statement carefully to identify all areas of overlap, conflict, or potential negotiation. Use thorough, step-by-step reasoning before making any classifications; only after analysis should you assign points to a category.
If information is ambiguous, make a note and clarify your reasoning.
Continue reasoning and comparison until all relevant contractual items are categorized.
## Steps:
1. Parse the supplied contract clause by clause.
2. Analyze each party’s position for each relevant point.
3. For each clause, reason through:
- Do both sides agree unambiguously? If yes, mark as "agreed."
- Is there direct disagreement or clearly opposed positions? If yes, mark as "disputed."
- Is there partial overlap, ambiguity, or an expressed openness to negotiation? If yes, mark as "negotiable."
4. Only after this step-by-step analysis, assign the clause to one of the three categories, giving brief reasoning for each categorization.
## Output Format:
Return the result as a JSON object in Polish, with three keys: "punkty_sporne" (disputed points), "punkty_do_negocjacji" (negotiable points), and "punkty_zgodne" (agreed points).
Each key should contain a list of objects, each object describing:
- the clause or point reference,
- a short summary,
- the main reasoning for classification.
Example of desired output (in Polish):
{
"punkty_sporne": [
{
"referencja": "[§2 Umowy, Wynagrodzenie]",
"podsumowanie": "Strona A żąda wyższej stawki, strona B nie akceptuje.",
"uzasadnienie": "Pozycje stron są sprzeczne (Strona A: 5000 zł, Strona B: 3000 zł)."
}
],
"punkty_do_negocjacji": [
{
"referencja": "[§4 Umowy, Termin realizacji]",
"podsumowanie": "Strony zbliżone w zakresie terminu końcowego, lecz wskazują inne daty rozpoczęcia.",
"uzasadnienie": "Strona A proponuje start 1 lipca, Strona B jest otwarta na 1-15 lipca."
}
],
"punkty_zgodne": [
{
"referencja": "[§6 Umowy, Odpowiedzialność]",
"podsumowanie": "Brak zastrzeżeń obu stron do zapisów dotyczących odpowiedzialności.",
"uzasadnienie": "Obie strony wyraziły zgodę na treść klauzuli."
}
]
}
(Realistic examples should provide as much detail as necessary to clarify the point and justify the assigned category.)
## Important Reminder
Your objective is to:
- Analyze the contract and both parties’ positions;
- Reason step by step before assigning to categories;
- Return a JSON object (in Polish) summarizing all disputed, negotiable, and agreed points, each with clear justification and references.



# Chat input
[Umowa] + [stanowiska stron]

Stanowisko Kredytobiorców
Spłata następuje przez potrącenie z ROR w PLN w pierwszym dniu miesiąca, a kwota jest przeliczana według „obowiązującego w PKO BP SA w dniu wymagalności kursu sprzedaży dewiz (aktualna Tabela kursów)”, co oddaje bankowi swobodę jednostronnego kształtowania miernika świadczenia i generuje spread niepowiązany z zewnętrznym wskaźnikiem.

Definicja „aktualnej Tabeli kursów” nie zawiera kryteriów jej ustalania, przez co mechanizm przeliczeń nie jest transparentny ani weryfikowalny dla przeciętnego konsumenta na etapie podejmowania decyzji o zaciągnięciu kredytu.

Umowa przewiduje użycie kursu średniego NBP jedynie przy rozliczeniu drobnej nadpłaty/niedopłaty po spłacie ostatniej raty, co pokazuje, że strony znały obiektywny punkt odniesienia, lecz celowo nie zastosowały go przy bieżącej spłacie, obciążając Kredytobiorców nieuzasadnionym kosztem spreadu.

Kredytobiorcy nie mają wprost umownego prawa regularnej spłaty w CHF bez pośrednictwa ROR w PLN, a § 13 nakazuje utrzymywanie środków na rachunku w PLN i dopuszcza automatyczne potrącenie po kursie sprzedaży banku, co ogranicza możliwość unikania spreadu.

Miesięczne zawiadomienia banku i obowiązek utrzymywania środków według ostatniego zawiadomienia potęgują asymetrię informacyjną, bo realna kwota w PLN zależy od kursu z dnia wymagalności ustalanego przez bank.

W konsekwencji Kredytobiorcy żądają stwierdzenia abuzywności klauzul odwołujących do „aktualnej Tabeli kursów” przy spłacie, rozliczenia nadpłat wynikających ze spreadu oraz dopuszczenia spłaty po kursie obiektywnym (np. kurs średni NBP) albo bezpośrednio w CHF.

Stanowisko PKO BP SA
Konstrukcja kredytu jest walutowa: kwota i oprocentowanie są w CHF (LIBOR CHF + marża), więc naturalne jest rozliczanie spłaty według bankowego kursu sprzedaży dewiz z „aktualnej Tabeli kursów” w dniu wymagalności, co zostało jednoznacznie uzgodnione i opisane w umowie.

„Aktualna Tabela kursów” jest integralnym elementem obsługi produktów walutowych i jest stosowana nie tylko przy spłatach, lecz także przy wypłatach w walucie wymienialnej lub PLN, co potwierdza spójność i przewidywalność mechanizmu w całym cyklu życia kredytu.

Użycie kursu średniego NBP w § 21 dotyczy wyłącznie technicznego, końcowego rozliczenia drobnych różnic i nie może być rozszerzane na bieżące raty, dla których strony wyraźnie przyjęły kurs sprzedaży dewiz z Tabeli kursów.

Umowa przewiduje, że na wniosek Kredytobiorców bank nie pobiera opłat za zmianę waluty kredytu, co stanowiło instrument ograniczania ryzyka kursowego po stronie klientów bez dodatkowych kosztów transakcyjnych.

Miesięczne zawiadomienia o wysokości należnych spłat zapewniają przejrzystość rozliczeń, a obowiązek utrzymania środków na ROR wynika z przyjętego w umowie mechanizmu potrącenia i jest standardowy dla kredytów obsługiwanych przez bank.

Bank stoi na stanowisku, że klauzule przeliczeniowe nie są abuzywne, bo określają istotne elementy umowy w sposób jednoznaczny, znany stronom od chwili zawarcia, a wahania kursów oraz wynikające z nich koszty są immanentnym ryzykiem kredytu walutowego przyjętym przez Kredytobiorców



# Output
{
"punkty_sporne": [
{
"referencja": "[§1 ust. 8, Definicja „aktualnej Tabeli kursów”]",
"podsumowanie": "Brak obiektywnych, weryfikowalnych kryteriów tworzenia Tabeli kursów.",
"uzasadnienie": "Kredytobiorcy twierdzą, że mechanizm przeliczeń jest nietransparentny i pozostawia bankowi swobodę jednostronnego kształtowania kursu (miernika świadczenia). Bank utrzymuje, że Tabela jest integralnym, jasno opisanym elementem obsługi produktów walutowych. Sprzeczność stanowisk co do transparentności i zakresu uznaniowości banku."
},
{
"referencja": "[§13 ust. 1–4, Mechanizm spłaty przez potrącenie z ROR w PLN]",
"podsumowanie": "Spłata wyłącznie z ROR w PLN bez wyraźnego prawa regularnej spłaty w CHF.",
"uzasadnienie": "Kredytobiorcy wskazują, że brak opcji spłaty bezpośrednio w CHF zmusza do ponoszenia kosztu spreadu. Bank uznaje potrącenie z ROR w PLN za standard i element uzgodnionego mechanizmu. Sprzeczne cele stron (eliminacja spreadu vs. utrzymanie obecnego trybu)."
},
{
"referencja": "[§13 ust. 5–6, Zawiadomienia i obowiązek utrzymywania środków]",
"podsumowanie": "Asymetria informacyjna co do realnej kwoty w PLN vs. przejrzystość rozliczeń.",
"uzasadnienie": "Kredytobiorcy podnoszą, że mają obowiązek utrzymywania środków wg ostatniego zawiadomienia, podczas gdy ostateczna kwota zależy od kursu w dniu wymagalności ustalanego przez bank. Bank twierdzi, że miesięczne zawiadomienia zapewniają przejrzystość. Spór co do ryzyka i przejrzystości mechanizmu."
},
{
"referencja": "[§13 ust. 7, Kurs sprzedaży dewiz (aktualna Tabela kursów) w dniu wymagalności]",
"podsumowanie": "Stosowanie kursu sprzedaży banku do bieżących rat i zarzut abuzywności.",
"uzasadnienie": "Kredytobiorcy żądają stwierdzenia abuzywności klauzul odwołujących do Tabeli kursów, rozliczenia nadpłat (spread) oraz spłaty wg kursu obiektywnego (np. NBP) lub w CHF. Bank odrzuca zarzuty, wskazując na jednoznaczne uzgodnienie i walutowy charakter kredytu. Bezpośredna kolizja stanowisk."
},
{
"referencja": "[§17 ust. 1, Przeliczenie zadłużenia przeterminowanego kursem sprzedaży banku]",
"podsumowanie": "Rozszerzenie mechanizmu kursowego na zaległości.",
"uzasadnienie": "Choć Kredytobiorcy koncentrują się na bieżących ratach, ich zarzut dotyczy klauzul przeliczeniowych odwołujących do Tabeli kursów, co obejmuje także §17. Bank uznaje mechanizm za spójny i uzgodniony. Spór co do dopuszczalności takiego miernika."
},
{
"referencja": "[§5 ust. 4–5 vs. stanowisko Banku (opis spójności Tabeli kursów)]",
"podsumowanie": "Zakres stosowania Tabeli kursów przy wypłacie.",
"uzasadnienie": "Umowa przewiduje: dla wypłat w walucie wymienialnej – Tabela kursów (§5 ust. 5); dla wypłat w PLN – kurs negocjowany z dealerem (§5 ust. 4). Bank twierdzi, że Tabela stosowana jest także przy wypłatach w PLN. Rozbieżność między literalną treścią umowy a opisem Banku – punkt sporny interpretacyjnie/faktycznie."
}
],
"punkty_do_negocjacji": [
{
"referencja": "[§1 ust. 8 oraz §13, Zasady ustalania Tabeli kursów]",
"podsumowanie": "Doprecyzowanie metodologii Tabeli kursów lub powiązanie ze wskaźnikiem zewnętrznym.",
"uzasadnienie": "Definicja Tabeli nie zawiera kryteriów. Możliwe pole negocjacji: publikacja zasad ustalania kursów/spreadu, limity spreadu, oparcie o kurs NBP + stała marża. Ambiguityzacja po stronie umowy sugeruje możliwość doprecyzowania bez zmiany istoty kredytu."
},
{
"referencja": "[§13 ust. 1–4, Kanał spłaty i waluta spłaty]",
"podsumowanie": "Wprowadzenie prawa do regularnej spłaty bezpośrednio w CHF obok potrącenia z ROR w PLN.",
"uzasadnienie": "Kredytobiorcy żądają dostępu do spłaty w CHF; Bank wskazuje na brak opłat za zmianę waluty kredytu (§29), co nie jest tożsame ze spłatą w CHF. Możliwy kompromis: aneks dopuszczający spłaty w CHF na rachunek techniczny."
},
{
"referencja": "[§13 ust. 5–7, Mechanika terminu i kursu spłaty]",
"podsumowanie": "Ustalenie wcześniejszego „fixingu” kursu lub powiązanie kwoty PLN z kursem publikowanym zewnętrznie.",
"uzasadnienie": "Kredytobiorcy wskazują na asymetrię wynikającą z ustalania kursu w dniu wymagalności. Możliwe rozwiązania: zamrożenie kursu na D-1/D-2, użycie kursu NBP z określonej godziny/dnia, publikacja kursu z wyprzedzeniem."
},
{
"referencja": "[§5 ust. 4–5, Zasady przeliczeń przy wypłacie]",
"podsumowanie": "Ujednolicenie zasad (Tabela vs kurs negocjowany) dla większej spójności cyklu życia kredytu.",
"uzasadnienie": "Bank akcentuje spójność, ale umowa rozróżnia mechanizmy dla wypłat w PLN i w walucie. Możliwe doprecyzowanie/ujednolicenie zasad w aneksie."
},
{
"referencja": "[§21, Zakres zastosowania kursu średniego NBP]",
"podsumowanie": "Rozważenie rozszerzenia odwołania do kursu NBP poza techniczne rozliczenie końcowe.",
"uzasadnienie": "Umowa już odwołuje się do kursu NBP przy drobnych różnicach. Kredytobiorcy chcą stosowania obiektywnego kursu do bieżących rat; Bank się sprzeciwia. Jest to potencjalny obszar kompromisu poprzez modyfikację umowy."
}
],
"punkty_zgodne": [
{
"referencja": "[§2, §6, Charakter kredytu i oprocentowanie]",
"podsumowanie": "Kredyt walutowy w CHF; oprocentowanie zmienne: LIBOR CHF + marża.",
"uzasadnienie": "Obie strony zgodnie opisują kredyt jako walutowy w CHF i odwołują się do LIBOR CHF + marża; brak zastrzeżeń do sposobu ustalania oprocentowania."
},
{
"referencja": "[§12 ust. 4–5, §13 ust. 3–4, Harmonogram spłaty]",
"podsumowanie": "Raty annuitetowe, termin spłaty w pierwszym dniu miesiąca.",
"uzasadnienie": "Strony nie kwestionują harmonogramu i terminów jako takich; spór dotyczy sposobu przeliczeń i kanału spłaty, nie dat."
},
{
"referencja": "[§20, Wcześniejsza spłata]",
"podsumowanie": "Możliwość wcześniejszej spłaty i uzyskania informacji o kwocie.",
"uzasadnienie": "Brak zastrzeżeń stron do klauzul wcześniejszej spłaty; Bank podkreśla brak opłat za wcześniejszą spłatę w §29."
},
{
"referencja": "[§21 ust. 1–3, Rozliczenie końcowe drobnych różnic kursem średnim NBP]",
"podsumowanie": "Zastosowanie kursu średniego NBP do drobnych nadpłat/niedopłat po ostatniej racie.",
"uzasadnienie": "Obie strony potwierdzają zakres tej klauzuli; różnią się jedynie co do wniosków interpretacyjnych dla bieżących rat."
},
{
"referencja": "[§29 ust. 1 pkt 1 i 4, Brak opłat za zmianę waluty kredytu i wcześniejszą spłatę]",
"podsumowanie": "Bank nie pobiera opłat/prowizji za zmianę waluty kredytu i całkowitą wcześniejszą spłatę.",
"uzasadnienie": "Bank powołuje się na ten zapis jako instrument ograniczania ryzyka; Kredytobiorcy nie kwestionują istnienia tej klauzuli (choć podnoszą, że nie zastępuje prawa do spłaty w CHF)."
}
]
}

