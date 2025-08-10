
"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { callTriage, CallTriageOutput } from "@/ai/flows/call-triage";
import { useToast } from "@/hooks/use-toast";
import type { Incident, EmergencyType } from "@/lib/definitions";
import { mockIncidents } from "@/lib/mock-data";

const INCIDENTS_STORAGE_KEY = 'siaga-incidents';

// Helper function to get a random item from an array
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper function to map string to EmergencyType
const toEmergencyType = (type: string): EmergencyType => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('medical') || lowerType.includes('medis')) return 'Medical';
  if (lowerType.includes('fire') || lowerType.includes('kebakaran')) return 'Fire';
  if (lowerType.includes('police') || lowerType.includes('polisi')) return 'Police';
  if (lowerType.includes('traffic') || lowerType.includes('lalu lintas')) return 'Traffic';
  return 'Unknown';
};

export default function ReportClient() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CallTriageOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const getMicPermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setHasPermission(true);
        } catch (err) {
            console.error("Microphone permission denied:", err);
            setError("Izin mikrofon diperlukan untuk melaporkan keadaan darurat.");
            setHasPermission(false);
            toast({
                variant: "destructive",
                title: "Izin Ditolak",
                description: "Harap aktifkan izin mikrofon di browser Anda.",
            });
        }
    };
    getMicPermission();
  }, [toast]);


  const startRecording = async () => {
    if (!hasPermission) {
        toast({
            variant: "destructive",
            title: "Tidak ada akses mikrofon",
            description: "Tidak dapat mulai merekam tanpa izin mikrofon.",
        });
        return;
    }
    
    setError(null);
    setResult(null);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = async () => {
            setIsLoading(true);
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            
            if (audioBlob.size === 0) {
                setError("Tidak ada suara yang terdeteksi. Silakan coba lagi.");
                setIsLoading(false);
                setResult(null);
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64data = reader.result as string;
                try {
                    const response = await callTriage({ audioDataUri: base64data });

                    if (!response.transcript || response.transcript.trim().length < 5) {
                        setError("Tidak dapat mendeteksi suara yang jelas. Mohon bicara lebih keras dan jelas.");
                        setResult(null);
                    } else {
                        setResult(response);
                        // Save to localStorage for admin dashboard
                        const newIncident: Incident = {
                          id: `inc-${Date.now()}`,
                          timestamp: new Date().toISOString(),
                          transcript: response.transcript,
                          type: toEmergencyType(response.emergencyType),
                          location: response.keyDetails.split(',').pop()?.trim() || 'Unknown Location',
                          summary: {
                            whatHappened: response.keyDetails,
                            whereItHappened: response.keyDetails.split(',').pop()?.trim() || 'Unknown Location',
                          },
                          classification: {
                            emergencyType: response.emergencyType,
                            confidenceScore: Math.random() * (0.99 - 0.85) + 0.85, // Simulate confidence
                          },
                        };

                        const storedIncidents = localStorage.getItem(INCIDENTS_STORAGE_KEY);
                        const incidents = storedIncidents ? JSON.parse(storedIncidents) as Incident[] : mockIncidents;
                        incidents.push(newIncident);
                        localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(incidents));
                    }

                } catch (e) {
                     const errorMessage = e instanceof Error ? e.message : "Terjadi kesalahan yang tidak diketahui.";
                    setError(errorMessage);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Gagal memproses panggilan darurat. Silakan coba lagi.",
                    });
                } finally {
                    setIsLoading(false);
                }
            };
            
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
    } catch (err) {
        console.error("Error starting recording:", err);
        setError("Gagal memulai perekaman.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  if (result) {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center text-center p-4">
            <div className="w-full space-y-4 text-left p-4 rounded-lg bg-white shadow-md">
                <h3 className="text-lg font-semibold text-center text-foreground">Hasil Triase AI:</h3>
                <div>
                    <p className="font-bold text-foreground">Transkrip:</p>
                    <p className="text-muted-foreground">{result.transcript || "Tidak dapat mentranskripsi audio."}</p>
                </div>
                <div>
                    <p className="font-bold text-foreground">Jenis Darurat:</p>
                    <p className="text-muted-foreground">{result.emergencyType || "Tidak teridentifikasi."}</p>
                </div>
                <div>
                    <p className="font-bold text-foreground">Detail Penting:</p>
                    <p className="text-muted-foreground">{result.keyDetails || "Tidak ada detail penting yang diekstrak."}</p>
                </div>
                 <Button onClick={handleReset} className="w-full mt-4">Laporkan Lagi</Button>
            </div>
        </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center text-center">
      <div className="absolute top-0 w-full h-2/3 bg-white rounded-b-[4rem] flex flex-col justify-center items-center p-4">
        {isLoading ? (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground mt-2">Menganalisis audio...</p>
          </>
        ) : isRecording ? (
           <div className="flex flex-col items-center space-y-4">
             <p className="text-lg font-medium text-foreground">Merekam...</p>
             <div className="relative flex items-center justify-center">
               <div className="absolute h-20 w-20 bg-destructive/50 rounded-full animate-ping"></div>
             </div>
             <p className="text-sm text-muted-foreground">Jelaskan situasi darurat Anda. Tekan lagi untuk berhenti.</p>
           </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-foreground">Hai People</h1>
            <p className="text-muted-foreground mt-2 max-w-xs">
              Tekan tombol mikrofon dibawah untuk melaporkan kejadian darurat
            </p>
          </>
        )}
         {error && (
            <div className="text-destructive flex items-center gap-2 mt-4 text-center">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
            </div>
        )}
      </div>
      <button id="report-button" onClick={handleMicClick} className="hidden">Report</button>
    </div>
  );
}
