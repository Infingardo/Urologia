# Urologia

Strumenti di uropatologia per uso didattico e di supporto alla refertazione. Ogni strumento è una pagina HTML autonoma che funziona offline: si apre direttamente nel browser, senza server, senza librerie e senza risorse esterne.

## Strumenti

| Cartella | Strumento |
|---|---|
| [`urotelio/`](urotelio/index.html) | Checklist delle proliferazioni e neoplasie uroteliali (WHO 2022, 5ª ed.) |

## Checklist urotelio

Checklist in cinque passi (architettura; spessore e polarità; grado citonucleare con soglia del 5% di alto grado nei papillari non invasivi; membrana basale e invasione con substaging pT1; elementi di referto), con matrice comparativa delle entità, trappole morfologiche, simulatore del pannello CK20/p53/CD44 e correlazione con The Paris System.

La pagina è organizzata in quattro schede: **Caso** (passi a sinistra, verdetto fisso a destra con i campi ancora da valutare; criteri, diagnosi differenziali, IHC, schema e referto in riquadri apribili), **Matrice delle entità**, **Trappole e sottotipi**, **IHC e TPS**. Le descrizioni delle opzioni compaiono al passaggio del mouse o sempre, se attivate.

L'esito è un **orientamento morfologico**: non sostituisce la diagnosi, che resta del patologo.

### Come ragiona

- **Tre stati per ogni reperto**: non valutato, assente, presente. Un campo vuoto non equivale ad "assente".
- **Nessun verdetto su dati incompleti**: servono architettura, polarità, grado e stato della membrana basale; nei papillari di basso grado serve la quota di alto grado (anche 0%); nelle lesioni piatte con atipia lieve serve lo stato della flogosi.
- **Nessun verdetto su dati contraddittori**: le combinazioni incoerenti (per esempio architettura infiltrante con membrana basale integra, invasione con citologia normale o reattiva, pT2 senza muscolare propria nel campione) sospendono il verdetto e vengono elencate.
- **Nessun campo ne modifica un altro di nascosto.**
- **Nessuna falsa precisione**: senza misura dell'estensione in lamina propria non si calcola alcuna classe ROL o T1m/T1e; senza quota di alto grado non si scrive 100%.
- **Regola del 5%** applicata ai papillari non invasivi (pTa), come nel Blue Book, e per scelta del curatore anche ai papillari con invasione indeterminata (estensione non scritta nella fonte). Nel pT1/pT2 il grado segue il passo 3; se la quota di alto grado è ≥ 5% compare un avviso.
- **Grado nell'invasivo**: ogni carcinoma invasivo va graduato; il basso grado invasivo è raro ma riconosciuto (WHO 2022). Il campo "sottotipo istologico" prevede tutti gli 11 sottotipi del Blue Book, con il loro codice ICD-O nel referto. Se è dichiarato un sottotipo, il grado è sempre alto: "i sottotipi e le differenziazioni divergenti sono tutti considerati di alto grado" (WHO 2022).
- **Papilloma e PUNLMP (WHO 2022)**: il papilloma richiede il pattern di crescita (esofitico 8120/0, invertito 8121/0). La PUNLMP richiede al passo 3 il grado "lieve ingrandimento monotono, senza variazione" e la storia di carcinoma uroteliale: se è presente, la PUNLMP non è applicabile (criterio essenziale) e il verdetto è sospeso. La PUNLMP è pTa.
- **Soglie sul valore inserito**: 5% di alto grado, 0,5 mm e 1,0 mm si confrontano sul numero digitato, senza arrotondamenti.
- **Substaging pT1** riportato in parallelo con i sistemi in uso: micrometrico T1m/T1e (soglia 0,5 mm), ROL (soglia 1,0 mm) e livello rispetto alla muscularis mucosae, in forma descrittiva.

### Persistenza

