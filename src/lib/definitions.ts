export type EmergencyType = 'Medical' | 'Fire' | 'Police' | 'Traffic' | 'Unknown';

export type Incident = {
  id: string;
  type: EmergencyType;
  location: string;
  timestamp: string;
  transcript: string;
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
