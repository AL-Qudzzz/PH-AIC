
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Incident, EmergencyType } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Flame, Siren, Ambulance, CarCrash } from "lucide-react";

const INCIDENTS_STORAGE_KEY = 'siaga-incidents';

const ICONS: Record<EmergencyType, React.ElementType> = {
    Medical: Ambulance,
    Fire: Flame,
    Police: Siren,
    Traffic: CarCrash,
    Accident: CarCrash,
    Robbery: Siren,
    'Gas Leak': Flame,
    Unknown: AlertCircle,
}

const getEmergencyTypeIcon = (type: EmergencyType) => {
    const Icon = ICONS[type] || AlertCircle;
    return <Icon className="h-4 w-4 mr-2" />;
}

export default function IncidentsClient() {
  const [groupedIncidents, setGroupedIncidents] = useState<Record<string, Incident[]>>({});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus !== "true") {
      router.replace('/profile');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);
  
  useEffect(() => {
    if (isAuthenticated) {
        const storedIncidents = localStorage.getItem(INCIDENTS_STORAGE_KEY);
        const allIncidents = storedIncidents ? JSON.parse(storedIncidents) as Incident[] : [];
        
        const grouped = allIncidents.reduce((acc, incident) => {
            const type = incident.type || 'Unknown';
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(incident);
            // Sort incidents within each group by timestamp descending
            acc[type].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            return acc;
        }, {} as Record<string, Incident[]>);
        
        setGroupedIncidents(grouped);
    }
  }, [isAuthenticated]);

  if (isAuthenticated === null) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  const sortedGroupKeys = Object.keys(groupedIncidents).sort();

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">All Incidents</h1>
            <p className="text-muted-foreground">A grouped view of all reported incidents by type.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {sortedGroupKeys.length > 0 ? sortedGroupKeys.map(type => (
                <Card key={type}>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                           {getEmergencyTypeIcon(type as EmergencyType)}
                           {type} Incidents
                           <Badge variant="secondary" className="ml-auto">{groupedIncidents[type].length}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {groupedIncidents[type].map(incident => (
                                <AccordionItem value={incident.id} key={incident.id}>
                                    <AccordionTrigger>
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-semibold">ID: {incident.id}</span>
                                            <span className="text-xs text-muted-foreground">{incident.location}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2 text-sm">
                                        <p><strong>Timestamp:</strong> {format(new Date(incident.timestamp), 'PPpp')}</p>
                                        <p><strong>Location:</strong> {incident.summary.whereItHappened}</p>
                                        <p><strong>Details:</strong> {incident.summary.whatHappened}</p>
                                        <p className="p-2 bg-gray-50 rounded-md border"><strong>Transcript:</strong> {incident.transcript}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            )) : (
                 <div className="col-span-full text-center py-10">
                    <p className="text-muted-foreground">No incidents have been reported yet.</p>
                </div>
            )}
        </div>
    </div>
  );
}
