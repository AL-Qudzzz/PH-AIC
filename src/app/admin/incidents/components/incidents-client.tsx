
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
import { AlertCircle, Flame, Siren, Ambulance, Car } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const ICONS: Record<EmergencyType, React.ElementType> = {
    Medical: Ambulance,
    Fire: Flame,
    Police: Siren,
    Traffic: Car,
    Accident: Car,
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
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = () => {
      const adminStatus = sessionStorage.getItem("userIsAdmin");
      if (adminStatus !== "true") {
        router.replace('/profile');
      } else {
        setIsAdmin(true);
      }
    };
    checkAdminStatus();
  }, [router]);
  
  useEffect(() => {
    if (isAdmin) {
        const q = query(collection(db, "incidents"), orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const allIncidents: Incident[] = [];
            querySnapshot.forEach((doc) => {
                allIncidents.push({ id: doc.id, ...doc.data() } as Incident);
            });

            const grouped = allIncidents.reduce((acc, incident) => {
                const type = incident.type || 'Unknown';
                if (!acc[type]) {
                    acc[type] = [];
                }
                acc[type].push(incident);
                return acc;
            }, {} as Record<string, Incident[]>);
            
            setGroupedIncidents(grouped);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }
  }, [isAdmin]);

  if (isAdmin === null || (isAdmin && isLoading)) {
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
                                            <span className="font-semibold">ID: {incident.id.substring(0,6)}...</span>
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
