"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletContext } from "../../components/WalletContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

interface RecentLink {
  shortCode: string;
  longUrl: string;
  clicks: number;
  createdAt: string;
}

interface AnalyticsData {
  totalUrls: number;
  totalClicks: number;
  averageClicks: number;
  recentLinks: RecentLink[];
}

export default function AnalyticsPage() {
  const { address, disconnect } = useWalletContext();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);

  // Redirect to home if wallet disconnected
  useEffect(() => {
    if (!address) router.push("/");
  }, [address]);

  // Fetch analytics when connected
  useEffect(() => {
    if (!address) return;
    fetch(`/api/analytics?address=${address}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [address]);

  if (!data) {
    return <p className="p-8 text-center">Loading analytics…</p>;
  }

  const chartData = data.recentLinks.map((l) => ({
    name: l.shortCode,
    clicks: l.clicks,
  }));

  return (
    <div className="space-y-6 p-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total URLs</CardTitle>
          </CardHeader>
          <CardContent>{data.totalUrls}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>{data.totalClicks}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Clicks/URL</CardTitle>
          </CardHeader>
          <CardContent>{data.averageClicks}</CardContent>
        </Card>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Recent Links</h2>
        <ul className="space-y-2">
          {data.recentLinks.map((l) => (
            <li key={l.shortCode} className="border p-2 rounded">
              <p>
                <strong>{l.shortCode}</strong> → {l.longUrl}
              </p>
              <p>
                Clicks: {l.clicks} | Created:{" "}
                {new Date(l.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Clicks Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="clicks" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button
        onClick={() => {
          disconnect();
          router.push("/");
        }}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Disconnect & Home
      </button>
    </div>
  );
}
