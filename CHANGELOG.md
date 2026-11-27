# Changelog

## 2.5.1 — 2026-11-27

Precisazioni di testo; nessun verdetto, stadio, grado o codice cambia.

### README (segnalato da Codex via AI-Bridge#16 e verificato)
- Regola del 5% nel pT1/pT2: l'avviso compare solo senza sottotipo dichiarato; con sottotipo il grado è alto per definizione.
- Codice ICD-O del sottotipo: riportato solo in pT1/pT2, non in pTa né in pTis.

### Testi più aderenti alla fonte (dalla revisione indipendente della 2.4.0)
- Messaggio di contraddizione sulla quota HG con citologia normale: ripristinata la dicitura "assente (normale)" (la 2.4.0 l'aveva cambiata in "Assente (normale)").
- Papilloma: "il profilo molecolare può aiutare a distinguere" (era "può distinguere"); criterio "lesione papillare esofitica solitaria" aggiunto. Papilloma invertito: l'avviso sulla storia di carcinoma uroteliale cita il capitolo del papilloma esofitico, l'unico che tratta il punto; nota IHC senza "non necessaria"; DD "atipia nucleare severa" (era "atipia marcata").
- PUNLMP: etichetta del grado "PUNLMP (atipia lieve e monotona)" (era "PUNLMP: non graduata (…)").
- Campo storia: "criterio per la PUNLMP, cautela per il papilloma". Scheda TPS: tolta l'abbreviazione LGUN, motivazione come nella fonte.
- Pulsante "Lieve monotono (PUNLMP)" mostrato solo per le lesioni papillari (o se già selezionato).
- Nota sulle versioni: 2.3.0 era il numero provvisorio della PR sull'impaginazione, che diventa 2.5.0.

## 2.5.0 — 2026-11-27

Impaginazione più compatta per la consultazione al PC durante la refertazione. Solo presentazione: motore, testi diagnostici, soglie ed esiti invariati (stessi test del motore della 2.4.0).

### Cambiato
- Quattro schede (Caso, Matrice delle entità, Trappole e sottotipi, IHC e TPS) al posto di un'unica pagina lunga; la scheda è indicata nell'indirizzo (`#matrice`, ecc.). "Carica" dalla matrice torna alla scheda Caso.
- Verdetto fisso a destra durante lo scorrimento. In alto: titolo, stadio, grado, ICD-O; finché il verdetto non è emesso, l'elenco dei campi da valutare o delle contraddizioni resta in vista.
- Criteri e diagnosi differenziali, indicazione IHC, schema istologico, bozza del referto e casi salvati in riquadri apribili; "Copia referto" e "Salva caso" sempre visibili.
- Pulsanti delle opzioni con la sola etichetta; la descrizione completa è nel suggerimento al passaggio del mouse, oppure sempre visibile con "Mostra le descrizioni delle opzioni" (preferenza ricordata dal browser).
- Scenari di riferimento e nota UPUMP in riquadri apribili; contesto e IHC in una scheda separata dal passo 4.
- Intestazione ridotta a una riga.

## 2.4.0 — 2026-11-27

Allineamento ai capitoli WHO 2022 (Blue Book, 5ª ed.) *Urothelial papilloma*, *Inverted urothelial papilloma* e *Papillary urothelial neoplasm of low malignant potential*, su indicazione di Filippo.

### Cambiato (cambia gli esiti)
- Papilloma: nuovo campo "Pattern di crescita" (esofitico / invertito) per le lesioni papillari, obbligatorio per il verdetto di papilloma. Esofitico: "Papilloma uroteliale", ICD-O 8120/0; invertito: "Papilloma uroteliale invertito", ICD-O 8121/0, con criteri e diagnosi differenziali del capitolo dedicato. Prima: un solo esito "Papilloma uroteliale (esofitico o invertito)", 8120/0. Negli altri papillari il pattern di crescita compare solo nel referto.
- PUNLMP: stadio "pTa (PUNLMP)" (prima "PUNLMP"); fonte: "PUNLMP is a non-invasive neoplasm and therefore considered stage pTa".
- Nuovo grado al passo 3, solo per i papillari: "Lieve ingrandimento monotono, senza variazione (PUNLMP)". La PUNLMP richiede questo grado (fonte: "mild cytological atypia"; cellule "monotonous, with mild cellular and nuclear enlargement and without variation"). Urotelio ispessito ordinato con citologia "assente (normale)" ora è una contraddizione (prima dava PUNLMP). Grado monotono con papille normali, disordine architetturale, lesione piatta, invasione o quota HG > 0: contraddizione.
- Nuovo campo "Storia di carcinoma uroteliale" (tre stati). PUNLMP: obbligatorio; se presente, verdetto sospeso (criterio essenziale "no history of urothelial carcinoma"). Papilloma: avviso di estrema cautela ed esame dell'intera lesione se presente o non valutato.

### Cambiato (testi)
- Passo 2: opzioni papillari allineate alla fonte (papilloma ≤ 7 strati o cordoni invertiti di 5–10 cellule; PUNLMP con urotelio ispessito o più cellulato).
- Matrice: papilloma con codici 8120/0 e 8121/0, IHC dell'invertito (CK20 negativo, p53 e Ki-67 bassi); PUNLMP con stadio pTa, atipia lieve e monotona, criterio della storia.
- Scheda TPS: categoria "low-grade urothelial neoplasm" (papilloma, PUNLMP, carcinoma di basso grado).

## 2.2.0 — 2026-11-26

Allineamento ai capitoli WHO 2022 (Blue Book, 5ª ed.) *Invasive urothelial carcinoma* e *Non-invasive papillary urothelial carcinoma, low-grade / high-grade*, su indicazione di Filippo.

### Cambiato (cambia gli esiti)
- pT1 e pT2 con sottotipo dichiarato presente: grado sempre "Alto grado (HG) — sottotipo: alto grado per definizione (WHO 2022)". Prima il pT1 con citologia lieve dava "Basso grado (LG)" e il pT2 "Alto grado (o sottotipo blando)". Fonte: "Histological subtypes of urothelial carcinoma and those with divergent differentiation are all considered high-grade tumours". Senza sottotipo il basso grado invasivo resta possibile (raro, riconosciuto dalla fonte).
- Campo "sottotipo" del referto esteso a tutti gli 11 sottotipi del Blue Book (prima solo nested, large nested, tubulare, microcistico): ora "Sottotipo istologico (WHO 2022)", con tubulare e microcistico in una voce unica (i casi salvati con le due voci separate vengono convertiti). Qualunque sottotipo dichiarato in pT1/pT2 dà alto grado. Il referto riporta nome, percentuale e, solo in pT1/pT2 (non in pTa né in pTis), il codice ICD-O del sottotipo (dal capitolo sul carcinoma invasivo del Blue Book: es. micropapillare 8131/3, plasmacitoide 8122/3); il codice del verdetto resta 8120/3. Riga per sottotipo non specificato: "Sottotipo istologico: specificare il sottotipo e la relativa percentuale (%)" (prima "Sottotipo istologico / differenziazione divergente: specificare sottotipo (es. …)").
- Titolo pT2 con sottotipo: invariato per i sottotipi blandi; "…(pT2), sottotipo <nome>" per gli altri; "…(pT2), sottotipo da specificare" se il sottotipo non è indicato (prima "sottotipo a citologia blanda").
- Avviso per sottotipo in lesione con membrana basale integra: generico per tutti i sottotipi; per il micropapillare in lesione papillare (pTa) ricorda che il Blue Book descrive la forma micropapillare non invasiva; nel CIS piatto (pTis) resta l'avviso generico.

### Cambiato (testi di consultazione)
- Matrice, riga "invasivo": i sottotipi blandi non sono più accostati al basso grado.
- Sottotipi: aggiunti giant cell e poorly differentiated; tubulare e microcistico riuniti in una voce, come nel Blue Book; nota che tutti i sottotipi sono di alto grado.
- IHC: frase su CK7/CK20/CDX2 riscritta secondo la fonte (sovrapposizione con l'adenocarcinoma enterico nella differenziazione ghiandolare intestinale; distinzione definitiva non possibile con morfologia e IHC, risolta al meglio su clinica e imaging).
- Avviso "il grado segue il passo 3" (pT1/pT2 papillare con quota HG ≥ 5%) non mostrato quando è dichiarato un sottotipo, perché il grado è alto per definizione. Segnalato dalla revisione indipendente.

### Confermato senza modifiche
- Regola del 5%, dicitura per la quota < 5%, codici ICD-O 8130/2 e 8120/3, criteri TPS (N:C ≥ 0,7), uso dell'IHC non necessario per il grado. Regola del 5% mantenuta anche sui papillari con invasione indeterminata, per scelta di Filippo.

## 2.0.1 — 2026-11-26

Correzioni dalla revisione indipendente della 2.0.0. Contenuto diagnostico invariato.

### Corretto (cambia gli esiti)
- Estensione pT1: non più arrotondata a 0,1 mm prima del confronto con le soglie. 0,45–0,49 mm torna T1m (la 2.0.0 dava T1e); 0,95–0,99 mm torna ROL1 (la 2.0.0 dava ROL2), come nella v1. La misura è mostrata come inserita.
- Quota HG: nessun arrotondamento nel motore e nessun troncamento nell'interfaccia; 4,5% resta basso grado in entrambi i percorsi (la 2.0.0 dava alto grado dal motore e basso grado dall'interfaccia).
- Casi salvati dalla v1: una casella non spuntata diventa "non valutato" (la 2.0.0 la leggeva come "assente"); % HG e mm pT1 conservati solo dove la v1 li mostrava (papillare; pT1).

### Corretto (non cambia gli esiti)
- Misura pT1 mostrata nel referto, nel chip e nella didascalia esattamente come inserita: la 2.0.1 in bozza la arrotondava a 2 decimali (0,499 mostrato "0,5" accanto a T1m < 0,5 mm). Segnalato da Codex via AI-Bridge.
- Orario dei casi salvati accettato solo nel formato HH:MM.
- I casi salvati non conservano valori nascosti non pertinenti (mm pT1 su un caso non pT1, % HG su un caso non papillare).
- Cursori sbiaditi quando il valore è "non valutato"; un valore fuori intervallo viene riscritto subito nel campo.

## 2.0.0 — 2026-11-25

Prima versione nel repository. Parte dalla versione 1 della checklist urotelio (file HTML singolo) e ne corregge la logica; il contenuto diagnostico (testi dei rami, soglie, codici ICD-O, matrice, trappole, simulatore IHC) è invariato.

### Cambiato (cambia gli esiti)
- Tutti i campi partono "non valutato"; la v1 si apriva già su pTa basso grado.
- Il verdetto è emesso solo con i campi obbligatori compilati; altrimenti "Checklist incompleta" con l'elenco dei campi mancanti.
- Le combinazioni contraddittorie sospendono il verdetto ("Verdetto sospeso: combinazione incoerente") e vengono elencate. Nella v1 producevano un verdetto vuoto (architettura invasiva con membrana basale integra), "Urotelio normale" (citologia normale con perdita di polarità), "Alto grado" inventato (pT1 con grado assente o reattivo) o "Papilloma" (papillare con grado reattivo o con disordine e citologia normale).
- Rimossi gli accoppiamenti nascosti tra campi: scegliere pT1 non trasforma più l'architettura in "invasiva"; scegliere "Alto grado" non imposta più la quota HG al 100%; scegliere una polarità non modifica più invasione o sottotipo.
- pTa alto grado senza quota indicata: "quota non quantificata" invece di 100%.
- pT1 senza misura: nessuna classe ROL o T1m/T1e.
- Livello rispetto alla muscularis mucosae scritto in forma descrittiva nel referto (eliminata l'etichetta ambigua "pT1b/c").
- Etichetta del verdetto: "Orientamento morfologico WHO 2022 (non sostituisce la diagnosi)".
- "Ripristina checklist" azzera tutti i campi (nella v1 caricava pTa basso grado).

### Aggiunto
- Passo 5 "Elementi di referto": muscolare propria nel campione, invasione linfovascolare, CIS associato; nel contesto, nome e percentuale del sottotipo.
- Avvisi: CIS con flogosi non valutata; nidi a contorni lisci con invasione accertata; pattern blando senza sottotipo; sottotipo con membrana basale integra; pT1 papillare di basso grado con quota HG ≥ 5%.
- Test del motore (`tests/run.mjs`) e controllo offline (`tests/offline.mjs`).

### Rimosso
- Google Fonts e libreria di icone da unpkg: font di sistema e icone SVG inline; la pagina funziona offline.
- Persistenza del caso in corso: si salvano solo archivio casi e preferenze (host notebook se presente, altrimenti il browser). I casi salvati dalla v1 vengono convertiti.
