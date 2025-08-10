"use client";

import { Car, Flame, HeartPulse, Shield, LucideIcon, Clock } from "lucide-react";
import type { Incident, EmergencyType } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

const emergencyIcons: Record<EmergencyType, LucideIcon> = {
  Medical: HeartPulse,
  Fire: Flame,
  Police: Shield,
  Traffic: Car,
  Unknown: HeartPulse, // Fallback icon
};

type IncidentListProps = {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
};

export default function IncidentList({ incidents, selectedIncident, onSelectIncident }: IncidentListProps) {
  return (
    <Card className="h-full flex flex-col shadow-lg rounded-xl bg-white">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-bold text-gray-900">Incoming Incidents</CardTitle>
        <CardDescription>
            {incidents.length} reports received.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <ScrollArea className="h-full">
          <div className="space-y-1 p-2">
            {incidents.length > 0 ? (
                incidents.map((incident) => {
                  const Icon = emergencyIcons[incident.type] || HeartPulse;
                  return (
                    <button
                      key={incident.id}
                      onClick={() => onSelectIncident(incident)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-all duration-200 border-2 border-transparent",
                        selectedIncident?.id === incident.id
                          ? "bg-primary/10 border-primary/50"
                          : "hover:bg-gray-100"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("mt-1 p-2 rounded-full", 
                           selectedIncident?.id === incident.id ? 'bg-primary/20' : 'bg-gray-100')}>
                           <Icon className={cn("h-5 w-5", selectedIncident?.id === incident.id ? 'text-primary' : 'text-gray-600')} />
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <div className="flex justify-between items-center">
                            <Badge variant={selectedIncident?.id === incident.id ? 'default' : 'secondary'} className="capitalize">{incident.type}</Badge>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
                            </div>
                          </div>
                          <p className="font-semibold mt-1 text-gray-800 truncate">{incident.location}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {incident.summary.whatHappened}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
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
