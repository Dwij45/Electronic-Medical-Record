// Traditional diseases with Sanskrit-English transliteration - EXPANDED DATABASE
export const traditionalDiseases = [
  // NEUROLOGICAL CONDITIONS
  {
    id: 'T001',
    namasteCode: 'NAM004',
    sanskritName: 'अर्धावभेदक',
    englishName: 'Ardhavabhedaka',
    pronunciation: 'Ardhava-bhedaka',
    modernEquivalent: 'Migraine',
    system: 'ayurveda',
    searchTerms: [
      'अर्धावभेदक', 'shiroroga', 'shirog', 'shirorog', 'अर्धशीशी',
      'headache', 'migraine', 'head pain', 'half head pain'
    ],
    icd11Code: '8A80',
    icd11TM2Code: 'TM2.A01.2',
    category: 'शिरोगत रोग',
    doshaInvolved: ['वात', 'पित्त'],
    symptoms: ['तीव्र शिरोवेदना', 'उल्टी', 'प्रकाशभीति', 'शब्दभीति'],
    treatments: ['नस्य चिकित्सा', 'शिरोधारा', 'अक्षि तर्पण']
  },
  {
    id: 'T002',
    namasteCode: 'NAM012',
    sanskritName: 'शिरःकम्प',
    englishName: 'Shirahkampa',
    pronunciation: 'Shirah-kampa',
    modernEquivalent: 'Essential Tremor',
    system: 'ayurveda',
    searchTerms: [
      'शिरःकम्प', 'shirahkampa', 'shirakampa', 'head tremor',
      'tremor', 'shaking', 'कम्प', 'kampa'
    ],
    icd11Code: '8A00.1',
    icd11TM2Code: 'TM2.A02.1',
    category: 'वात व्याधि',
    doshaInvolved: ['वात'],
    symptoms: ['शिर कम्पन', 'हस्त कम्पन', 'वाक् कम्पन'],
    treatments: ['वात शामक चिकित्सा', 'अभ्यंग', 'स्वेदन']
  },

  // ENDOCRINE CONDITIONS
  {
    id: 'T003',
    namasteCode: 'NAM001',
    sanskritName: 'मधुमेह',
    englishName: 'Madhumeha',
    pronunciation: 'Madhu-meha',
    modernEquivalent: 'Type 2 Diabetes Mellitus',
    system: 'ayurveda',
    searchTerms: [
      'मधुमेह', 'madhumeha', 'madhumerh', 'madhumeh', 'प्रमेह',
      'diabetes', 'sugar', 'blood sugar', 'sweet urine'
    ],
    icd11Code: '5A11',
    icd11TM2Code: 'TM2.E01.1',
    category: 'प्रमेह रोग',
    doshaInvolved: ['कफ', 'वात'],
    symptoms: ['प्रभूत मूत्र', 'तृष्णा', 'दुर्बलता', 'क्षुधाधिक्य'],
    treatments: ['पञ्चकर्म', 'आहार नियंत्रण', 'व्यायाम', 'औषधि सेवन']
  },
  {
    id: 'T004',
    namasteCode: 'NAM025',
    sanskritName: 'मेदोरोग',
    englishName: 'Medoroga',
    pronunciation: 'Medo-roga',
    modernEquivalent: 'Obesity',
    system: 'ayurveda',
    searchTerms: [
      'मेदोरोग', 'medoroga', 'medo-roga', 'स्थौल्य', 'sthaulya',
      'obesity', 'overweight', 'fat', 'weight gain'
    ],
    icd11Code: '5B81',
    icd11TM2Code: 'TM2.E02.1',
    category: 'मेद विकार',
    doshaInvolved: ['कफ', 'मेद'],
    symptoms: ['अत्युच्छ्रिति', 'श्वास कष्ट', 'स्वेदाधिक्य', 'आलस्य'],
    treatments: ['लेखन चिकित्सा', 'व्यायाम', 'उद्वर्तन', 'रूक्ष आहार']
  },

  // RESPIRATORY CONDITIONS
  {
    id: 'T005',
    namasteCode: 'NAM008',
    sanskritName: 'कास',
    englishName: 'Kasa',
    pronunciation: 'Ka-sa',
    modernEquivalent: 'Chronic Cough',
    system: 'ayurveda',
    searchTerms: [
      'कास', 'kasa', 'kas', 'kaas', 'खांसी', 'khansi',
      'cough', 'bronchitis', 'respiratory'
    ],
    icd11Code: 'R05',
    icd11TM2Code: 'TM2.R01.2',
    category: 'श्वसन रोग',
    doshaInvolved: ['कफ', 'वात'],
    symptoms: ['निरंतर खांसी', 'कफ निस्सारण', 'श्वास कष्ट'],
    treatments: ['वासावलेह', 'सितोपलादि चूर्ण', 'तुलसी क्वाथ']
  },
  {
    id: 'T006',
    namasteCode: 'NAM009',
    sanskritName: 'श्वास',
    englishName: 'Shvasa',
    pronunciation: 'Shva-sa',
    modernEquivalent: 'Bronchial Asthma',
    system: 'ayurveda',
    searchTerms: [
      'श्वास', 'shvasa', 'shvaas', 'अस्थमा', 'asthma',
      'breathing difficulty', 'wheezing', 'breathlessness'
    ],
    icd11Code: 'CA23',
    icd11TM2Code: 'TM2.R02.1',
    category: 'प्राण वह स्रोतस्',
    doshaInvolved: ['प्राण वायु', 'कफ'],
    symptoms: ['श्वास कष्ट', 'घुर्घुर शब्द', 'छाती में जकड़न'],
    treatments: ['श्वासकुठार रस', 'शृंग भस्म', 'प्राणायाम']
  },
  {
    id: 'T007',
    namasteCode: 'NAM026',
    sanskritName: 'हिक्का',
    englishName: 'Hikka',
    pronunciation: 'Hik-ka',
    modernEquivalent: 'Chronic Hiccups',
    system: 'ayurveda',
    searchTerms: [
      'हिक्का', 'hikka', 'hichki', 'hiccup', 'hiccups'
    ],
    icd11Code: 'R06.6',
    icd11TM2Code: 'TM2.R03.1',
    category: 'उदान वायु विकार',
    doshaInvolved: ['उदान वायु'],
    symptoms: ['निरंतर हिचकी', 'श्वास में बाधा', 'वक्ष पीड़ा'],
    treatments: ['हिक्कानिग्रहण योग', 'लवणादि योग', 'धूमपान']
  },

  // DIGESTIVE CONDITIONS
  {
    id: 'T008',
    namasteCode: 'NAM007',
    sanskritName: 'अग्निमांद्य',
    englishName: 'Agnimandya',
    pronunciation: 'Agni-mandya',
    modernEquivalent: 'Functional Dyspepsia',
    system: 'ayurveda',
    searchTerms: [
      'अग्निमांद्य', 'agnimandya', 'agnimandh', 'अजीर्ण', 'ajirna',
      'indigestion', 'digestive weakness', 'dyspepsia', 'weak digestion'
    ],
    icd11Code: 'DD90',
    icd11TM2Code: 'TM2.G01.3',
    category: 'अग्नि विकार',
    doshaInvolved: ['कफ', 'वात'],
    symptoms: ['अपचन', 'मंदाग्नि', 'गुरुता', 'उदरशूल'],
    treatments: ['दीपन', 'पाचन', 'त्रिकटु', 'हिंग्वाष्टक चूर्ण']
  },
  {
    id: 'T009',
    namasteCode: 'NAM005',
    sanskritName: 'अम्लपित्त',
    englishName: 'Amlapitta',
    pronunciation: 'Amla-pitta',
    modernEquivalent: 'Gastroesophageal Reflux Disease',
    system: 'ayurveda',
    searchTerms: [
      'अम्लपित्त', 'amlapitta', 'amlpitt', 'अम्लता', 'amlata',
      'acidity', 'heartburn', 'acid reflux', 'GERD'
    ],
    icd11Code: 'DA22',
    icd11TM2Code: 'TM2.G01.1',
    category: 'पित्त विकार',
    doshaInvolved: ['पित्त'],
    symptoms: ['अम्ल उद्गार', 'हृत्पीड़ा', 'छाती में जलन', 'खट्टी डकार'],
    treatments: ['शीतल औषधि', 'आमलकी रसायन', 'शीतल आहार', 'सुतशेखर रस']
  },
  {
    id: 'T010',
    namasteCode: 'NAM027',
    sanskritName: 'आध्मान',
    englishName: 'Adhman',
    pronunciation: 'Adh-man',
    modernEquivalent: 'Abdominal Bloating',
    system: 'ayurveda',
    searchTerms: [
      'आध्मान', 'adhman', 'adhaman', 'पेट फूलना', 'pet foolna',
      'bloating', 'gas', 'flatulence', 'abdominal distension'
    ],
    icd11Code: 'MD40.2',
    icd11TM2Code: 'TM2.G02.1',
    category: 'वायु विकार',
    doshaInvolved: ['अपान वायु'],
    symptoms: ['उदर वृद्धि', 'वायु संचय', 'पेट में भारीपन'],
    treatments: ['वायुगुल्म हर योग', 'हिंग्वाष्टक चूर्ण', 'अजमोदादि चूर्ण']
  },

  // CARDIOVASCULAR CONDITIONS
  {
    id: 'T011',
    namasteCode: 'NAM013',
    sanskritName: 'हृद्रोग',
    englishName: 'Hridroga',
    pronunciation: 'Hrid-roga',
    modernEquivalent: 'Heart Disease',
    system: 'ayurveda',
    searchTerms: [
      'हृद्रोग', 'hridroga', 'hrid-roga', 'हृदय रोग', 'hridaya roga',
      'heart disease', 'cardiac', 'heart problem'
    ],
    icd11Code: 'BD10',
    icd11TM2Code: 'TM2.C01.1',
    category: 'हृदय विकार',
    doshaInvolved: ['वात', 'कफ'],
    symptoms: ['हृत्पीड़ा', 'श्वास कष्ट', 'घबराहट', 'छाती में दर्द'],
    treatments: ['अर्जुनारिष्ट', 'हृदयार्णव रस', 'सर्पगंधा', 'ब्राह्मी']
  },
  {
    id: 'T012',
    namasteCode: 'NAM028',
    sanskritName: 'रक्तचाप वृद्धि',
    englishName: 'Raktachapa Vriddhi',
    pronunciation: 'Rakta-chapa Vriddhi',
    modernEquivalent: 'Hypertension',
    system: 'ayurveda',
    searchTerms: [
      'रक्तचाप वृद्धि', 'raktachapa vriddhi', 'high bp', 'उच्च रक्तचाप',
      'hypertension', 'high blood pressure', 'BP'
    ],
    icd11Code: 'BA00',
    icd11TM2Code: 'TM2.C02.1',
    category: 'रक्त विकार',
    doshaInvolved: ['पित्त', 'वात'],
    symptoms: ['सिर दर्द', 'चक्कर आना', 'हृत्स्पंदन वृद्धि'],
    treatments: ['सर्पगंधा', 'जटामांसी', 'शंखपुष्पी', 'ब्राह्मी']
  },

  // MUSCULOSKELETAL CONDITIONS  
  {
    id: 'T013',
    namasteCode: 'NAM014',
    sanskritName: 'आमवात',
    englishName: 'Amavata',
    pronunciation: 'Ama-vata',
    modernEquivalent: 'Rheumatoid Arthritis',
    system: 'ayurveda',
    searchTerms: [
      'आमवात', 'amavata', 'ama-vata', 'जोड़ों का दर्द', 'jodon ka dard',
      'arthritis', 'joint pain', 'rheumatoid', 'गठिया', 'gathiya'
    ],
    icd11Code: 'FA20',
    icd11TM2Code: 'TM2.M01.1',
    category: 'संधि रोग',
    doshaInvolved: ['आम', 'वात'],
    symptoms: ['संधि शोथ', 'संधि शूल', 'जकड़न', 'बुखार'],
    treatments: ['गुग्गुलु योग', 'एरंड तेल', 'रसना सप्तक क्वाथ']
  },
  {
    id: 'T014',
    namasteCode: 'NAM029',
    sanskritName: 'कटिशूल',
    englishName: 'Katishula',
    pronunciation: 'Kati-shula',
    modernEquivalent: 'Lower Back Pain',
    system: 'ayurveda',
    searchTerms: [
      'कटिशूल', 'katishula', 'kati-shula', 'कमर दर्द', 'kamar dard',
      'back pain', 'lower back pain', 'lumber pain'
    ],
    icd11Code: 'ME84.2',
    icd11TM2Code: 'TM2.M02.1',
    category: 'मर्म रोग',
    doshaInvolved: ['वात'],
    symptoms: ['कटि प्रदेश में शूल', 'जकड़न', 'चलने में कष्ट'],
    treatments: ['कटि बस्ति', 'महानारायण तेल', 'दशमूल क्वाथ']
  },

  // SKIN CONDITIONS
  {
    id: 'T015',
    namasteCode: 'NAM015',
    sanskritName: 'कुष्ठ',
    englishName: 'Kushtha',
    pronunciation: 'Kushtha',
    modernEquivalent: 'Chronic Skin Disease',
    system: 'ayurveda',
    searchTerms: [
      'कुष्ठ', 'kushtha', 'kushth', 'चर्म रोग', 'charm roga',
      'skin disease', 'eczema', 'dermatitis'
    ],
    icd11Code: 'EA85',
    icd11TM2Code: 'TM2.D01.1',
    category: 'त्वचा रोग',
    doshaInvolved: ['पित्त', 'कफ', 'वात'],
    symptoms: ['त्वचा में खुजली', 'लाली', 'पपड़ी', 'दाग धब्बे'],
    treatments: ['नीम', 'करञ्ज', 'खदिर', 'आरग्वध']
  },

  // MENTAL HEALTH CONDITIONS
  {
    id: 'T016',
    namasteCode: 'NAM016',
    sanskritName: 'उन्माद',
    englishName: 'Unmada',
    pronunciation: 'Un-mada',
    modernEquivalent: 'Psychotic Disorder',
    system: 'ayurveda',
    searchTerms: [
      'उन्माद', 'unmada', 'un-mada', 'पागलपन', 'pagalpan',
      'psychosis', 'mental disorder', 'madness'
    ],
    icd11Code: '6A20',
    icd11TM2Code: 'TM2.P01.1',
    category: 'मानसिक रोग',
    doshaInvolved: ['राजस', 'तामस'],
    symptoms: ['मानसिक अस्थिरता', 'भ्रम', 'आक्रामकता'],
    treatments: ['सत्वावजय चिकित्सा', 'मेधा रसायन', 'योग']
  },

  // WOMEN'S HEALTH
  {
    id: 'T017',
    namasteCode: 'NAM017',
    sanskritName: 'योनिरोग',
    englishName: 'Yoniroga',
    pronunciation: 'Yoni-roga',
    modernEquivalent: 'Gynecological Disorders',
    system: 'ayurveda',
    searchTerms: [
      'योनिरोग', 'yoniroga', 'yoni-roga', 'स्त्री रोग', 'stri roga',
      'gynecological', 'women health', 'female disorders'
    ],
    icd11Code: 'GC00',
    icd11TM2Code: 'TM2.G03.1',
    category: 'स्त्री रोग',
    doshaInvolved: ['कफ', 'पित्त'],
    symptoms: ['योनि स्राव', 'खुजली', 'जलन', 'दुर्गंध'],
    treatments: ['त्रिफला क्वाथ', 'नीम', 'अशोक', 'लोध्र']
  },

  // SIDDHA SYSTEM DISEASES
  {
    id: 'T018',
    namasteCode: 'NAM018',
    sanskritName: 'वातम्',
    englishName: 'Vatham',
    pronunciation: 'Va-tham',
    modernEquivalent: 'Neurological Disorders',
    system: 'siddha',
    searchTerms: [
      'वातम्', 'vatham', 'vaatham', 'vatha',
      'neurological', 'nerve disorder', 'paralysis'
    ],
    icd11Code: '8A00',
    icd11TM2Code: 'TM2.S01.1',
    category: 'वात नाड़ी',
    doshaInvolved: ['वातम्'],
    symptoms: ['नाड़ी दुर्बलता', 'कंपन', 'लकवा'],
    treatments: ['वात केशरी रस', 'महानारायण तेल', 'अश्वगंधा']
  },
  {
    id: 'T019',
    namasteCode: 'NAM019',
    sanskritName: 'पित्तम्',
    englishName: 'Pittham',
    pronunciation: 'Pit-tham',
    modernEquivalent: 'Metabolic Disorders',
    system: 'siddha',
    searchTerms: [
      'पित्तम्', 'pittham', 'piththam', 'pitha',
      'metabolic', 'liver disorder', 'bile disorder'
    ],
    icd11Code: '5A10',
    icd11TM2Code: 'TM2.S02.1',
    category: 'पित्त विकार',
    doshaInvolved: ['पित्तम्'],
    symptoms: ['यकृत वृद्धि', 'पीलिया', 'जलन', 'गर्मी'],
    treatments: ['कामदुधा रस', 'कुमारी आसव', 'भूमि आमलकी']
  },

  // UNANI SYSTEM DISEASES  
  {
    id: 'T020',
    namasteCode: 'NAM020',
    sanskritName: 'सुदा',
    englishName: 'Suda',
    pronunciation: 'Su-da',
    modernEquivalent: 'Chronic Headache',
    system: 'unani',
    searchTerms: [
      'सुदा', 'suda', 'सिरदर्द', 'siradard',
      'headache', 'chronic headache', 'head pain'
    ],
    icd11Code: '8A84',
    icd11TM2Code: 'TM2.U01.1',
    category: 'सर के रोग',
    doshaInvolved: ['सफ्रा', 'बलगम'],
    symptoms: ['सिर में दर्द', 'भारीपन', 'चक्कर'],
    treatments: ['सफूफ सुदर', 'रोगन बनफशा', 'हब्ब आस']
  }
];

