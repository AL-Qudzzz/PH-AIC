
export type EmergencyType = 'Medical' | 'Fire' | 'Police' | 'Traffic' | 'Unknown' | 'Accident' | 'Robbery' | 'Gas Leak';

export type Incident = {
  id: string;
  type: EmergencyType;
  location: string;
  timestamp: string;
  transcript: string;
  speech?: string; // Add this to match the mock data
  summary: {
    whatHappened: string;
    whereItHappened: string;
  };
  classification: {
    emergencyType: string;
    confidenceScore: number;
  };
};

export type Cluster = {
  location: string;
  reports: Incident[];
};
