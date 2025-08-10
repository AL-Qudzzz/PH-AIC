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
    <Card className="h-full flex flex-col shadow-lg rounded-xl">
       <CardHeader className="bg-gray-50 rounded-t-xl border-b">
        <CardTitle className="text-xl font-bold text-gray-900">Incident Details</CardTitle>
        <CardDescription className="text-gray-600">{incident.location}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-b-xl">
        <div className="space-y-6">
            <Card className="shadow-md rounded-lg">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">AI Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-700">Classification</h4>
                        <div className="flex items-center gap-2 mt-1">Type: <Badge className="capitalize text-sm">{incident.classification.emergencyType}</Badge></div>
                        <div className="flex items-center gap-2 mt-1">Confidence: <Badge variant="outline" className="text-sm">{(incident.classification.confidenceScore * 100).toFixed(0)}%</Badge></div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700">Key Information</h4>
                        <p className="mt-1"><span className="font-bold text-gray-600">What:</span> {incident.summary.whatHappened}</p>
                        <p className="mt-1"><span className="font-bold text-gray-600">Where:</span> {incident.summary.whereItHappened}</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="flex-grow flex flex-col shadow-md rounded-lg">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">Call Transcript</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <ScrollArea className="h-48 p-4 border rounded-md bg-gray-50">
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{incident.transcript}</p>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
        <div className="h-full">
            <Card className="h-full shadow-md rounded-lg">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">Incident Location</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden border">
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
