"use client";

import { Car, Flame, HeartPulse, Shield, LucideIcon, Clock } from "lucide-react";
import type { Incident, EmergencyType } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Incoming Incidents</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <ScrollArea className="h-[75vh]">
          <div className="space-y-2 p-4 pt-0">
            {incidents.map((incident) => {
              const Icon = emergencyIcons[incident.type] || HeartPulse;
              return (
                <button
                  key={incident.id}
                  onClick={() => onSelectIncident(incident)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg transition-colors",
                    selectedIncident?.id === incident.id
                      ? "bg-primary/20"
                      : "hover:bg-primary/10"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <Icon className="h-6 w-6 mt-1 text-primary" />
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="capitalize">{incident.type}</Badge>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                      <p className="font-semibold mt-1">{incident.location}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {incident.summary.whatHappened}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
