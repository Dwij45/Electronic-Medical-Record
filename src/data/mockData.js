export const mockPatients = [
  {
    id: 'PAT001',
    name: 'John Doe',
    abhaId: 'ABHA001234567890',
    dateOfBirth: new Date('1985-05-15'),
    gender: 'Male',
    contactNumber: '+91-9876543210',
    address: '123 Main St, Mumbai, MH 400001',
    bloodGroup: 'B+',
    allergies: ['Penicillin', 'Peanuts'],
    emergencyContact: '+91-9876543200',
    medicalHistory: [
      {
        id: 'MH001',
        date: new Date('2024-01-15'),
        diagnosis: 'Type 2 Diabetes Mellitus',
        doctor: 'Dr. Sarah Wilson',
        hospital: 'City General Hospital',
        prescription: ['Metformin 500mg BD', 'Lifestyle modifications'],
        status: 'Active',
        followUp: new Date('2024-04-15')
      },
      {
        id: 'MH002',
        date: new Date('2023-11-20'),
        diagnosis: 'Essential Hypertension',
        doctor: 'Dr. Michael Chen',
        hospital: 'Metro Medical Center',
        prescription: ['Amlodipine 5mg OD', 'Low sodium diet'],
        status: 'Controlled',
        followUp: new Date('2024-02-20')
      },
      {
        id: 'MH003',
        date: new Date('2023-08-10'),
        diagnosis: 'Acute Upper Respiratory Infection',
        doctor: 'Dr. Priya Sharma',
        hospital: 'Community Health Clinic',
        prescription: ['Azithromycin 500mg OD x 3 days', 'Rest and fluids'],
        status: 'Resolved',
        followUp: null
      }
    ],
    vitalsHistory: [
      {
        date: new Date('2024-08-01'),
        temperature: '98.6°F',
        bloodPressure: '140/90',
        heartRate: '78 bpm',
        weight: '75 kg',
        bmi: '24.2'
      },
      {
        date: new Date('2024-01-15'),
        temperature: '98.4°F',
        bloodPressure: '145/95',
        heartRate: '82 bpm',
        weight: '76 kg',
        bmi: '24.5'
      }
    ],
    labResults: [
      {
        date: new Date('2024-07-20'),
        test: 'HbA1c',
        result: '7.2%',
        reference: '< 7.0%',
        status: 'Elevated'
      },
      {
        date: new Date('2024-07-20'),
        test: 'Fasting Glucose',
        result: '135 mg/dL',
        reference: '70-100 mg/dL',
        status: 'High'
      }
    ]
  },
  {
    id: 'PAT002',
    name: 'Jane Smith',
    abhaId: 'ABHA002345678901',
    dateOfBirth: new Date('1990-08-22'),
    gender: 'Female',
    contactNumber: '+91-9876543211',
    address: '456 Oak Ave, Delhi, DL 110001',
    bloodGroup: 'A+',
    allergies: ['Shellfish'],
    emergencyContact: '+91-9876543201',
    medicalHistory: [
      {
        id: 'MH004',
        date: new Date('2024-05-10'),
        diagnosis: 'Migraine',
        doctor: 'Dr. Rajesh Kumar',
        hospital: 'Neuro Care Hospital',
        prescription: ['Sumatriptan 50mg PRN', 'Propranolol 40mg BD'],
        status: 'Active',
        followUp: new Date('2024-08-10')
      },
      {
        id: 'MH005',
        date: new Date('2023-12-05'),
        diagnosis: 'Iron Deficiency Anemia',
        doctor: 'Dr. Lisa Johnson',
        hospital: 'Women\'s Health Center',
        prescription: ['Iron supplements', 'Vitamin C'],
        status: 'Resolved',
        followUp: null
      }
    ],
    vitalsHistory: [
      {
        date: new Date('2024-05-10'),
        temperature: '98.2°F',
        bloodPressure: '115/75',
        heartRate: '68 bpm',
        weight: '58 kg',
        bmi: '21.8'
      }
    ],
    labResults: [
      {
        date: new Date('2024-05-01'),
        test: 'Hemoglobin',
        result: '12.5 g/dL',
        reference: '12.0-15.5 g/dL',
        status: 'Normal'
      }
    ]
  },
  {
    id: 'PAT003',
    name: 'Ram Kumar',
    abhaId: 'ABHA003456789012',
    dateOfBirth: new Date('1975-12-10'),
    gender: 'Male',
    contactNumber: '+91-9876543212',
    address: '789 Pine Rd, Bangalore, KA 560001',
    bloodGroup: 'O+',
    allergies: [],
    emergencyContact: '+91-9876543202',
    medicalHistory: [
      {
        id: 'MH006',
        date: new Date('2024-03-15'),
        diagnosis: 'Gastroesophageal Reflux Disease',
        doctor: 'Dr. Amit Patel',
        hospital: 'Digestive Care Institute',
        prescription: ['Omeprazole 20mg BD', 'Dietary modifications'],
        status: 'Active',
        followUp: new Date('2024-06-15')
      }
    ],
    vitalsHistory: [
      {
        date: new Date('2024-03-15'),
        temperature: '98.8°F',
        bloodPressure: '128/82',
        heartRate: '72 bpm',
        weight: '80 kg',
        bmi: '26.1'
      }
    ],
    labResults: [
      {
        date: new Date('2024-03-10'),
        test: 'Lipid Profile',
        result: 'Total Cholesterol: 220 mg/dL',
        reference: '< 200 mg/dL',
        status: 'Borderline High'
      }
    ]
  }
];

