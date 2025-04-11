
// Mock patient data
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  conditions: string[];
  medications: string[];
  allergies: string[];
  lastVisit: string;
  reports: Report[];
  doctorNotes: string;
}

export interface Report {
  id: string;
  type: string;
  date: string;
  result: string;
  details: string;
  critical: boolean;
}

export const mockPatients: Record<string, Patient> = {
  'P001': {
    id: 'P001',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    bloodType: 'A+',
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    medications: ['Lisinopril', 'Metformin'],
    allergies: ['Penicillin'],
    lastVisit: '2023-03-15',
    doctorNotes: 'Patient is responding well to current medications. Blood pressure shows improvement.',
    reports: [
      {
        id: 'R001',
        type: 'Blood Test',
        date: '2023-03-15',
        result: 'Abnormal',
        details: 'High blood sugar (165 mg/dL), elevated cholesterol',
        critical: false
      },
      {
        id: 'R002',
        type: 'ECG',
        date: '2023-03-15',
        result: 'Normal',
        details: 'Regular rhythm, no abnormalities detected',
        critical: false
      }
    ]
  },
  'P002': {
    id: 'P002',
    name: 'Jane Smith',
    age: 32,
    gender: 'Female',
    bloodType: 'O-',
    conditions: ['Asthma'],
    medications: ['Albuterol'],
    allergies: ['Latex', 'Pollen'],
    lastVisit: '2023-04-02',
    doctorNotes: 'Asthma is well-controlled. Recommend continuing current treatment plan.',
    reports: [
      {
        id: 'R003',
        type: 'Lung Function Test',
        date: '2023-04-02',
        result: 'Normal',
        details: 'FEV1: 95% of predicted',
        critical: false
      }
    ]
  },
  'P003': {
    id: 'P003',
    name: 'Robert Johnson',
    age: 68,
    gender: 'Male',
    bloodType: 'B+',
    conditions: ['Coronary Artery Disease', 'Arthritis'],
    medications: ['Atorvastatin', 'Aspirin', 'Naproxen'],
    allergies: [],
    lastVisit: '2023-02-28',
    doctorNotes: 'Chest pain has subsided. Arthritis pain still present in mornings.',
    reports: [
      {
        id: 'R004',
        type: 'Cardiac Stress Test',
        date: '2023-02-28',
        result: 'Abnormal',
        details: 'Ischemic changes at peak exercise',
        critical: true
      },
      {
        id: 'R005',
        type: 'Lipid Panel',
        date: '2023-02-28',
        result: 'Abnormal',
        details: 'LDL: 145 mg/dL (elevated)',
        critical: false
      }
    ]
  }
};

// Mock disease prediction data
export interface SymptomGroup {
  name: string;
  symptoms: string[];
}

export const symptomGroups: SymptomGroup[] = [
  {
    name: 'General',
    symptoms: [
      'Fever',
      'Fatigue',
      'Weakness',
      'Weight loss',
      'Chills',
      'Night sweats'
    ]
  },
  {
    name: 'Respiratory',
    symptoms: [
      'Cough',
      'Shortness of breath',
      'Wheezing',
      'Chest pain',
      'Sputum production',
      'Coughing up blood'
    ]
  },
  {
    name: 'Gastrointestinal',
    symptoms: [
      'Nausea',
      'Vomiting',
      'Diarrhea',
      'Constipation',
      'Abdominal pain',
      'Blood in stool',
      'Bloating'
    ]
  },
  {
    name: 'Neurological',
    symptoms: [
      'Headache',
      'Dizziness',
      'Confusion',
      'Memory problems',
      'Seizures',
      'Tremors',
      'Balance problems'
    ]
  },
  {
    name: 'Cardiac',
    symptoms: [
      'Chest pain',
      'Palpitations',
      'Rapid heartbeat',
      'Irregular heartbeat',
      'Shortness of breath',
      'Swelling in legs'
    ]
  }
];

// Mock disease predictions based on symptom combinations
export const mockPredictions: Record<string, string[]> = {
  'Fever,Cough,Fatigue': ['Common Cold', 'Influenza', 'COVID-19'],
  'Fever,Cough,Shortness of breath': ['Pneumonia', 'COVID-19', 'Bronchitis'],
  'Headache,Nausea,Sensitivity to light': ['Migraine', 'Meningitis', 'Concussion'],
  'Chest pain,Shortness of breath,Fatigue': ['Coronary Artery Disease', 'Heart Failure', 'Pulmonary Embolism'],
  'Abdominal pain,Nausea,Vomiting': ['Gastroenteritis', 'Appendicitis', 'Pancreatitis'],
  'Fever,Joint pain,Rash': ['Lupus', 'Rheumatoid Arthritis', 'Lyme Disease']
};

// Mock video streams for patient monitoring
export const mockMonitoringFeeds = [
  {
    id: 'room101',
    name: 'Room 101 - ICU',
    patientId: 'P001',
    status: 'stable',
    alerts: []
  },
  {
    id: 'room102',
    name: 'Room 102 - ICU',
    patientId: 'P002',
    status: 'stable',
    alerts: []
  },
  {
    id: 'room103',
    name: 'Room 103 - ICU',
    patientId: 'P003',
    status: 'critical',
    alerts: ['Movement detected']
  },
  {
    id: 'hallway1',
    name: 'Hallway East Wing',
    patientId: null,
    status: 'normal',
    alerts: []
  },
  {
    id: 'reception',
    name: 'Reception Area',
    patientId: null,
    status: 'normal',
    alerts: []
  },
  {
    id: 'emergency',
    name: 'Emergency Room',
    patientId: null,
    status: 'normal',
    alerts: []
  }
];
