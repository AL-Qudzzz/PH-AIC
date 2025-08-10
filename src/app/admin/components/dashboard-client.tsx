
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import type { Incident, Cluster, EmergencyType } from "@/lib/definitions";
import { mockIncidents } from "@/lib/mock-data";
import { detectIncidentCluster } from "@/ai/flows/incident-cluster-detection";
import IncidentList from "./incident-list";
import IncidentDetails from "./incident-details";
import ClusterAlert from "./cluster-alert";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const INCIDENTS_STORAGE_KEY = 'siaga-incidents';

export default function DashboardClient() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Effect for authentication check and redirection
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus !== "true") {
      router.replace('/profile');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);
  
  const handleClusterDetection = useCallback(async (currentIncidents: Incident[]) => {
    if (currentIncidents.length < 2) {
        setClusters([]);
        return;
    }
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
            // @ts-ignore
            reports: c.reports.map(r => 
                currentIncidents.find(i => i.timestamp === r.timestamp && i.location.toLowerCase() === r.location.toLowerCase()) || mockIncidents[0] 
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
  }, [toast]);


  // Effect for data loading and intervals, depends on authentication
  useEffect(() => {
    if (isAuthenticated) {
        const loadIncidents = () => {
            const storedIncidents = localStorage.getItem(INCIDENTS_STORAGE_KEY);
            const allIncidents = storedIncidents ? JSON.parse(storedIncidents) as Incident[] : mockIncidents;
            const sortedIncidents = [...allIncidents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
            setIncidents(sortedIncidents);
            if (!selectedIncident && sortedIncidents.length > 0) {
              setSelectedIncident(sortedIncidents[0]);
            } else if (selectedIncident) {
              // refresh selected incident data
              const newSelected = sortedIncidents.find(i => i.id === selectedIncident.id);
              setSelectedIncident(newSelected || sortedIncidents[0] || null);
            }
            handleClusterDetection(sortedIncidents);
        };
        
        loadIncidents();

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === INCIDENTS_STORAGE_KEY) {
                loadIncidents();
                toast({
                    title: "New Incident Received",
                    description: `Dashboard has been updated.`,
                });
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }
  }, [isAuthenticated, toast, handleClusterDetection]);
  
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push('/profile');
  };

  if (isAuthenticated === null) {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center gap-4 p-4">
            <Skeleton className="h-8 w-1/2" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow w-full">
                <Skeleton className="lg:col-span-1 h-full rounded-lg" />
                <Skeleton className="lg:col-span-2 h-full rounded-lg" />
            </div>
        </div>
    );
  }


  return (
    <div className="h-screen w-full flex flex-col gap-4 p-4 bg-gray-50">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </div>
       <div className="w-full">
         <ClusterAlert clusters={clusters} />
       </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0">
        <div className="lg:col-span-1 h-full min-h-0">
          <IncidentList
            incidents={incidents}
            selectedIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
          />
        </div>
        <div className="lg:col-span-2 h-full min-h-0">
          {selectedIncident ? (
            <IncidentDetails incident={selectedIncident} />
          ) : (
            <div className="flex items-center justify-center h-full bg-white rounded-lg shadow">
                <p className="text-gray-500">No incidents reported yet. Reports from users will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
