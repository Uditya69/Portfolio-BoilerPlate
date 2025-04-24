"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface DashboardMetrics {
  totalProjects: number;
  totalSkills: number;
  totalMessages: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProjects: 0,
    totalSkills: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const [
        projectsSnapshot,
        skillsSnapshot,
        messagesSnapshot,
        unreadMessagesSnapshot,
      ] = await Promise.all([
        getDocs(collection(db, "projects")),
        getDocs(collection(db, "skills")),
        getDocs(collection(db, "messages")),
        getDocs(query(collection(db, "messages"), where("read", "==", false))),
      ]);

      setMetrics({
        totalProjects: projectsSnapshot.size,
        totalSkills: skillsSnapshot.size,
        totalMessages: messagesSnapshot.size,
        unreadMessages: unreadMessagesSnapshot.size,
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
      toast.error("Failed to fetch dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSkills}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalMessages}</div>
            {metrics.unreadMessages > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.unreadMessages} unread messages
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Coming Soon</div>
            <p className="text-xs text-muted-foreground mt-1">
              Analytics integration in progress
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 