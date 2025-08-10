
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import type { Incident, Cluster } from "@/lib/definitions";
import { mockIncidents } from "@/lib/mock-data";
import { detectIncidentCluster } from "@/ai/flows/incident-cluster-detection";
import IncidentList from "./incident-list";
import IncidentDetails from "./incident-details";
import ClusterAlert from "./cluster-alert";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function DashboardClient() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus !== "true") {
      router.replace('/profile');
      setIsAuthenticated(false);
      return;
    }
    
    setIsAuthenticated(true);

    const sortedIncidents = [...mockIncidents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setIncidents(sortedIncidents);
    setSelectedIncident(sortedIncidents[0] || null);
    
    handleClusterDetection(sortedIncidents);

    const intervalId = setInterval(() => {
        const newIncident: Incident = {
            id: `inc-${Date.now()}`,
            type: 'Medical',
            location: 'Jl. Sudirman, Jakarta',
            timestamp: new Date().toISOString(),
            transcript: 'Pelapor: Tolong, ada orang pingsan di lobi gedung BEJ.',
            summary: {
                whatHappened: 'Orang pingsan.',
                whereItHappened: 'Lobi gedung BEJ, Jl. Sudirman, Jakarta',
            },
            classification: {
                emergencyType: 'Medical',
                confidenceScore: 0.88,
            },
        };
      
      setIncidents(prev => {
        const updatedIncidents = [newIncident, ...prev];
        handleClusterDetection(updatedIncidents);
        return updatedIncidents;
      });
      
      toast({
        title: "New Incident Received",
        description: `Medical emergency reported at ${newIncident.location}`,
      });

    }, 15000);

    return () => clearInterval(intervalId);
  }, [router, toast]);

  const handleClusterDetection = async (currentIncidents: Incident[]) => {
    try {
      const reports = currentIncidents.map(inc => ({
        location: inc.location,
        description: inc.summary.whatHappened,
        timestamp: inc.timestamp,
      }));

      const result = await detectIncidentCluster({
        reports,
        timeframeMinutes: 60,
        minClusterSize: 2,
      });

      if (result.clusters && result.clusters.length > 0) {
        const mappedClusters: Cluster[] = result.clusters.map(c => ({
            ...c,
            reports: c.reports.map(r => 
                currentIncidents.find(i => i.timestamp === r.timestamp && i.location === r.location) || mockIncidents[0] 
            )
        }));
        setClusters(mappedClusters);
      } else {
        setClusters([]);
      }
    } catch (error) {
      console.error("Failed to detect incident clusters:", error);
       toast({
          variant: "destructive",
          title: "Cluster Detection Failed",
          description: "Could not process incident cluster detection.",
        });
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push('/profile');
  };

  if (isAuthenticated === null || !isAuthenticated) {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center gap-4 p-4">
            <Skeleton className="h-8 w-1/2" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow w-full">
                <Skeleton className="lg:col-span-1 h-full rounded-lg" />
                <Skeleton className="lg:col-span-2 h-full rounded-lg" />
            </div>
        </div>
    );
  }


  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        {clusters.length > 0 && <ClusterAlert clusters={clusters} />}
        <Button onClick={handleLogout} variant="outline" className="ml-auto">Logout</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
        <div className="lg:col-span-1 h-full">
          <IncidentList
            incidents={incidents}
            selectedIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
          />
        </div>
        <div className="lg:col-span-2 h-full">
          {selectedIncident ? (
            <IncidentDetails incident={selectedIncident} />
          ) : (
            <div className="flex items-center justify-center h-full bg-card rounded-lg">
                <p className="text-muted-foreground">Select an incident to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
