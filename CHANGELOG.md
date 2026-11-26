# Changelog

## 2.2.0 — 2026-11-26

Allineamento ai capitoli WHO 2022 (Blue Book, 5ª ed.) *Invasive urothelial carcinoma* e *Non-invasive papillary urothelial carcinoma, low-grade / high-grade*, su indicazione di Filippo.

### Cambiato (cambia gli esiti)
- pT1 e pT2 con sottotipo dichiarato presente: grado sempre "Alto grado (HG) — sottotipo: alto grado per definizione (WHO 2022)". Prima il pT1 con citologia lieve dava "Basso grado (LG)" e il pT2 "Alto grado (o sottotipo blando)". Fonte: "Histological subtypes of urothelial carcinoma and those with divergent differentiation are all considered high-grade tumours". Senza sottotipo il basso grado invasivo resta possibile (raro, riconosciuto dalla fonte).

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
