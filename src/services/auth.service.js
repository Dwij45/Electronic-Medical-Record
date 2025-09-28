// Mock auth service with instant responses
const authService = {
  // Mock login - instant response
  login: async (credentials) => {
    // Simulate network delay (optional, remove for instant)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock validation
    if (credentials.email === 'doctor@hospital.com' && credentials.password === 'password123') {
      return {
        user: {
          id: 'user123',
          name: 'Dr. John Smith',
          email: 'doctor@hospital.com',
          role: 'practitioner',
          department: 'Ayurveda',
        },
        token: 'mock-jwt-token-123456789',
      };
    }
    
    throw new Error('Invalid credentials');
  },

  // Mock ABHA login - instant response  
  loginWithABHA: async (abhaId) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Accept any ABHA ID in correct format
    const abhaRegex = /^\d{2}-\d{4}-\d{4}-\d{4}$/;
    if (abhaRegex.test(abhaId)) {
      return {
        user: {
          id: 'user456',
          name: 'Dr. Priya Sharma',
          email: 'priya.sharma@hospital.com',
          role: 'practitioner',
          department: 'Siddha',
          abhaId: abhaId,
        },
        token: 'mock-abha-token-987654321',
      };
    }

    throw new Error('Invalid ABHA ID format');
  },

  // Mock token validation - instant
  validateToken: async (token) => {
    await new Promise(resolve => setTimeout(resolve, 100));

    if (token === 'mock-jwt-token-123456789') {
      return {
        id: 'user123',
        name: 'Dr. John Smith',
        email: 'doctor@hospital.com',
        role: 'practitioner',
        department: 'Ayurveda',
      };
    }
    
    if (token === 'mock-abha-token-987654321') {
      return {
        id: 'user456',
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@hospital.com',
        role: 'practitioner',
        department: 'Siddha',
        abhaId: '12-3456-7890-1234',
      };
    }

    throw new Error('Invalid token');
  },

  // Instant logout
  logout: () => {
    localStorage.removeItem('authToken');
  },

  // Mock refresh - instant
  refreshToken: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      token: 'mock-refreshed-token-' + Date.now(),
    };
  },

  // Mock profile - instant
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const token = localStorage.getItem('authToken');
    return authService.validateToken(token);
  },
};

export default authService;