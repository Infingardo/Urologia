# Changelog

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
