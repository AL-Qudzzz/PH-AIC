"use client";

import { useState } from "react";
import { Mic, Square, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Lapor Darurat</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[200px]">
        {!isLoading && !result && !isRecording && (
          <Button
            size="lg"
            className="h-24 w-24 rounded-full"
            onClick={handleReport}
          >
            <Mic className="h-12 w-12" />
          </Button>
        )}
        {isRecording && (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg font-medium">Merekam...</p>
            <div className="relative flex items-center justify-center">
              <div className="absolute h-20 w-20 bg-destructive/50 rounded-full animate-ping"></div>
              <Button size="lg" className="h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90" disabled>
                <Square className="h-8 w-8" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Jelaskan situasi darurat Anda.</p>
          </div>
        )}
        {isLoading && <Loader2 className="h-12 w-12 animate-spin" />}
        {result && (
          <div className="w-full space-y-4 text-left p-4 rounded-lg bg-background">
            <h3 className="text-lg font-semibold">Hasil Triase AI:</h3>
            <div>
              <p className="font-bold">Transkrip:</p>
              <p className="text-muted-foreground">{result.transcript || "Tidak dapat mentranskripsi audio."}</p>
            </div>
            <div>
              <p className="font-bold">Jenis Darurat:</p>
              <p className="text-muted-foreground">{result.emergencyType || "Tidak teridentifikasi."}</p>
            </div>
            <div>
              <p className="font-bold">Detail Penting:</p>
              <p className="text-muted-foreground">{result.keyDetails || "Tidak ada detail penting yang diekstrak."}</p>
            </div>
          </div>
        )}
        {error && (
            <div className="text-destructive flex items-center gap-2">
                <AlertTriangle />
                <p>Error: {error}</p>
            </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {result && (
            <Button onClick={() => setResult(null)}>Laporkan Lagi</Button>
        )}
      </CardFooter>
    </Card>
  );
}
