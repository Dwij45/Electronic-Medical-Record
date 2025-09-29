import api, { fhirApi } from './api';

const diagnosisService = {
  // Fast patient search
  searchPatients: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const mockPatients = [
      {
        id: 'P001',
        name: 'Rajesh Kumar',
        abhaId: '12-3456-7890-1234',
        dateOfBirth: '1980-05-15',
        gender: 'male',
        contactNumber: '+91-9876543210'
      },
      {
        id: 'P002', 
        name: 'Priya Sharma',
        abhaId: '12-3456-7890-5678',
        dateOfBirth: '1985-08-22',
        gender: 'female',
        contactNumber: '+91-9876543211'
      },
      {
        id: 'P003',
        name: 'Amit Patel',
        abhaId: '12-3456-7890-9012',
        dateOfBirth: '1992-03-10',
        gender: 'male',
        contactNumber: '+91-9876543212'
      }
    ];

    return mockPatients.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.abhaId.includes(query)
    );
  },

  // Fast dashboard stats
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      data: {
        totalDiagnoses: 1247,
        todayDiagnoses: 23,
        mappingAccuracy: 92,
        systemHealth: 'excellent',
        alerts: []
      }
    };
  },

  // Fast recent diagnoses
  getRecentDiagnoses: async (limit = 10) => {
    await new Promise(resolve => setTimeout(resolve, 150));
    return {
      data: [
        {
          id: 'D001',
          patientName: 'Rajesh Kumar',
          primaryCode: 'N-AYU-001',
          diagnosis: 'Vata Dosha Imbalance',
          date: new Date().toISOString(),
        },
        {
          id: 'D002',
          patientName: 'Priya Sharma', 
          primaryCode: 'N-SID-012',
          diagnosis: 'Kapha Vitiation',
          date: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'D003',
          patientName: 'Amit Patel',
          primaryCode: 'N-UNA-015',
          diagnosis: 'Pitta Aggravation',
          date: new Date(Date.now() - 172800000).toISOString(),
        }
      ]
    };
  },

  // Fast diagnosis submission
  submitDiagnosis: async (diagnosisBundle) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: 'submission-' + Date.now(),
      status: 'success',
      bundleId: diagnosisBundle.id,
      timestamp: new Date().toISOString(),
    };
  },

  // Other methods with fast responses...
  getDiagnosisHistory: async (patientId, options = {}) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      data: [],
      total: 0
    };
  }
};

export default diagnosisService;