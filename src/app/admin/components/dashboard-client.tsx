
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import type { Incident, Cluster, EmergencyType } from "@/lib/definitions";
import { mockIncidents } from "@/lib/mock-data";
import { detectIncidentCluster } from "@/ai/flows/incident-cluster-detection";
import IncidentList from "./incident-list";
import IncidentDetails from "./incident-details";
import ClusterAlert from "./cluster-alert";
import AdminHeader from "./admin-header";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
            let allIncidents = storedIncidents ? JSON.parse(storedIncidents) as Incident[] : [];
            
             // If local storage is empty, populate with mock data
            if (allIncidents.length === 0) {
                allIncidents = mockIncidents;
                localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(allIncidents));
            }
            
            // Ensure all incidents have a speech property
            allIncidents = allIncidents.map(inc => ({
                ...inc,
                speech: inc.speech || inc.summary.whatHappened,
            }));

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
  
  if (isAuthenticated === null) {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center gap-4 p-4 md:p-8">
            <Skeleton className="h-16 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-grow w-full">
                <Skeleton className="md:col-span-1 h-full rounded-lg" />
                <Skeleton className="md:col-span-2 h-full rounded-lg" />
            </div>
        </div>
    );
  }


  return (
    <div className="h-screen w-full flex flex-col bg-gray-50/50">
        <AdminHeader />
        <main className="flex-1 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6 min-h-0">
            <div className="md:col-span-1 xl:col-span-1 h-full min-h-0">
                <IncidentList
                    incidents={incidents}
                    selectedIncident={selectedIncident}
                    onSelectIncident={setSelectedIncident}
                />
            </div>
            <div className="md:col-span-2 xl:col-span-3 h-full min-h-0">
                {selectedIncident ? (
                    <IncidentDetails incident={selectedIncident} />
                ) : (
                    <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500">Select an incident to view details.</p>
                    </div>
                )}
            </div>
        </main>
    </div>
  );
}
