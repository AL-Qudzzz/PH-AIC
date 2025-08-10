
"use client";

import type { Incident } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatDistanceToNow } from 'date-fns';

type IncidentDetailsProps = {
  incident: Incident;
};

export default function IncidentDetails({ incident }: IncidentDetailsProps) {
  return (
    <div className="h-full flex flex-col gap-6">
      <Card className="shadow-sm rounded-xl">
        <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">Incident Location</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="aspect-[16/6] w-full bg-muted rounded-lg overflow-hidden border">
                <Image
                    src={`https://placehold.co/1200x400.png`}
                    alt="Map placeholder"
                    width={1200}
                    height={400}
                    className="w-full h-full object-cover"
                    data-ai-hint="map"
                />
            </div>
        </CardContent>
      </Card>
      <Card className="flex-grow shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">Incident Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Incident ID</p>
                        <p className="font-semibold text-gray-800">{incident.id}</p>
                    </div>
                     <div>
                        <p className="text-gray-500">Status</p>
                        <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50">Pending Dispatch</Badge>
                    </div>
                     <div>
                        <p className="text-gray-500">Type</p>
                        <p className="font-semibold text-gray-800">{incident.type}</p>
                    </div>
                     <div>
                        <p className="text-gray-500">Timestamp</p>
                        <p className="font-semibold text-gray-800">{formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}</p>
                    </div>
                </div>
                 <div className="text-sm">
                    <p className="text-gray-500">Location</p>
                    <p className="font-semibold text-gray-800">{incident.location}</p>
                 </div>
                 <div className="text-sm">
                    <p className="text-gray-500">Details</p>
                    <p className="font-semibold text-gray-800">{incident.summary.whatHappened}</p>
                 </div>
                 <div className="text-sm">
                    <p className="text-gray-500">Transcript</p>
                    <p className="font-semibold text-gray-800 bg-gray-50 p-2 rounded-md border">{incident.transcript}</p>
                 </div>
            </div>
            <div className="md:col-span-2 md:border-l md:pl-6 flex flex-col justify-between">
                <div className="space-y-4">
                     <div>
                        <p className="text-sm text-gray-500 mb-1">Assign Resources</p>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a team..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="medic-1">Medic Team 1</SelectItem>
                                <SelectItem value="fire-unit-a">Fire Unit A</SelectItem>
                                <SelectItem value="police-car-3">Police Car 3</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="w-full">Dismiss</Button>
                    <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white">Dispatch</Button>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
