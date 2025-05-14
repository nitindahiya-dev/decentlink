"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from "recharts";
import {
  GlobeAltIcon, LinkIcon, ClockIcon, ShareIcon,
  DevicePhoneMobileIcon, UserGroupIcon, ChartPieIcon, CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import AnalyticsCard from "./AnalyticsCard";

// Define types for data structure
interface TimelineEntry {
  day: string;
  count: number;
}

interface TrafficSource {
  name: string;
  value: number;
}

interface Device {
  device: string;
  clicks: number;
}

interface Location {
  name: string;
  clicks: number;
}

interface TopLink {
  code: string;
  url: string;
  clicks: number;
}

interface PerformanceMetric {
  metric: string;
  value: number;
}

interface RecentActivity {
  createdAt: string;
  location: string;
  device: string;
}

interface SocialReferral {
  platform: string;
  clicks: number;
}

interface Revenue {
  total: number;
  conversions: number;
}

interface AnalyticsData {
  totalClicks: number;
  uniqueVisitors: number;
  timeline: TimelineEntry[];
  traffic: TrafficSource[];
  devices: Device[];
  locations: Location[];
  topLinks: TopLink[];
  performance: PerformanceMetric[];
  recentActivity: RecentActivity[];
  socialReferrals: SocialReferral[];
  revenue: Revenue;
}

const COLORS = ["#6366f1", "#8b5cf6", "#a855f7"];

export default function AnalyticsGrid({ data }: { data: AnalyticsData }) {
  return (
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
      {/* Referral */}
      <AnalyticsCard title="Referral" icon={<UserGroupIcon />}>
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
                  background: "#1a1a1a",
                  border: "2px solid #8b5cf6",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
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
                {data.traffic.map((entry: TrafficSource, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsCard>

      {/* Device Usage */}
      <AnalyticsCard title="Device Usage" icon={<DevicePhoneMobileIcon />}>
        <div className="space-y-3">
          {data.devices.map((d: Device) => (
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
          {data.locations.map((l: Location) => (
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
          {data.topLinks.map((l: TopLink) => (
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
          {data.performance.map((m: PerformanceMetric) => (
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
          {data.recentActivity.map((a: RecentActivity) => (
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
          {data.socialReferrals.map((s: SocialReferral) => (
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
            <div className="text-3xl font-bold text-neon-purple">${data.revenue.total}</div>
            <div className="text-sm text-gray-600">Generated Revenue</div>
          </div>
          <div className="flex justify-between text-sm">
            <span>Conversions</span>
            <span className="font-bold">{data.revenue.conversions}</span>
          </div>
        </div>
      </AnalyticsCard>
    </div>
  );
}
