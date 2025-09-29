// / services/fhir.service.js
import { fhirApi } from './api';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const fhirService = {
  // Create FHIR Patient resource
  createPatient: (patientData) => ({
    resourceType: 'Patient',
    id: patientData.id || uuidv4(),
    identifier: [
      {
        use: 'official',
        system: 'https://healthid.ndhm.gov.in',
        value: patientData.abhaId,
      },
    ],
    name: [
      {
        use: 'official',
        family: patientData.name.split(' ').pop(),
        given: patientData.name.split(' ').slice(0, -1),
      },
    ],
    gender: patientData.gender?.toLowerCase(),
    birthDate: patientData.dateOfBirth ? format(new Date(patientData.dateOfBirth), 'yyyy-MM-dd') : undefined,
    telecom: patientData.contactNumber ? [
      {
        system: 'phone',
        value: patientData.contactNumber,
        use: 'mobile',
      },
    ] : [],
  }),

  // Create FHIR Encounter resource
  createEncounter: (encounterData, patientId, practitionerId) => ({
    resourceType: 'Encounter',
    id: uuidv4(),
    status: 'finished',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: encounterData.type === 'outpatient' ? 'AMB' : 'IMP',
      display: encounterData.type === 'outpatient' ? 'ambulatory' : 'inpatient encounter',
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    participant: [
      {
        individual: {
          reference: `Practitioner/${practitionerId}`,
        },
      },
    ],
    period: {
      start: format(new Date(encounterData.date), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    },
    location: encounterData.location ? [
      {
        location: {
          display: encounterData.location,
        },
      },
    ] : [],
  }),

  // Create FHIR Condition (Problem List) resource
  createCondition: (diagnosisData, patientId, encounterId) => {
    const conditions = diagnosisData.codes.map(code => ({
      resourceType: 'Condition',
      id: uuidv4(),
      clinicalStatus: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
            code: diagnosisData.status || 'active',
            display: diagnosisData.status || 'Active',
          },
        ],
      },
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-category',
              code: 'encounter-diagnosis',
              display: 'Encounter Diagnosis',
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: getSystemUri(code.system),
            code: code.code,
            display: code.display,
          },
        ],
        text: code.display,
      },
      subject: {
        reference: `Patient/${patientId}`,
      },
      encounter: {
        reference: `Encounter/${encounterId}`,
      },
      onsetDateTime: diagnosisData.onset ? format(new Date(diagnosisData.onset), "yyyy-MM-dd'T'HH:mm:ssXXX") : undefined,
      recordedDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
      note: diagnosisData.notes ? [
        {
          text: diagnosisData.notes,
        },
      ] : [],
      severity: diagnosisData.severity ? {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: getSeverityCode(diagnosisData.severity),
            display: diagnosisData.severity,
          },
        ],
      } : undefined,
    }));

    return conditions;
  },

  // Create FHIR Consent resource
  createConsent: (consentData, patientId) => ({
    resourceType: 'Consent',
    id: uuidv4(),
    status: 'active',
    scope: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/consentscope',
          code: 'patient-privacy',
          display: 'Privacy Consent',
        },
      ],
    },
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/consentcategorycodes',
            code: 'idscl',
            display: 'Information Disclosure',
          },
        ],
      },
    ],
    patient: {
      reference: `Patient/${patientId}`,
    },
    dateTime: format(new Date(consentData.consentDate), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    policyRule: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'OPTOUT',
          display: 'opt-out',
        },
      ],
    },
    provision: {
      type: 'permit',
      purpose: [
        ...(consentData.dataSharing ? [{
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActReason',
          code: 'TREAT',
          display: 'treatment',
        }] : []),
        ...(consentData.research ? [{
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActReason',
          code: 'HRESCH',
          display: 'healthcare research',
        }] : []),
        ...(consentData.analytics ? [{
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActReason',
          code: 'PUBHLTH',
          display: 'public health',
        }] : []),
      ],
    },
  }),

  // Create FHIR Observation resource for vital signs
  createVitalSignsObservations: (vitalSignsData, patientId, encounterId) => {
    const observations = [];
    const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX");

    // Blood Pressure
    if (vitalSignsData.bloodPressureSystolic && vitalSignsData.bloodPressureDiastolic) {
      observations.push({
        resourceType: 'Observation',
        id: uuidv4(),
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'vital-signs',
            display: 'Vital Signs',
          }],
        }],
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '85354-9',
            display: 'Blood pressure panel with all children optional',
          }],
        },
        subject: { reference: `Patient/${patientId}` },
        encounter: { reference: `Encounter/${encounterId}` },
        effectiveDateTime: timestamp,
        component: [
          {
            code: {
              coding: [{
                system: 'http://loinc.org',
                code: '8480-6',
                display: 'Systolic blood pressure',
              }],
            },
            valueQuantity: {
              value: parseFloat(vitalSignsData.bloodPressureSystolic),
              unit: 'mmHg',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [{
                system: 'http://loinc.org',
                code: '8462-4',
                display: 'Diastolic blood pressure',
              }],
            },
            valueQuantity: {
              value: parseFloat(vitalSignsData.bloodPressureDiastolic),
              unit: 'mmHg',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
      });
    }

    // Heart Rate
    if (vitalSignsData.heartRate) {
      observations.push({
        resourceType: 'Observation',
        id: uuidv4(),
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'vital-signs',
            display: 'Vital Signs',
          }],
        }],
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '8867-4',
            display: 'Heart rate',
          }],
        },
        subject: { reference: `Patient/${patientId}` },
        encounter: { reference: `Encounter/${encounterId}` },
        effectiveDateTime: timestamp,
        valueQuantity: {
          value: parseFloat(vitalSignsData.heartRate),
          unit: 'beats/min',
          system: 'http://unitsofmeasure.org',
          code: '/min',
        },
      });
    }

    // Body Temperature
    if (vitalSignsData.temperature) {
      observations.push({
        resourceType: 'Observation',
        id: uuidv4(),
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'vital-signs',
            display: 'Vital Signs',
          }],
        }],
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '8310-5',
            display: 'Body temperature',
          }],
        },
        subject: { reference: `Patient/${patientId}` },
        encounter: { reference: `Encounter/${encounterId}` },
        effectiveDateTime: timestamp,
        valueQuantity: {
          value: parseFloat(vitalSignsData.temperature),
          unit: 'degF',
          system: 'http://unitsofmeasure.org',
          code: '[degF]',
        },
      });
    }

    // Respiratory Rate
    if (vitalSignsData.respiratoryRate) {
      observations.push({
        resourceType: 'Observation',
        id: uuidv4(),
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'vital-signs',
            display: 'Vital Signs',
          }],
        }],
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '9279-1',
            display: 'Respiratory rate',
          }],
        },
        subject: { reference: `Patient/${patientId}` },
        encounter: { reference: `Encounter/${encounterId}` },
        effectiveDateTime: timestamp,
        valueQuantity: {
          value: parseFloat(vitalSignsData.respiratoryRate),
          unit: 'breaths/min',
          system: 'http://unitsofmeasure.org',
          code: '/min',
        },
      });
    }

    // Oxygen Saturation
    if (vitalSignsData.oxygenSaturation) {
      observations.push({
        resourceType: 'Observation',
        id: uuidv4(),
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'vital-signs',
            display: 'Vital Signs',
          }],
        }],
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '2708-6',
            display: 'Oxygen saturation in Arterial blood',
          }],
        },
        subject: { reference: `Patient/${patientId}` },
        encounter: { reference: `Encounter/${encounterId}` },
        effectiveDateTime: timestamp,
        valueQuantity: {
          value: parseFloat(vitalSignsData.oxygenSaturation),
          unit: '%',
          system: 'http://unitsofmeasure.org',
          code: '%',
        },
      });
    }

    return observations;
  },

  // Create FHIR Bundle
  createDiagnosisBundle: async (data) => {
    const { patient, encounter, diagnosis, consent, vitalSigns, practitioner } = data;

    const patientId = patient.id || uuidv4();
    const encounterId = uuidv4();
    const practitionerId = practitioner.id || uuidv4();

    const bundleId = uuidv4();
    const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX");

    // Create resources
    const patientResource = fhirService.createPatient({ ...patient, id: patientId });
    const encounterResource = fhirService.createEncounter(encounter, patientId, practitionerId);
    const conditionResources = fhirService.createCondition(diagnosis, patientId, encounterId);
    const consentResource = fhirService.createConsent(consent, patientId);
    const vitalSignsObservations = vitalSigns ? fhirService.createVitalSignsObservations(vitalSigns, patientId, encounterId) : [];

    // Create bundle entries
    const entries = [
      {
        fullUrl: `Patient/${patientId}`,
        resource: patientResource,
        request: {
          method: 'PUT',
          url: `Patient/${patientId}`,
        },
      },
      {
        fullUrl: `Encounter/${encounterId}`,
        resource: encounterResource,
        request: {
          method: 'POST',
          url: 'Encounter',
        },
      },
      ...conditionResources.map(condition => ({
        fullUrl: `Condition/${condition.id}`,
        resource: condition,
        request: {
          method: 'POST',
          url: 'Condition',
        },
      })),
      ...vitalSignsObservations.map(observation => ({
        fullUrl: `Observation/${observation.id}`,
        resource: observation,
        request: {
          method: 'POST',
          url: 'Observation',
        },
      })),
      {
        fullUrl: `Consent/${consentResource.id}`,
        resource: consentResource,
        request: {
          method: 'POST',
          url: 'Consent',
        },
      },
    ];

    const bundle = {
      resourceType: 'Bundle',
      id: bundleId,
      meta: {
        lastUpdated: timestamp,
        profile: [
          'http://hl7.org/fhir/StructureDefinition/Bundle',
        ],
      },
      identifier: {
        system: 'https://healthcare-emr.gov.in/bundle-identifier',
        value: bundleId,
      },
      type: 'transaction',
      timestamp,
      entry: entries,
    };

    return bundle;
  },

  // Submit FHIR Bundle
  submitBundle: async (bundle) => {
    try {
      const response = await fhirApi.post('/', bundle);
      return response.data;
    } catch (error) {
      console.error('FHIR Bundle submission error:', error);
      throw new Error('Failed to submit FHIR bundle');
    }
  },

  // Validate FHIR Bundle
  validateBundle: async (bundle) => {
    try {
      const response = await fhirApi.post('/$validate', bundle);
      return response.data;
    } catch (error) {
      console.error('FHIR validation error:', error);
      throw new Error('FHIR bundle validation failed');
    }
  },

  // Get patient data
  getPatient: async (patientId) => {
    try {
      const response = await fhirApi.get(`/Patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Get patient error:', error);
      throw new Error('Failed to fetch patient data');
    }
  },

  // Search conditions for patient
  searchConditions: async (patientId, options = {}) => {
    try {
      const params = new URLSearchParams({
        patient: patientId,
        ...options.category && { category: options.category },
        ...options.clinicalStatus && { 'clinical-status': options.clinicalStatus },
        ...options.count && { _count: options.count },
      });

      const response = await fhirApi.get(`/Condition?${params}`);
      return response.data;
    } catch (error) {
      console.error('Search conditions error:', error);
      throw new Error('Failed to search conditions');
    }
  },
};

// Helper functions
const getSystemUri = (system) => {
  const systemUris = {
    'NAMASTE': 'https://terminology.healthcare.gov.in/CodeSystem/namaste',
    'ICD-11-TM2': 'https://icd.who.int/browse11/l-m/en/tm2',
    'ICD-11-BIOMEDICINE': 'https://icd.who.int/browse11/l-m/en',
  };
  return systemUris[system] || system;
};

const getSeverityCode = (severity) => {
  const severityCodes = {
    'mild': '255604002',
    'moderate': '6736007',
    'severe': '24484000',
  };
  return severityCodes[severity] || '6736007';
};

export default fhirService;