import { config } from 'dotenv';
config();

import '@/ai/flows/emergency-classification.ts';
import '@/ai/flows/key-info-extraction.ts';
import '@/ai/flows/incident-cluster-detection.ts';
import '@/ai/flows/call-triage.ts';