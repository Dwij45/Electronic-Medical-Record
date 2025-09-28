import api from './api';

const terminologyService = {
  // Fast mock autocomplete
  autocomplete: async (query, options = {}) => {
    // Simulate fast search
    await new Promise(resolve => setTimeout(resolve, 200));

    if (!query || query.length < 2) return [];

    // Mock results based on query
    const mockResults = [
      {
        system: 'NAMASTE',
        code: 'N-AYU-001',
        display: 'Vata Dosha Imbalance',
        definition: 'Imbalance in Vata dosha causing digestive issues',
      },
      {
        system: 'NAMASTE', 
        code: 'N-SID-012',
        display: 'Kapha Vitiation',
        definition: 'Excess Kapha causing respiratory problems',
      },
      {
        system: 'ICD-11-TM2',
        code: 'TM20.01',
        display: 'Qi Stagnation',
        definition: 'Blockage of vital energy flow',
      },
      {
        system: 'ICD-11-BIOMEDICINE',
        code: 'K25.9',
        display: 'Gastric Ulcer, unspecified',
        definition: 'Ulcer in stomach lining',
      },
    ];

    // Filter results based on query
    return mockResults.filter(result => 
      result.display.toLowerCase().includes(query.toLowerCase()) ||
      result.code.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Fast mock translation
  translate: async (code, fromSystem, toSystem) => {
    await new Promise(resolve => setTimeout(resolve, 150));

    const mockMappings = {
      'N-AYU-001': { 
        target: { 
          system: 'ICD-11-TM2', 
          code: 'TM20.01', 
          display: 'Qi Stagnation' 
        },
        confidence: 0.89
      },
    };

    return mockMappings[code] || null;
  },

  // Fast mock mapping
  getMapping: async (conceptId) => {
    await new Promise(resolve => setTimeout(resolve, 100));

    const mockMappings = {
      'N-AYU-001': {
        target: {
          system: 'ICD-11-TM2',
          code: 'TM20.01', 
          display: 'Qi Stagnation'
        },
        confidence: 0.89,
        type: 'equivalent'
      },
    };

    return mockMappings[conceptId] || null;
  },

  // Instant sync
  syncCodeSystems: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { 
      status: 'success', 
      synced: ['NAMASTE', 'ICD-11-TM2', 'ICD-11-BIOMEDICINE'],
      timestamp: new Date().toISOString()
    };
  },

  // Fast code system info
  getCodeSystem: async (systemId) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      id: systemId,
      name: systemId,
      version: '2023.1',
      status: 'active',
      lastUpdated: new Date().toISOString(),
    };
  },

  // Fast search
  searchCodeSystem: async (systemId, query, limit = 20) => {
    await new Promise(resolve => setTimeout(resolve, 150));
    return terminologyService.autocomplete(query, { systems: [systemId], limit });
  },

  // Fast sync status
  getSyncStatus: async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return {
      data: {
        lastSync: new Date(Date.now() - 300000).toISOString(), // 5 mins ago
        status: 'synced',
        nextSync: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      }
    };
  }
};

export default terminologyService;