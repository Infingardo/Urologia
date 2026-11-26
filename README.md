# Urologia

Strumenti di uropatologia per uso didattico e di supporto alla refertazione. Ogni strumento è una pagina HTML autonoma che funziona offline: si apre direttamente nel browser, senza server, senza librerie e senza risorse esterne.

## Strumenti

| Cartella | Strumento |
|---|---|
| [`urotelio/`](urotelio/index.html) | Checklist delle proliferazioni e neoplasie uroteliali (WHO 2022, 5ª ed.) |

## Checklist urotelio

Checklist in cinque passi (architettura; spessore e polarità; grado citonucleare con soglia del 5% di alto grado nei papillari non invasivi; membrana basale e invasione con substaging pT1; elementi di referto), con matrice comparativa delle entità, trappole morfologiche, simulatore del pannello CK20/p53/CD44 e correlazione con The Paris System.

L'esito è un **orientamento morfologico**: non sostituisce la diagnosi, che resta del patologo.

### Come ragiona

- **Tre stati per ogni reperto**: non valutato, assente, presente. Un campo vuoto non equivale ad "assente".
- **Nessun verdetto su dati incompleti**: servono architettura, polarità, grado e stato della membrana basale; nei papillari di basso grado serve la quota di alto grado (anche 0%); nelle lesioni piatte con atipia lieve serve lo stato della flogosi.
- **Nessun verdetto su dati contraddittori**: le combinazioni incoerenti (per esempio architettura infiltrante con membrana basale integra, invasione con citologia normale o reattiva, pT2 senza muscolare propria nel campione) sospendono il verdetto e vengono elencate.
- **Nessun campo ne modifica un altro di nascosto.**
- **Nessuna falsa precisione**: senza misura dell'estensione in lamina propria non si calcola alcuna classe ROL o T1m/T1e; senza quota di alto grado non si scrive 100%.
- **Regola del 5%** applicata solo ai papillari non invasivi (pTa). Nel pT1 il grado segue il passo 3; se la quota di alto grado è ≥ 5% compare un avviso.
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

- WHO Classification of Tumours: Urinary and Male Genital Tumours, 5ª ed. (IARC, 2022).
- van Rhijn BWG et al. A new and highly prognostic system to discern T1 bladder cancer substage. Eur Urol 2012;61:378-84. doi:10.1016/j.eururo.2011.10.026
- Fransen van de Putte EE et al. Metric substage according to micro and extensive lamina propria invasion improves prognostics in T1 bladder cancer. Urol Oncol 2018;36:361.e7-361.e13. doi:10.1016/j.urolonc.2018.05.007
- Colombo R et al. Feasibility and clinical roles of different substaging systems at first and second transurethral resection in patients with T1 high-grade bladder cancer. Eur Urol Focus 2018;4:87-93. doi:10.1016/j.euf.2016.06.004
- Valeri M et al. Prospective validation of the ROL system in substaging pT1 high-grade urothelial carcinoma. Cancers 2023;15:934. doi:10.3390/cancers15030934

Le altre fonti sono citate nel piè di pagina della checklist.

## Punti di contenuto ancora da verificare sulla fonte

- Codice ICD-O del papilloma invertito (la matrice usa 8120/0 per entrambe le forme di papilloma).
- Affermazione "UPUMP abolita" nella WHO 2022.
- Elenco e nomenclatura dei sottotipi WHO 2022.
- Definizione originale di T1m (singolo focus entro un campo a forte ingrandimento?): il motore applica solo la soglia di 0,5 mm.
- Frase sul pannello CK7/CK20/CDX2 nella sezione IHC.
