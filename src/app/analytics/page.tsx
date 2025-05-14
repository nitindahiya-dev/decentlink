// src/app/analytics/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletContext } from "../../components/WalletContext";
import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import AnalyticsGrid from "../../components/analytics/AnalyticsGrid";
import LoadingSpinner from "../../components/analytics/LoadingSpinner";
import ErrorMessage from "../../components/analytics/ErrorMessage";
import EmptyState from "../../components/analytics/EmptyState";
import DisconnectButton from "../../components/analytics/DisconnectButton";

interface AnalyticsData {
  totalClicks: number;
  hasLinks: boolean;
  uniqueVisitors: number;
  socialReferrals: { platform: string; clicks: number }[];
  revenue: { total: number; conversions: number };
  timeline: { day: string; count: number }[];
  traffic: { name: string; value: number }[];
  devices: { device: string; clicks: number }[];
  locations: { name: string; clicks: number }[];
  topLinks: { code: string; url: string; clicks: number }[];
  performance: { metric: string; value: number }[];
  recentActivity: { createdAt: string; location: string; device: string }[];
}

export default function AnalyticsPage() {
  const { address } = useWalletContext();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) router.push("/");
  }, [address, router]);

  useEffect(() => {
    if (!address) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/analytics?address=${address}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(res.status === 404 ? "User not found" : text);
        }
        const json = await res.json();

        setData({
          totalClicks: json.totalClicks || 0,
          hasLinks: json.hasLinks ?? false,
          uniqueVisitors: json.uniqueVisitors ?? Math.round((json.totalClicks || 0) * 0.8),
          socialReferrals: json.socialReferrals || [
            { platform: "Twitter", clicks: 0 },
            { platform: "Reddit", clicks: 0 },
            { platform: "LinkedIn", clicks: 0 },
          ],
          revenue: json.revenue || { total: 0, conversions: 0 },
          timeline: json.timeline || [],
          traffic: json.traffic || [],
          devices: json.devices || [],
          locations: json.locations || [],
          topLinks: json.topLinks || [],
          performance: json.performance || [],
          recentActivity: json.recentActivity || [],
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "An unknown error occurred while loading analytics");
        } else {
          setError("An unknown error occurred while loading analytics");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [address]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data || !data.hasLinks || data.totalClicks === 0) {
    return <EmptyState hasLinks={data?.hasLinks ?? false} totalClicks={data?.totalClicks ?? 0} />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <AnalyticsHeader />
      <AnalyticsGrid data={data} />
      <DisconnectButton />
    </div>
  );
}
