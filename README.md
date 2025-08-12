## Architecture

The application follows a client-server architecture:

- **Frontend:** Built with NextJS, providing the user and admin interfaces for reporting incidents and monitoring emergency situations. Key components and pages are located in the `src/app` and `src/components` directories.
- **Backend:** Leverages Firebase for data storage and potentially authentication. The NextJS application likely handles API routes and server-side logic to interact with Firebase and the AI models.
- **AI/ML Models:** Integrated into the system for processing emergency calls and incident data. These models, likely implemented using Google's AI technologies, are responsible for tasks such as call triage, emergency classification, incident cluster detection, and key information extraction from call transcripts. The core AI logic is found in the `src/ai/flows` directory.

## Datasets

The system handles data related to emergency incidents. A key example of the data structure can be observed in the mock data provided in `src/lib/mock-data.ts`. This mock data includes fields such as:

- `type`: The type of emergency (e.g., "Fire", "Medical", "Accident").
- `location`: A descriptive string of the incident location.
- `coordinates`: Geographical coordinates (latitude and longitude) of the incident.
- `timestamp`: The time the incident occurred or was reported.
- `transcript`: A transcript of the emergency call, which is processed by the AI models.

## Getting Started

To understand the application's structure and entry points, begin by exploring `src/app/page.tsx`.