export const mockDiseases = [
  {
    id: 'DIAG001',
    name: 'Type 2 Diabetes Mellitus',
    icd11Code: '5A11',
    icd11T2Code: '5A11.0',
    namasteCode: 'NAM001',
    description: 'A metabolic disorder characterized by high blood glucose levels due to insulin resistance',
    category: 'Endocrine',
    severity: ['Mild', 'Moderate', 'Severe'],
    commonSymptoms: ['Increased thirst', 'Frequent urination', 'Fatigue', 'Blurred vision']
  },
  {
    id: 'DIAG002',
    name: 'Essential Hypertension',
    icd11Code: 'BA00',
    icd11T2Code: 'BA00.0',
    namasteCode: 'NAM002',
    description: 'High blood pressure with no identifiable underlying cause',
    category: 'Cardiovascular',
    severity: ['Stage 1', 'Stage 2', 'Severe'],
    commonSymptoms: ['Headache', 'Dizziness', 'Chest pain', 'Shortness of breath']
  },
  {
    id: 'DIAG003',
    name: 'Acute Upper Respiratory Infection',
    icd11Code: 'CA07',
    icd11T2Code: 'CA07.1',
    namasteCode: 'NAM003',
    description: 'Infection affecting the upper respiratory tract including nose, throat, and sinuses',
    category: 'Respiratory',
    severity: ['Mild', 'Moderate', 'Severe'],
    commonSymptoms: ['Cough', 'Sore throat', 'Runny nose', 'Fever']
  },
  {
    id: 'DIAG004',
    name: 'Migraine',
    icd11Code: '8A80',
    icd11T2Code: '8A80.0',
    namasteCode: 'NAM004',
    description: 'Recurrent headache disorder characterized by moderate to severe headaches',
    category: 'Neurological',
    severity: ['Mild', 'Moderate', 'Severe'],
    commonSymptoms: ['Throbbing headache', 'Nausea', 'Light sensitivity', 'Sound sensitivity']
  },
  {
    id: 'DIAG005',
    name: 'Gastroesophageal Reflux Disease',
    icd11Code: 'DA22',
    icd11T2Code: 'DA22.0',
    namasteCode: 'NAM005',
    description: 'Chronic condition where stomach acid flows back into the esophagus',
    category: 'Gastrointestinal',
    severity: ['Mild', 'Moderate', 'Severe'],
    commonSymptoms: ['Heartburn', 'Regurgitation', 'Chest pain', 'Difficulty swallowing']
  }
];