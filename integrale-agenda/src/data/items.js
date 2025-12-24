export const items = [
  // --- BESTAANDE ITEMS (GEÜPDATET MET NIEUWE AMBTELIJKE VELDEN) ---
  { 
    id: 1, 
    title: "Archiefverordening 2025", 
    ph: "D.S. Schoonman", 
    colleaguePH: "",
    on: "S. van den Barselaar", 
    headOfDept: "J. vd. Geer", 
    dir: "M. Werges", 
    strategicLabel: "Beleid", 
    toelichting: "21/10 aangemeld als hamerstuk. Start in PO Organisatie.", 
    comments: "21/10 aangemeld als hamerstuk.",
    // Archiefverordening gaat via PO Organisatie (POO) -> DT -> PFO
    schedule: { POO: "13-11-2025", DT: "18-11-2025", PFO: "25-11-2025", DBBesluit: "02-12-2025", ABBrief: "03-02-2026" },
    scheduleStatus: { POO: "Afgerond", DT: "Afgerond", PFO: "Afgerond", DBBesluit: "Geagendeerd", ABBrief: "Concept" }
  },
  { 
    id: 2, 
    title: "Het Algemeen Bestuur in positie: bestuurlijk ambtelijk samenspel DB", 
    ph: "D.S. Schoonman", 
    on: "A. Wullink", 
    headOfDept: "J. vd. Geer", 
    dir: "I. Geveke", 
    strategicLabel: "Organisatiegesteldheid", 
    toelichting: "Sessie over samenwerking en rollen.",
    comments: "",
    schedule: { DT: "16-12-2025", DBInformeel: "06-01-2026" },
    scheduleStatus: { DT: "Concept", DBInformeel: "Concept" }
  },
  { 
    id: 3, 
    title: "Projectvoorstel verkiezingen", 
    ph: "D.S. Schoonman", 
    on: "M. van Rossum", 
    headOfDept: "J. vd. Geer", 
    dir: "I. Geveke", 
    strategicLabel: "Organisatiegesteldheid", 
    // Via POO en DT
    schedule: { POO: "11-12-2025", DT: "16-12-2025", PFO: "06-01-2026", DBBesluit: "13-01-2026" },
    scheduleStatus: { POO: "Concept", DT: "Concept", PFO: "Ingediend", DBBesluit: "Concept" }
  },
  { 
    id: 4, 
    title: "Periodieke sessie over integriteit", 
    ph: "D.S. Schoonman", 
    on: "M. van Rossum", 
    headOfDept: "P. Schoonen", 
    dir: "I. Geveke", 
    strategicLabel: "Organisatiegesteldheid", 
    schedule: { DT: "13-01-2026", Delta: "20-01-2026" },
    scheduleStatus: { DT: "Concept", Delta: "Concept" }
  },
  { 
    id: 5, 
    title: "Analysefase en koersbepaling compleet WBP", 
    ph: "D.S. Schoonman", 
    colleaguePH: "H.J. Pereboom",
    on: "H. Pouwels", 
    headOfDept: "J. vd. Geer", 
    dir: "M. Boersen", 
    strategicLabel: "Kaders", 
    toelichting: "Besluit analyse fase en koers vaststellen. Via PO Water.",
    comments: "besluit analyse fase en koers vaststellen",
    // WBP gaat via PO Water (POW)
    schedule: { POW: "06-01-2026", DT: "13-01-2026", PFO: "20-01-2026", DBBesluit: "27-01-2026" },
    scheduleStatus: { POW: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept" }
  },
  { 
    id: 6, 
    title: "Heroriëntatie van rollen en taken van de auditcommissie", 
    ph: "D.S. Schoonman", 
    on: "V. Jansen", 
    headOfDept: "P. Schoonen", 
    dir: "I. Geveke", 
    strategicLabel: "Organisatiegesteldheid", 
    toelichting: "Opdrachtnemer is Berenschot.",
    comments: "Opdrachtnemer is Berenschot",
    schedule: { POO: "22-01-2026", DT: "27-01-2026", PFO: "03-02-2026", DBBesluit: "10-02-2026", Delta: "03-03-2026" },
    scheduleStatus: { POO: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept", Delta: "Concept" }
  },
  { 
    id: 7, 
    title: "WBP: voorbereiding mbt Informeel DB én de Deltabijeenkomst", 
    ph: "D.S. Schoonman", 
    on: "H. Pouwels", 
    headOfDept: "J. vd. Geer", 
    dir: "M. Boersen", 
    strategicLabel: "Kaders", 
    toelichting: "PFO op 02 / 03 februari.",
    schedule: { POW: "20-01-2026", DT: "27-01-2026", PFO: "03-02-2026", Delta: "17-03-2026" },
    scheduleStatus: { POW: "Concept", DT: "Concept", PFO: "Concept", Delta: "Concept" }
  },
  { 
    id: 8, 
    title: "Concept Waterbeheerprogramma 2028-2033 (WBP)", 
    ph: "D.S. Schoonman", 
    colleaguePH: "N. Koks",
    on: "H. Pouwels", 
    headOfDept: "J. vd. Geer", 
    dir: "M. Boersen", 
    strategicLabel: "Kaders", 
    toelichting: "Besluitvorming DB en ter informatie AB.",
    schedule: { POW: "31-03-2026", DT: "07-04-2026", PFO: "21-04-2026", DBBesluit: "05-05-2026", ABBrief: "26-05-2026" },
    scheduleStatus: { POW: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept", ABBrief: "Concept" }
  },
  { 
    id: 11, 
    title: "Planuitwerkings- en realisatiekrediet vismigratie fase 2", 
    ph: "H.J. Pereboom", 
    on: "M. Hammink", 
    headOfDept: "R. Wierda", 
    dir: "M. Boersen", 
    strategicLabel: "Uitvoering", 
    toelichting: "Check bij Mira voor planning?",
    // Via PO Water
    schedule: { POW: "11-11-2025", DT: "18-11-2025", PFO: "25-11-2025", DBBesluit: "02-12-2025", ABBrief: "03-02-2026" },
    scheduleStatus: { POW: "Afgerond", DT: "Afgerond", PFO: "Afgerond", DBBesluit: "Afgerond", ABBrief: "Ingediend" }
  },
  { 
    id: 12, 
    title: "Tarieven derden 2026", 
    ph: "H.J. Pereboom", 
    on: "A. de Haan", 
    headOfDept: "F. Kroes", 
    dir: "M. Werges", 
    strategicLabel: "Uitvoering", 
    toelichting: "Deelnemer sluit digitaal aan.",
    // Financiën gaat vaak via PO Organisatie
    schedule: { POO: "11-12-2025", DT: "16-12-2025", PFO: "06-01-2026", DBBesluit: "13-01-2026" },
    scheduleStatus: { POO: "Afgerond", DT: "Afgerond", PFO: "Ingediend", DBBesluit: "Concept" }
  },
  { 
    id: 13, 
    title: "Specials Gemalen Voorbereidingskrediet", 
    ph: "H.J. Pereboom", 
    on: "E. Wiggers", 
    headOfDept: "R. Wierda", 
    dir: "M. Boersen", 
    strategicLabel: "Uitvoering", 
    schedule: { POW: "06-01-2026", DT: "13-01-2026", PFO: "20-01-2026", DBBesluit: "27-01-2026" },
    scheduleStatus: { POW: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept" }
  },
  { 
    id: 14, 
    title: "Voortgangsrapportage Grondzaken 2025", 
    ph: "H.J. Pereboom", 
    on: "I. van Lohuizen", 
    headOfDept: "F. Kroes", 
    dir: "M. Werges", 
    strategicLabel: "P&C", 
    schedule: { POO: "08-01-2026", DT: "13-01-2026", PFO: "20-01-2026", DBBesluit: "27-01-2026", ABBrief: "03-02-2026" },
    scheduleStatus: { POO: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept", ABBrief: "Concept" }
  },
  { 
    id: 15, 
    title: "Besluitvormingstraject overdracht stedelijk water Drentse gemeenten", 
    ph: "H.J. Pereboom", 
    on: "J.A. van Berkum", 
    headOfDept: "R. Wierda", 
    dir: "M. Boersen", 
    strategicLabel: "Uitvoering", 
    toelichting: "Uitwijk PFO is 10/03/26.",
    schedule: { POW: "03-02-2026", DT: "10-02-2026", PFO: "17-02-2026", DBBesluit: "17-03-2026", Delta: "14-04-2026" },
    scheduleStatus: { POW: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept", Delta: "Concept" }
  },
  { 
    id: 20, 
    title: "Brief van DB aan AB over svz in het landelijk gebied na het wegvallen van NPLG", 
    ph: "F. Stienstra", 
    colleaguePH: "M. Wesselink",
    on: "L. Verweij, A. Durand", 
    headOfDept: "J. vd. Geer", 
    dir: "M. Boersen", 
    strategicLabel: "Externe ontwikkelingen", 
    toelichting: "Miranda in de lead, Folkert meenemen. Doorgeschoven.",
    schedule: { POW: "25-11-2025", DT: "02-12-2025", PFO: "08-12-2025", DBBesluit: "16-12-2025", ABBrief: "03-02-2026" },
    scheduleStatus: { POW: "Afgerond", DT: "Afgerond", PFO: "Afgerond", DBBesluit: "Ingediend", ABBrief: "Concept" }
  },
  { 
    id: 22, 
    title: "VKA besluit voor de KRW- nevengeul Vechterweerd", 
    ph: "F. Stienstra", 
    colleaguePH: "J.C.G. Wijnen",
    on: "E. van Zundert", 
    headOfDept: "M. Nicolai", 
    dir: "M. Boersen", 
    strategicLabel: "Uitvoering", 
    schedule: { POW: "06-01-2026", DT: "13-01-2026", PFO: "20-01-2026", DBBesluit: "27-01-2026" },
    scheduleStatus: { POW: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept" }
  },
  { 
    id: 23, 
    title: "Zoetwatervoorziening Oost Nederland fase 3 (2028-2033)", 
    ph: "N. Koks", 
    on: "B. Hendriks", 
    headOfDept: "J. vd. Geer", 
    dir: "M. Boersen", 
    strategicLabel: "Uitvoering", 
    toelichting: "40 minuten is voldoende.",
    schedule: { DT: "13-01-2026", DBInformeel: "20-01-2026" },
    scheduleStatus: { DT: "Concept", DBInformeel: "Concept" }
  },
  { 
    id: 24, 
    title: "Resultaten beleidsanalyse Water en Bodem Sturend", 
    ph: "N. Koks", 
    on: "F. Fokkema, B. Hendriks", 
    headOfDept: "J. vd. Geer", 
    dir: "M. Boersen", 
    strategicLabel: "Evaluatie", 
    toelichting: "Geagendeerd ter informeren DB.",
    schedule: { POW: "20-01-2026", DT: "27-01-2026", PFO: "02-02-2026", DBBesluit: "10-02-2026" },
    scheduleStatus: { POW: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept" }
  },
  { 
    id: 25, 
    title: "Dedemsvaart KRW samenwerking provincie Overijssel", 
    ph: "N. Koks", 
    on: "M. Hammink", 
    headOfDept: "M. Nicolai", 
    dir: "M. Boersen", 
    strategicLabel: "Uitvoering", 
    schedule: { POW: "20-01-2026", DT: "27-01-2026", PFO: "02-02-2026", DBBesluit: "10-02-2026", Delta: "03-03-2026" },
    scheduleStatus: { POW: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept", Delta: "Concept" }
  },
  { 
    id: 27, 
    title: "PR WS Wapserveense AA Projectbesluit en vrijgave realisatiekrediet", 
    ph: "N. Koks", 
    on: "M. Hammink", 
    headOfDept: "M. Nicolai", 
    dir: "M. Boersen", 
    strategicLabel: "Uitvoering", 
    toelichting: "Vervolg op PFO 25/11. Projectbesluit door DB, krediet door AB.",
    schedule: { POW: "10-03-2026", DT: "17-03-2026", PFO: "24-03-2026", DBBesluit: "14-04-2026", Delta: "05-05-2026" },
    scheduleStatus: { POW: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept", Delta: "Concept" }
  },
  { 
    id: 32, 
    title: "Actualisatie uitwerkingskader Ontwerpuitgangspunten Primaire Keringen", 
    ph: "J.C.G. Wijnen", 
    on: "E. Wijma", 
    headOfDept: "C. Beekmans", 
    dir: "M. Boersen", 
    strategicLabel: "Beleid", 
    toelichting: "Na overleg met PFH op 14 november volgt meer info over datum.",
    schedule: { POW: "09-12-2025", DT: "16-12-2025", PFO: "06-01-2026", DBBesluit: "13-01-2026" },
    scheduleStatus: { POW: "Afgerond", DT: "Afgerond", PFO: "Ingediend", DBBesluit: "Concept" }
  },
  { 
    id: 33, 
    title: "VKA HWBP Mastenbroek-IJssel", 
    ph: "J.C.G. Wijnen", 
    on: "M. Krol", 
    headOfDept: "C. Beekmans", 
    dir: "M. Boersen", 
    strategicLabel: "Uitvoering", 
    schedule: { DT: "27-01-2026", Delta: "10-02-2026" },
    scheduleStatus: { DT: "Concept", Delta: "Concept" }
  },
  { 
    id: 34, 
    title: "HWBP Mastenbroek-Ijssel; besluit VKA", 
    ph: "J.C.G. Wijnen", 
    on: "M. Krol", 
    headOfDept: "C. Beekmans", 
    dir: "M. Boersen", 
    strategicLabel: "Uitvoering", 
    toelichting: "Deadlines zijn krap, 05 maart is er een BBG.",
    schedule: { POW: "24-02-2026", DT: "03-03-2026", PFO: "10-03-2026", DBBesluit: "17-03-2026", Delta: "14-04-2026", ABBesluit: "28-04-2026" },
    scheduleStatus: { POW: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept", Delta: "Concept", ABBesluit: "Concept" }
  },
  { 
    id: 35, 
    title: "HWBP/PR Sterkte Onverzadigde Zone (Kredietbesluit)", 
    ph: "J.C.G. Wijnen", 
    on: "V. Frankena", 
    headOfDept: "C. Beekmans", 
    dir: "M. Boersen", 
    strategicLabel: "Uitvoering", 
    schedule: { POW: "28-04-2026", DT: "05-05-2026", PFO: "11-05-2026", DBBesluit: "19-05-2026", ABBesluit: "30-06-2026" },
    scheduleStatus: { POW: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept", ABBesluit: "Concept" }
  },
  { 
    id: 37, 
    title: "Optimalisatie sliblijn WDODelta", 
    ph: "M. Wesselink", 
    on: "M. Kuiper", 
    headOfDept: "J. Vlot", 
    dir: "M. Boersen", 
    strategicLabel: "Uitvoering", 
    toelichting: "Vervolg op 01/04 en 27/10.",
    schedule: { POW: "11-11-2025", DT: "18-11-2025", PFO: "24-11-2025", DBBesluit: "02-12-2025", ABBrief: "03-02-2026" },
    scheduleStatus: { POW: "Afgerond", DT: "Afgerond", PFO: "Afgerond", DBBesluit: "Afgerond", ABBrief: "Concept" }
  },
  { 
    id: 38, 
    title: "Strategie Digitale Transformatie", 
    ph: "M. Wesselink", 
    on: "H. Boschman", 
    headOfDept: "M. Werges", 
    dir: "M. Werges", 
    strategicLabel: "Beleid", 
    // IT gaat via PO Organisatie
    schedule: { POO: "11-12-2025", DT: "16-12-2025", DBInformeel: "06-01-2026" },
    scheduleStatus: { POO: "Afgerond", DT: "Afgerond", DBInformeel: "Ingediend" }
  },
  { 
    id: 40, 
    title: "Discrepantie 2024 (RWZI)", 
    ph: "M. Wesselink", 
    on: "M. Toren", 
    headOfDept: "J. Vlot", 
    dir: "M. Werges", 
    strategicLabel: "Uitvoering", 
    toelichting: "DB Voorstel en brief AB.",
    schedule: { POW: "09-12-2025", DT: "16-12-2025", PFO: "06-01-2026", DBBesluit: "13-01-2026", ABBrief: "03-02-2026" },
    scheduleStatus: { POW: "Afgerond", DT: "Afgerond", PFO: "Ingediend", DBBesluit: "Concept", ABBrief: "Concept" }
  },
  { 
    id: 41, 
    title: "2e behandeling Uitbreiding waterlijn rwzi Echten", 
    ph: "M. Wesselink", 
    on: "R. Oldhoff", 
    headOfDept: "J. Vlot", 
    dir: "M. Boersen", 
    strategicLabel: "Uitvoering", 
    schedule: { POW: "09-12-2025", DT: "16-12-2025", PFO: "06-01-2026", DBBesluit: "13-01-2026", Delta: "03-03-2026" },
    scheduleStatus: { POW: "Afgerond", DT: "Afgerond", PFO: "Ingediend", DBBesluit: "Concept", Delta: "Concept" }
  },
  // NIEUW ITEM OM P&C TE TESTEN IN VROEG 2026
  { 
    id: 42, 
    title: "Voorjaarsnota 2026: Eerste schets", 
    ph: "D.S. Schoonman", 
    on: "M. de Vries", 
    headOfDept: "J. vd. Geer", 
    dir: "M. Werges", 
    strategicLabel: "P&C", 
    schedule: { POO: "22-01-2026", DT: "27-01-2026", PFO: "02-02-2026", DBBesluit: "10-02-2026" },
    scheduleStatus: { POO: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept" }
  },

  // --- ITEMS 2026-2028 (MET DUMMY AMBTELIJKE VOORBEREIDING) ---
  
  // 2026 Q3/Q4
  {
    id: 101,
    title: "Tussentijdse rapportage Kaderrichtlijn Water (KRW)",
    ph: "F. Stienstra",
    on: "K. van der Meer",
    headOfDept: "R. Wierda", 
    dir: "M. Boersen", 
    strategicLabel: "Kaders",
    toelichting: "Voortgangsrapportage voor Brussel.",
    schedule: { POW: "18-08-2026", DT: "25-08-2026", PFO: "07-09-2026", DBBesluit: "15-09-2026", Delta: "06-10-2026" },
    scheduleStatus: { POW: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept", Delta: "Concept" }
  },
  {
    id: 102,
    title: "Vervanging Automatisering Gemalen Cluster Noord",
    ph: "H.J. Pereboom",
    on: "T. Bakker",
    headOfDept: "R. Wierda",
    dir: "M. Boersen",
    strategicLabel: "Uitvoering",
    toelichting: "Aanbestedingsresultaat en gunning.",
    schedule: { POW: "07-09-2026", DT: "14-09-2026", PFO: "21-09-2026", DBBesluit: "29-09-2026" },
    scheduleStatus: { POW: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept" }
  },
  {
    id: 103,
    title: "Visie Recreatie en Medegebruik 2027+",
    ph: "F. Stienstra",
    colleaguePH: "D.S. Schoonman",
    on: "J. Willems",
    headOfDept: "J. vd. Geer",
    dir: "I. Geveke",
    strategicLabel: "Beleid",
    toelichting: "Eerste verkenning met stakeholders.",
    schedule: { DT: "06-10-2026", DBInformeel: "20-10-2026" },
    scheduleStatus: { DT: "Concept", DBInformeel: "Concept" }
  },
  {
    id: 104,
    title: "Begroting 2027: Kaderbrief",
    ph: "D.S. Schoonman",
    on: "M. de Vries, P. Jansen",
    headOfDept: "J. vd. Geer",
    dir: "M. Werges",
    strategicLabel: "P&C",
    toelichting: "Start van de begrotingscyclus 2027.",
    schedule: { POO: "15-10-2026", DT: "20-10-2026", PFO: "02-11-2026", DBBesluit: "10-11-2026", ABBesluit: "24-11-2026" },
    scheduleStatus: { POO: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept", ABBesluit: "Concept" }
  },
  {
    id: 105,
    title: "Renovatie RWZI Dalfsen - Voorlopig Ontwerp",
    ph: "M. Wesselink",
    on: "S. Timmer",
    headOfDept: "J. Vlot", 
    dir: "M. Boersen",
    strategicLabel: "Uitvoering",
    schedule: { POW: "02-11-2026", DT: "10-11-2026", PFO: "16-11-2026", DBBesluit: "24-11-2026" },
    scheduleStatus: { POW: "Concept", DT: "Concept", PFO: "Concept", DBBesluit: "Concept" }
  },

  // 2027 (Beperkt gevuld voor overzicht)
  {
    id: 201,
    title: "Participatiebeleid Evaluatie 2024-2026",
    ph: "F. Stienstra",
    on: "L. Groen",
    headOfDept: "P. Schoonen",
    dir: "I. Geveke",
    strategicLabel: "Evaluatie",
    toelichting: "Wat ging goed in de gebiedsprocessen?",
    schedule: { DT: "15-12-2026", DBInformeel: "12-01-2027" },
    scheduleStatus: { DT: "Concept", DBInformeel: "Concept" }
  },
  // ... rest van 2027/2028 items hebben hier geen extra updates nodig voor de demo
];