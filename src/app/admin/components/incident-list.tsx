
"use client";

import type { Incident } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';

type IncidentListProps = {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
};

export default function IncidentList({ incidents, selectedIncident, onSelectIncident }: IncidentListProps) {
  return (
    <Card className="h-full flex flex-col shadow-sm rounded-xl bg-white">
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="text-lg font-bold text-gray-800">Incoming Incidents</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <ScrollArea className="h-full">
          <div className="p-2">
            {incidents.length > 0 ? (
                incidents.map((incident) => (
                    <button
                      key={incident.id}
                      onClick={() => onSelectIncident(incident)}
                      className={cn(
                        "w-full text-left p-3 mb-2 rounded-lg transition-all duration-200 border-l-4",
                        selectedIncident?.id === incident.id
                          ? "bg-primary/5 border-primary"
                          : "border-transparent hover:bg-gray-50"
                      )}
                    >
                      <div className="flex justify-between items-baseline mb-1">
                        <p className="font-semibold text-sm text-gray-900">Incident #{incident.id.substring(0, 6)}...</p>
                         <p className="text-xs text-gray-500">
                           {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
                         </p>
                      </div>
                      <div className="text-xs text-gray-600 space-y-0.5">
                         <p><span className="font-medium">Type:</span> {incident.type}</p>
                         <p><span className="font-medium">Location:</span> {incident.location}</p>
                         <p className="truncate"><span className="font-medium">Speech:</span> "{incident.speech || incident.summary.whatHappened}"</p>
                      </div>
                    </button>
                  )
                )
            ) : (
                <div className="text-center p-10 text-gray-500">
                    <p>No incidents to show.</p>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
