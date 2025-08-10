"use client";

import { useState } from "react";
import { Mic, Square, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { callTriage, CallTriageOutput } from "@/ai/flows/call-triage";
import { useToast } from "@/hooks/use-toast";

const MOCK_AUDIO_DATA_URI = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

export default function ReportClient() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CallTriageOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleReport = async () => {
    setResult(null);
    setError(null);
    setIsRecording(true);

    // Simulate recording for 5 seconds
    setTimeout(async () => {
      setIsRecording(false);
      setIsLoading(true);
      try {
        const response = await callTriage({ audioDataUri: MOCK_AUDIO_DATA_URI });
        setResult(response);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process the emergency call. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }, 5000);
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
                 <Button onClick={() => setResult(null)} className="w-full mt-4">Laporkan Lagi</Button>
            </div>
        </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center text-center">
      <div className="absolute top-0 w-full h-2/3 bg-white rounded-b-[4rem] flex flex-col justify-center items-center p-4">
        {isLoading ? (
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        ) : isRecording ? (
           <div className="flex flex-col items-center space-y-4">
             <p className="text-lg font-medium text-foreground">Merekam...</p>
             <div className="relative flex items-center justify-center">
               <div className="absolute h-20 w-20 bg-destructive/50 rounded-full animate-ping"></div>
               <Button size="lg" className="h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90" disabled>
                 <Square className="h-8 w-8" />
               </Button>
             </div>
             <p className="text-sm text-muted-foreground">Jelaskan situasi darurat Anda.</p>
           </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-foreground">Hey! User</h1>
            <p className="text-muted-foreground mt-2 max-w-xs">
              Press the Microphone button below to speak
            </p>
          </>
        )}
         {error && (
            <div className="text-destructive flex items-center gap-2 mt-4">
                <AlertTriangle />
                <p>Error: {error}</p>
            </div>
        )}
      </div>

    </div>
  );
}
