import { Incident } from './definitions';

export const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'Medical',
    location: 'Jl. Sudirman, Jakarta',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    transcript: 'Operator: 112, ada yang bisa dibantu? Pelapor: Tolong, ada kecelakaan di depan Plaza Indonesia, sepertinya ada yang pingsan.',
    summary: {
      whatHappened: 'Kecelakaan di depan Plaza Indonesia, ada korban pingsan.',
      whereItHappened: 'Depan Plaza Indonesia, Jl. Sudirman, Jakarta',
    },
    classification: {
      emergencyType: 'Medical',
      confidenceScore: 0.95,
    },
  },
  {
    id: '2',
    type: 'Fire',
    location: 'Jl. Gatot Subroto, Jakarta',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    transcript: 'Operator: Layanan darurat. Pelapor: Kebakaran! Ada api di gedung apartemen saya di Kuningan!',
    summary: {
      whatHappened: 'Kebakaran di gedung apartemen.',
      whereItHappened: 'Kuningan, Jl. Gatot Subroto, Jakarta',
    },
    classification: {
      emergencyType: 'Fire',
      confidenceScore: 0.98,
    },
  },
  {
    id: '3',
    type: 'Police',
    location: 'Jl. Hayam Wuruk, Jakarta',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    transcript: 'Operator: 112. Pelapor: Ada perampokan di toko emas dekat halte busway Mangga Besar.',
    summary: {
      whatHappened: 'Perampokan di toko emas.',
      whereItHappened: 'Dekat halte busway Mangga Besar, Jl. Hayam Wuruk, Jakarta',
    },
    classification: {
      emergencyType: 'Police',
      confidenceScore: 0.92,
    },
  },
    {
    id: '4',
    type: 'Medical',
    location: 'Jl. Sudirman, Jakarta',
    timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    transcript: 'Pelapor: Halo, teman saya jatuh dari motor di dekat Bundaran HI. Kakinya berdarah banyak.',
    summary: {
      whatHappened: 'Kecelakaan motor, korban pendarahan di kaki.',
      whereItHappened: 'Dekat Bundaran HI, Jl. Sudirman, Jakarta',
    },
    classification: {
      emergencyType: 'Medical',
      confidenceScore: 0.96,
    },
  },
  {
    id: '5',
    type: 'Traffic',
    location: 'Tol Cikampek KM 50',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    transcript: 'Pelapor: Pak, ini di tol Cikampek arah Jakarta macet total ada truk terguling.',
    summary: {
      whatHappened: 'Truk terguling menyebabkan kemacetan total.',
      whereItHappened: 'Tol Cikampek KM 50 arah Jakarta',
    },
    classification: {
      emergencyType: 'Traffic',
      confidenceScore: 0.99,
    },
  },
];
