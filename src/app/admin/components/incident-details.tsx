"use client";

import type { Incident } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

type IncidentDetailsProps = {
  incident: Incident;
};

export default function IncidentDetails({ incident }: IncidentDetailsProps) {
  return (
    <Card className="h-full flex flex-col">
       <CardHeader>
        <CardTitle>Incident Details</CardTitle>
        <CardDescription>{incident.location}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">AI Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div>
                        <h4 className="font-semibold">Classification</h4>
                        <div className="flex items-center gap-2">Type: <Badge>{incident.classification.emergencyType}</Badge></div>
                        <div className="flex items-center gap-2">Confidence: <Badge variant="outline">{(incident.classification.confidenceScore * 100).toFixed(0)}%</Badge></div>
                    </div>
                    <div>
                        <h4 className="font-semibold">Key Information</h4>
                        <p><span className="font-bold">What:</span> {incident.summary.whatHappened}</p>
                        <p><span className="font-bold">Where:</span> {incident.summary.whereItHappened}</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="flex-grow flex flex-col">
                <CardHeader>
                    <CardTitle className="text-lg">Call Transcript</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <ScrollArea className="h-48 p-4 border rounded-md">
                        <p className="text-sm text-muted-foreground">{incident.transcript}</p>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-lg">Incident Location</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
                        <Image
                            src={`https://placehold.co/600x400.png`}
                            alt="Map placeholder"
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                            data-ai-hint="map"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
      </CardContent>
    </Card>
  );
}
