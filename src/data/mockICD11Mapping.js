export const codingMappings = [
  {
    namasteCode: 'NAM004',
    icd11Biomedicine: {
      code: '8A80',
      display: 'Migraine',
      system: 'http://id.who.int/icd/release/11/mms',
      definition: 'Recurrent headache disorder characterized by moderate to severe headaches'
    },
    icd11TM2: {
      code: 'TM2.A01.2', 
      display: 'Traditional migraine pattern',
      system: 'http://id.who.int/icd/release/11/tm2',
      definition: 'Traditional medicine perspective on migraine-type headaches'
    },
    whoInternationalTerminology: {
      code: 'WHO-AY-NEU-001',
      display: 'Ardhavabhedaka (Half-sided head pain)',
      system: 'http://who.int/classifications/ayurveda'
    },
    equivalence: 'equivalent',
    confidence: 0.95,
    mappingSource: 'WHO-NAMASTE Collaboration',
    lastUpdated: '2024-01-15'
  },
  {
    namasteCode: 'NAM001',
    icd11Biomedicine: {
      code: '5A11',
      display: 'Type 2 Diabetes Mellitus',
      system: 'http://id.who.int/icd/release/11/mms',
      definition: 'Metabolic disorder characterized by high blood glucose levels'
    },
    icd11TM2: {
      code: 'TM2.E01.1',
      display: 'Traditional diabetes pattern',
      system: 'http://id.who.int/icd/release/11/tm2',
      definition: 'Traditional medicine approach to diabetes-like conditions'
    },
    whoInternationalTerminology: {
      code: 'WHO-AY-END-001',
      display: 'Madhumeha (Honey-like urine disease)',
      system: 'http://who.int/classifications/ayurveda'
    },
    equivalence: 'equivalent',
    confidence: 0.98,
    mappingSource: 'WHO-NAMASTE Collaboration',
    lastUpdated: '2024-01-15'
  },
  {
    namasteCode: 'NAM007',
    icd11Biomedicine: {
      code: 'DD90',
      display: 'Functional Dyspepsia',
      system: 'http://id.who.int/icd/release/11/mms',
      definition: 'Chronic or recurring pain in upper abdomen'
    },
    icd11TM2: {
      code: 'TM2.G01.3',
      display: 'Traditional digestive fire weakness',
      system: 'http://id.who.int/icd/release/11/tm2',
      definition: 'Traditional medicine concept of weak digestive fire'
    },
    whoInternationalTerminology: {
      code: 'WHO-AY-GAS-001',
      display: 'Agnimandya (Weak digestive fire)',
      system: 'http://who.int/classifications/ayurveda'
    },
    equivalence: 'broader',
    confidence: 0.88,
    mappingSource: 'WHO-NAMASTE Collaboration',
    lastUpdated: '2024-01-15'
  },
  {
    namasteCode: 'NAM005',
    icd11Biomedicine: {
      code: 'DA22',
      display: 'Gastroesophageal Reflux Disease',
      system: 'http://id.who.int/icd/release/11/mms',
      definition: 'Chronic condition where stomach acid flows back into esophagus'
    },
    icd11TM2: {
      code: 'TM2.G01.1',
      display: 'Traditional acid-pitta disorder',
      system: 'http://id.who.int/icd/release/11/tm2',
      definition: 'Traditional medicine understanding of acid-related digestive disorders'
    },
    whoInternationalTerminology: {
      code: 'WHO-AY-GAS-002',
      display: 'Amlapitta (Acid-pitta disorder)',
      system: 'http://who.int/classifications/ayurveda'
    },
    equivalence: 'equivalent',
    confidence: 0.92,
    mappingSource: 'WHO-NAMASTE Collaboration',
    lastUpdated: '2024-01-15'
  },
  {
    namasteCode: 'NAM008',
    icd11Biomedicine: {
      code: 'R05',
      display: 'Cough',
      system: 'http://id.who.int/icd/release/11/mms',
      definition: 'Sudden, forceful hacking sound to release air and clear irritation'
    },
    icd11TM2: {
      code: 'TM2.R01.2',
      display: 'Traditional cough pattern',
      system: 'http://id.who.int/icd/release/11/tm2',
      definition: 'Traditional medicine classification of cough patterns'
    },
    whoInternationalTerminology: {
      code: 'WHO-AY-RES-001',
      display: 'Kasa (Cough)',
      system: 'http://who.int/classifications/ayurveda'
    },
    equivalence: 'equivalent',
    confidence: 0.94,
    mappingSource: 'WHO-NAMASTE Collaboration',
    lastUpdated: '2024-01-15'
  }
];

export const fhirCodeSystems = {
  namaste: {
    url: 'http://namaste.gov.in/fhir/CodeSystem/ayush-disorders',
    name: 'NAMASTE AYUSH Disorders',
    version: '2024.1',
    status: 'active'
  },
  icd11Biomedicine: {
    url: 'http://id.who.int/icd/release/11/mms',
    name: 'ICD-11 for Mortality and Morbidity Statistics',
    version: '2023',
    status: 'active'
  },
  icd11TM2: {
    url: 'http://id.who.int/icd/release/11/tm2',
    name: 'ICD-11 Traditional Medicine Module 2',
    version: '2023',
    status: 'active'
  },
  whoAyurveda: {
    url: 'http://who.int/classifications/ayurveda',
    name: 'WHO Standardised International Terminologies for Ayurveda',
    version: '2024',
    status: 'active'
  }
};