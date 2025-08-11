
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertTriangle, Clock } from "lucide-react";
import type { Cluster, Incident } from "@/lib/definitions";
import { formatDistanceToNow } from 'date-fns';

type ClusterAlertProps = {
  clusters: Cluster[];
};

export default function ClusterAlert({ clusters }: ClusterAlertProps) {
  if (clusters.length === 0) {
    return null;
  }

  // Helper to get the most recent report from a cluster
  const getMostRecentReport = (reports: Incident[]) => {
      if (!reports || reports.length === 0) return null;
      return reports.reduce((latest, current) => {
          return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
      });
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Incident Cluster Detected!</AlertTitle>
      <AlertDescription>
        Multiple similar incidents reported in the same area. This could indicate a large-scale event.
        <Accordion type="single" collapsible className="w-full mt-2">
            {clusters.map((cluster, index) => {
                const mostRecentReport = getMostRecentReport(cluster.reports);
                const timeAgo = mostRecentReport ? formatDistanceToNow(new Date(mostRecentReport.timestamp), { addSuffix: true }) : '';
                
                return (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>
                            <div className="flex flex-col text-left">
                               <span className="font-semibold">Cluster at {cluster.location} ({cluster.reports.length} reports)</span>
                               <span className="text-xs text-muted-foreground">{timeAgo}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-disc pl-5 space-y-1">
                                {cluster.reports.map(report => (
                                    <li key={report.id} className="text-xs">
                                        {report.summary.whatHappened} 
                                        <span className="text-muted-foreground/80 ml-2 flex items-center gap-1">
                                            <Clock className="h-3 w-3"/>
                                            {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
      </AlertDescription>
    </Alert>
  );
}
