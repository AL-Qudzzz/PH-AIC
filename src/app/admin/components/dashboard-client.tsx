"use client";

import { useState, useEffect } from "react";
import type { Incident, Cluster } from "@/lib/definitions";
import { mockIncidents } from "@/lib/mock-data";
import { detectIncidentCluster } from "@/ai/flows/incident-cluster-detection";
import IncidentList from "./incident-list";
import IncidentDetails from "./incident-details";
import ClusterAlert from "./cluster-alert";
import { useToast } from "@/hooks/use-toast";

export default function DashboardClient() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Initial load of mock data
    const sortedIncidents = [...mockIncidents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setIncidents(sortedIncidents);
    setSelectedIncident(sortedIncidents[0] || null);
    
    // Initial cluster detection
    handleClusterDetection(sortedIncidents);

    // Simulate new incidents arriving every 15 seconds
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
  }, [toast]);

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
                // find the original incident, very inefficient but ok for mock
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

  return (
    <div className="h-full w-full flex flex-col gap-4">
      {clusters.length > 0 && <ClusterAlert clusters={clusters} />}
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
