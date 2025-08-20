
"use client";

import { useState, useEffect } from "react";
import type { Incident } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function HistoryClient() {
  const [reports, setReports] = useState<Incident[]>([]);

  useEffect(() => {
    try {
      const storedReports = localStorage.getItem('userReports');
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      }
    } catch (error) {
      console.error("Failed to load reports from local storage:", error);
    }
  }, []);
  
  const handleClearHistory = () => {
      try {
        localStorage.removeItem('userReports');
        setReports([]);
      } catch (error) {
        console.error("Failed to clear history from local storage:", error);
      }
  }

  return (
    <div className="h-full flex flex-col">
       <div className="flex justify-between items-center mb-4">
         <div>
            <h1 className="text-2xl font-bold">Riwayat Laporan</h1>
            <p className="text-muted-foreground">Ini adalah daftar laporan darurat yang telah Anda buat.</p>
         </div>
         {reports.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearHistory}>
                Hapus Riwayat
            </Button>
         )}
       </div>
       <Card className="flex-grow">
         <CardContent className="p-4 h-full">
            <ScrollArea className="h-full">
             {reports.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {reports.map((report) => (
                    <AccordionItem value={report.id} key={report.id}>
                      <AccordionTrigger>
                        <div className="flex flex-col items-start text-left">
                          <span className="font-semibold">{report.type} - {report.location}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p><strong>Lokasi:</strong> {report.summary.whereItHappened}</p>
                        <p><strong>Detail:</strong> {report.summary.whatHappened}</p>
                        <p className="p-2 bg-gray-50 rounded-md border text-xs"><strong>Transkrip:</strong> {report.transcript}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
             ) : (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <p>Anda belum membuat laporan apa pun.</p>
                </div>
             )}
            </ScrollArea>
         </CardContent>
       </Card>
    </div>
  );
}