export const ayushSystems = [
  { 
    id: 'ayurveda', 
    name: 'आयुर्वेद (Ayurveda)', 
    script: 'devanagari',
    description: 'Ancient Indian system of medicine based on tridosha theory'
  },
  { 
    id: 'siddha', 
    name: 'சித்தா (Siddha)', 
    script: 'tamil',
    description: 'Traditional Tamil system of medicine'
  },
  { 
    id: 'unani', 
    name: 'یونانی (Unani)', 
    script: 'urdu',
    description: 'Greco-Arabic system of medicine'
  },
  {
    id: 'yoga',
    name: 'योग (Yoga)',
    script: 'devanagari', 
    description: 'Mind-body practice for health and wellness'
  },
  {
    id: 'naturopathy',
    name: 'Naturopathy',
    script: 'latin',
    description: 'Natural healing system'
  },
  {
    id: 'homeopathy', 
    name: 'Homeopathy',
    script: 'latin',
    description: 'Like cures like principle'
  }
];

// Dosha information
export const doshaTypes = [
  {
    sanskrit: 'वात',
    english: 'Vata',
    transliteration: ['vata', 'vat', 'vaata'],
    elements: ['आकाश', 'वायु'],
    elementsEnglish: ['Space', 'Air'],
    qualities: ['रूक्ष', 'शीत', 'लघु', 'चल'],
    qualitiesEnglish: ['Dry', 'Cold', 'Light', 'Mobile'],
    functions: ['Movement', 'Circulation', 'Nervous system']
  },
  {
    sanskrit: 'पित्त',
    english: 'Pitta',
    transliteration: ['pitta', 'pitt', 'pittaa'],
    elements: ['तेज', 'जल'],
    elementsEnglish: ['Fire', 'Water'],
    qualities: ['उष्ण', 'तेक्ष्ण', 'द्रव', 'अम्ल'],
    qualitiesEnglish: ['Hot', 'Sharp', 'Liquid', 'Acidic'],
    functions: ['Digestion', 'Metabolism', 'Transformation']
  },
  {
    sanskrit: 'कफ',
    english: 'Kapha',
    transliteration: ['kapha', 'kaph', 'kaphaa'],
    elements: ['पृथ्वी', 'जल'],
    elementsEnglish: ['Earth', 'Water'],
    qualities: ['गुरु', 'शीत', 'मृदु', 'स्निग्ध'],
    qualitiesEnglish: ['Heavy', 'Cold', 'Soft', 'Unctuous'],
    functions: ['Structure', 'Immunity', 'Lubrication']
  }
];

// System-wise color themes
export const systemColors = {
  ayurveda: {
    primary: '#8B4513',
    secondary: '#DEB887', 
    accent: '#F4A460'
  },
  siddha: {
    primary: '#DC143C',
    secondary: '#FFB6C1',
    accent: '#FA8072'
  },
  unani: {
    primary: '#006400',
    secondary: '#90EE90',
    accent: '#32CD32'
  },
  yoga: {
    primary: '#8A2BE2',
    secondary: '#DDA0DD',
    accent: '#BA55D3'
  },
  naturopathy: {
    primary: '#228B22',
    secondary: '#98FB98',
    accent: '#00FF7F'
  },
  homeopathy: {
    primary: '#4169E1',
    secondary: '#87CEEB',
    accent: '#6495ED'
  }
};