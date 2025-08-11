
import { Incident } from './definitions';

export const mockIncidents: Incident[] = [
  {
    id: '12345',
    type: 'Fire',
    location: 'Jalan Sudirman & Thamrin',
    latitude: -6.1944,
    longitude: 106.8229,
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    transcript: 'Operator: 112, ada yang bisa dibantu? Pelapor: Tolong, ada kebakaran di gedung tinggi dekat Bundaran HI.',
    speech: "There's a fire at the i...",
    summary: {
      whatHappened: 'Kebakaran di gedung tinggi dekat Bundaran HI.',
      whereItHappened: 'Jalan Sudirman & Thamrin',
    },
    classification: {
      emergencyType: 'Fire',
      confidenceScore: 0.98,
    },
  },
  {
    id: '12346',
    type: 'Accident',
    location: 'Jalan Gatot Subroto',
    latitude: -6.2244,
    longitude: 106.8078,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    transcript: 'Operator: Layanan darurat. Pelapor: Saya butuh ambulans, ada kecelakaan motor di depan SCBD.',
    speech: "I need an ambulance...",
    summary: {
      whatHappened: 'Kecelakaan motor di depan SCBD.',
      whereItHappened: 'Jalan Gatot Subroto',
    },
    classification: {
      emergencyType: 'Medical',
      confidenceScore: 0.95,
    },
  },
  {
    id: '12347',
    type: 'Robbery',
    location: 'Jalan Kuningan',
    latitude: -6.2146,
    longitude: 106.8271,
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    transcript: 'Operator: 112. Pelapor: Tolong! Ada perampokan di minimarket di Setiabudi.',
    speech: "Help! There's a robbe...",
    summary: {
      whatHappened: 'Perampokan di minimarket.',
      whereItHappened: 'Setiabudi, Jalan Kuningan',
    },
    classification: {
      emergencyType: 'Police',
      confidenceScore: 0.92,
    },
  },
  {
    id: '12348',
    type: 'Gas Leak',
    location: 'Jalan Rasuna Said',
    latitude: -6.2185,
    longitude: 106.8324,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    transcript: 'Pelapor: Halo, saya pikir ada kebocoran gas di apartemen saya, baunya sangat menyengat.',
    speech: "I think there's a gas l...",
    summary: {
      whatHappened: 'Dugaan kebocoran gas di apartemen.',
      whereItHappened: 'Jalan Rasuna Said',
    },
    classification: {
      emergencyType: 'Fire',
      confidenceScore: 0.88,
    },
  },
];
