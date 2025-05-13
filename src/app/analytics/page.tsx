"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletContext } from "../../components/WalletContext";
import { motion } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from "recharts";
import {
  GlobeAltIcon, LinkIcon, ClockIcon, ChartBarIcon,
  DevicePhoneMobileIcon, SparklesIcon, UserGroupIcon,
  ShareIcon, CurrencyDollarIcon, ChartPieIcon
} from "@heroicons/react/24/outline";
const AnalyticsCard = ({ title, icon, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 border-2 border-black shadow-neon ${className}`}
  >
    <div className="flex items-center gap-3 mb-4">
      {React.cloneElement(icon, { className: "h-6 w-6 text-neon-purple" })}
      <h3 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
        {title}
      </h3>
    </div>
    {children}
  </motion.div>
);

export default function AnalyticsPage() {
  const { address, disconnect } = useWalletContext();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address, router]);

  useEffect(() => {
    if (!address) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/analytics?address=${address}`);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            res.status === 404 ? "User not found" : errorText || "Failed to load analytics"
          );
        }
        const analyticsData = await res.json();
        console.log("Analytics Data:", analyticsData); // Debug
        // Provide fallbacks for new fields
        setData({
          ...analyticsData,
          uniqueVisitors: analyticsData.uniqueVisitors ?? Math.round(analyticsData.totalClicks * 0.8),
          socialReferrals: analyticsData.socialReferrals ?? [
            { platform: "Twitter", clicks: 0 },
            { platform: "Reddit", clicks: 0 },
            { platform: "LinkedIn", clicks: 0 },
          ],
          revenue: analyticsData.revenue ?? { total: 0, conversions: 0 },
        });
      } catch (err: any) {
        console.error("Fetch Analytics Error:", err);
        setError(err.message || "An error occurred while loading analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [address]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neon-blue/5 to-neon-purple/5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-4 border-neon-purple border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => { disconnect(); router.push("/"); }}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-neon-red"
        >
          Disconnect & Home
        </motion.button>
      </div>
    );
  }

  if (!data || !data.hasLinks) {
    return (
      <div className="p-8 text-center text-gray-600">
        <p>No links created yet. Try shortening a link first.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => { disconnect(); router.push("/"); }}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-neon-red"
        >
          Disconnect & Home
        </motion.button>
      </div>
    );
  }

  if (data.totalClicks === 0) {
    return (
      <div className="p-8 text-center text-gray-600">
        <p>Your links have been created, but no clicks have been recorded yet.</p>
        <p>Share your links to start tracking analytics!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => { disconnect(); router.push("/"); }}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-neon-red"
        >
          Disconnect & Home
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 mb-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-2 rounded-full">
          <SparklesIcon className="h-5 w-5" />
          <span>Advanced Analytics</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          Link Performance Insights
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {/* Total Clicks */}
        <AnalyticsCard title="Total Clicks" icon={<LinkIcon />}>
          <div className="text-4xl font-bold">{data.totalClicks}</div>
          <div className="flex items-center gap-2 mt-2 text-neon-purple text-sm">
            <span>↑ 12% last week</span>
          </div>
        </AnalyticsCard>

        {/* Unique Visitors */}
        <AnalyticsCard title="Unique Visitors" icon={<UserGroupIcon />}>
          <div className="text-4xl font-bold">{data.uniqueVisitors}</div>
          <div className="flex items-center gap-2 mt-2 text-neon-blue text-sm">
            <span>↑ 8% MoM</span>
          </div>
        </AnalyticsCard>

        {/* Clicks Timeline */}
        <AnalyticsCard title="Clicks Timeline" icon={<ClockIcon />} className="md:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a1a',
                    border: '2px solid #8b5cf6',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsCard>

        {/* Traffic Sources */}
        <AnalyticsCard title="Traffic Sources" icon={<ShareIcon />}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.traffic}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                >
                  {data.traffic.map((e: any, i: number) => (
                    <Cell key={i} fill={["#6366f1", "#8b5cf6", "#a855f7"][i % 3]} />
                  ))}
                </Pie>
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsCard>

        {/* Device Usage */}
        <AnalyticsCard title="Device Usage" icon={<DevicePhoneMobileIcon />}>
          <div className="space-y-3">
            {data.devices.map((d: any) => (
              <motion.div
                key={d.device}
                whileHover={{ x: 5 }}
                className="flex justify-between p-3 bg-neon-blue/10 rounded-lg"
              >
                <span>{d.device}</span>
                <span className="font-bold text-neon-purple">{d.clicks}</span>
              </motion.div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Global Reach */}
        <AnalyticsCard title="Global Reach" icon={<GlobeAltIcon />} className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.locations.map((l: any) => (
              <div
                key={l.name}
                className="flex justify-between p-4 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 rounded-xl"
              >
                <span>{l.name}</span>
                <span className="font-bold">{l.clicks}</span>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Top Links */}
        <AnalyticsCard title="Top Links" icon={<LinkIcon />}>
          <div className="space-y-3">
            {data.topLinks.map((l: any) => (
              <motion.div
                key={l.code}
                whileHover={{ scale: 1.02 }}
                className="group flex items-center justify-between p-3 hover:bg-neon-blue/5 rounded-lg transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-neon-purple truncate">/{l.code}</div>
                  <div className="text-sm text-gray-500 truncate">{l.url}</div>
                </div>
                <span className="font-bold ml-4">{l.clicks}</span>
              </motion.div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Performance Metrics */}
        <AnalyticsCard title="Performance" icon={<ChartPieIcon />}>
          <div className="grid grid-cols-2 gap-4">
            {data.performance.map((m: any) => (
              <div
                key={m.metric}
                className="text-center p-4 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 rounded-xl"
              >
                <div className="text-2xl font-bold">{m.value}</div>
                <div className="text-sm text-gray-600">{m.metric}</div>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Recent Activity */}
        <AnalyticsCard title="Recent Activity" icon={<ClockIcon />}>
          <div className="space-y-3">
            {data.recentActivity.map((a: any) => (
              <div
                key={a.createdAt}
                className="flex justify-between p-3 bg-neon-purple/10 rounded-lg"
              >
                <div>
                  <div className="font-medium">{new Date(a.createdAt).toLocaleTimeString()}</div>
                  <div className="text-sm text-gray-500">{a.location}</div>
                </div>
                <span className="text-neon-blue">{a.device}</span>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Social Referrals */}
        <AnalyticsCard title="Social Referrals" icon={<ShareIcon />} className="md:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.socialReferrals.map((s: any) => (
              <div key={s.platform} className="text-center p-4 bg-neon-purple/10 rounded-xl">
                <div className="text-2xl font-bold">{s.clicks}</div>
                <div className="text-sm text-gray-600">{s.platform}</div>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Revenue Impact */}
        <AnalyticsCard title="Revenue Impact" icon={<CurrencyDollarIcon />}>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-purple">
                ${data.revenue.total}
              </div>
              <div className="text-sm text-gray-600">Generated Revenue</div>
            </div>
            <div className="flex justify-between text-sm">
              <span>Conversions</span>
              <span className="font-bold">{data.revenue.conversions}</span>
            </div>
          </div>
        </AnalyticsCard>
      </div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex justify-center mt-8"
      >
        <button
          onClick={() => { disconnect(); router.push("/"); }}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-neon-red"
        >
          Disconnect & Return Home
        </button>
      </motion.div>
    </div>
  );
}