Si salvano solo l'archivio dei casi (al massimo 12, nel browser) e le preferenze. Il caso in corso non viene salvato: riaprendo la pagina si riparte da zero. Nell'archivio si salvano solo i reperti selezionati, nessun dato del paziente. I casi salvati con la v1 vengono convertiti: una casella non spuntata diventa "non valutato".

### Test

```bash
npm test
```

- `tests/offline.mjs`: nessuna pagina del repo carica risorse esterne.
- `tests/run.mjs`: motore decisionale (estratto da `<script id="uro-engine">`), con almeno un input per ogni classe di esito, le contraddizioni, il referto e la regressione sugli scenari di riferimento e sulle righe della matrice.

## Fonti principali

- WHO Classification of Tumours: Urinary and Male Genital Tumours, 5ª ed. (IARC, 2022), capitoli *Invasive urothelial carcinoma*, *Non-invasive papillary urothelial carcinoma, low-grade* e *high-grade*, *Urothelial papilloma*, *Inverted urothelial papilloma*, *Papillary urothelial neoplasm of low malignant potential*, *Urothelial carcinoma in situ* (consultati da Filippo, novembre 2026).
- Raspollini MR et al. News in the classification of WHO 2022 bladder tumors. Pathologica 2023;115:32-40. doi:10.32074/1591-951X-838
- van Rhijn BWG et al. A new and highly prognostic system to discern T1 bladder cancer substage. Eur Urol 2012;61:378-84. doi:10.1016/j.eururo.2011.10.026
- Fransen van de Putte EE et al. Metric substage according to micro and extensive lamina propria invasion improves prognostics in T1 bladder cancer. Urol Oncol 2018;36:361.e7-361.e13. doi:10.1016/j.urolonc.2018.05.007
- Colombo R et al. Feasibility and clinical roles of different substaging systems at first and second transurethral resection in patients with T1 high-grade bladder cancer. Eur Urol Focus 2018;4:87-93. doi:10.1016/j.euf.2016.06.004
- Valeri M et al. Prospective validation of the ROL system in substaging pT1 high-grade urothelial carcinoma. Cancers 2023;15:934. doi:10.3390/cancers15030934

Le altre fonti sono citate nel piè di pagina della checklist.

## Punti di contenuto ancora da verificare sulla fonte

- Definizione originale di T1m (singolo focus entro un campo a forte ingrandimento?): il motore applica solo la soglia di 0,5 mm. Il Blue Book parla solo di "microscopic vs extensive invasion".
- Iperplasia uroteliale.

Contenuto del curatore, non tratto dal Blue Book: nuclei del CIS "di solito 5–6× un linfocita" (non nel pattern a piccole cellule); p53 aberrante "nella pratica spesso > 70–80% dei nuclei" nel simulatore IHC (il Blue Book dice "diffuse and strong"); distinzione tra displasia e atipia di significato indeterminato in base alla flogosi (il Blue Book riporta che alcuni autori segnalano la mancanza di criteri riproducibili).

Verificati sulla fonte (novembre 2026): UPUMP non più entità autonoma; elenco e nomenclatura dei sottotipi; frase su CK7/CK20/CDX2; regola del 5% e dicitura "basso grado con componente di alto grado < 5%"; codici ICD-O 8130/2 dei papillari non invasivi e 8120/3 dell'invasivo; criteri TPS (N:C ≥ 0,7; il capitolo sull'invasivo scrive "> 0.7", incoerenza interna del Blue Book: si mantiene ≥ 0,7 come nella TPS); papilloma esofitico 8120/0 e invertito 8121/0; PUNLMP 8130/1, stadio pTa, atipia lieve e monotona, criterio essenziale "nessuna storia di carcinoma uroteliale"; CIS 8120/2, pTis, mitosi non necessarie, diffusione pagetoide sufficiente, pattern morfologici senza significato prognostico, IHC non necessaria di routine; displasia poco riproducibile e non graduata ("displasia di basso / alto grado" non raccomandati).
