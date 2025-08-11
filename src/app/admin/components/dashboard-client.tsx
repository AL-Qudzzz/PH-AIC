
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import type { Incident, Cluster } from "@/lib/definitions";
import { detectIncidentCluster } from "@/ai/flows/incident-cluster-detection";
import IncidentList from "./incident-list";
import IncidentDetails from "./incident-details";
import AdminHeader from "./admin-header";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import ClusterAlert from "./cluster-alert";

export default function DashboardClient() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Effect for authentication check and redirection
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/profile');
      } else {
        setIsAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleClusterDetection = useCallback(async (currentIncidents: Incident[]) => {
    if (currentIncidents.length < 2) {
        setClusters([]);
        return;
    }
    try {
      const reports = currentIncidents.map(inc => ({
        id: inc.id,
        location: inc.location.toLowerCase(),
        description: inc.summary.whatHappened,
        timestamp: inc.timestamp,
      }));

      const result = await detectIncidentCluster({
        reports,
        timeframeMinutes: 60,
        minClusterSize: 2,
        similarityThreshold: 0.7,
      });

      if (result.clusters && result.clusters.length > 0) {
        const mappedClusters: Cluster[] = result.clusters.map(c => ({
            ...c,
            reports: c.reports.map(r => 
                currentIncidents.find(i => i.id === r.id)! 
            ).filter(Boolean) as Incident[]
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

  // Effect for data loading from Firestore, depends on authentication
  useEffect(() => {
    if (isAuthenticated) {
      const q = query(collection(db, "incidents"), orderBy("timestamp", "desc"));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedIncidents: Incident[] = [];
        querySnapshot.forEach((doc) => {
          fetchedIncidents.push({ id: doc.id, ...doc.data() } as Incident);
        });

        setIncidents(fetchedIncidents);
        setIsLoading(false);

        if (fetchedIncidents.length > 0) {
           if (!selectedIncident || !fetchedIncidents.some(inc => inc.id === selectedIncident.id)) {
            setSelectedIncident(fetchedIncidents[0]);
           } else {
             const refreshedSelected = fetchedIncidents.find(inc => inc.id === selectedIncident.id);
             setSelectedIncident(refreshedSelected || fetchedIncidents[0]);
           }
           handleClusterDetection(fetchedIncidents);
        } else {
            setSelectedIncident(null);
            setClusters([]);
        }
      }, (error) => {
        console.error("Error fetching incidents: ", error);
        toast({
          variant: "destructive",
          title: "Failed to load incidents",
          description: "Could not retrieve data from the database.",
        });
        setIsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [isAuthenticated, toast, handleClusterDetection]);
  
  if (isAuthenticated === null || (isAuthenticated && isLoading)) {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center gap-4 p-4 md:p-8 bg-gray-50/50">
            <AdminHeader />
            <main className="flex-1 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6 min-h-0 w-full">
               <div className="md:col-span-1 xl:col-span-1 h-full min-h-0">
                 <Skeleton className="h-full w-full rounded-xl" />
               </div>
               <div className="md:col-span-2 xl:col-span-3 h-full min-h-0 flex flex-col gap-6">
                 <Skeleton className="h-1/3 w-full rounded-xl" />
                 <Skeleton className="h-2/3 w-full rounded-xl" />
               </div>
            </main>
        </div>
    );
  }


  return (
    <div className="h-screen w-full flex flex-col bg-gray-50/50">
        <AdminHeader />
        <main className="flex-1 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6 min-h-0">
            <div className="md:col-span-1 xl:col-span-1 h-full min-h-0 flex flex-col gap-4">
                <ClusterAlert clusters={clusters} />
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
