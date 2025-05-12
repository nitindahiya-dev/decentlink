"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { GlobeAltIcon, LinkIcon, ClockIcon, ChartBarIcon, DevicePhoneMobileIcon, SparklesIcon } from "@heroicons/react/24/outline";

const AnalyticsCard = ({ title, icon, children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border-2 border-black shadow-neon"
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
  const data = {
    totalClicks: 2450,
    timeline: [
      { date: 'Mon', clicks: 400 },
      { date: 'Tue', clicks: 600 },
      { date: 'Wed', clicks: 300 },
      { date: 'Thu', clicks: 800 },
      { date: 'Fri', clicks: 500 },
    ],
    trafficSources: [
      { name: 'Direct', value: 45, color: '#6366f1' },
      { name: 'Social', value: 30, color: '#8b5cf6' },
      { name: 'Email', value: 25, color: '#a855f7' },
    ],
    devices: [
      { device: 'Mobile', clicks: 1200 },
      { device: 'Desktop', clicks: 900 },
      { device: 'Tablet', clicks: 350 },
    ],
    locations: [
      { name: 'North America', clicks: 1500 },
      { name: 'Europe', clicks: 650 },
      { name: 'Asia', clicks: 300 },
    ],
    topLinks: [
      { code: 'x8kTp', clicks: 450, url: 'https://example.com/long-url' },
      { code: 'y3mQr', clicks: 320, url: 'https://another-example.com' },
    ],
    performance: [
      { metric: 'Uptime', value: '99.99%' },
      { metric: 'Avg. Response', value: '0.4s' },
      { metric: 'Security', value: 'A+' },
    ],
    recentActivity: [
      { time: '14:32', location: 'New York', device: 'Mobile' },
      { time: '14:35', location: 'London', device: 'Desktop' },
    ]
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 mb-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-2 rounded-full">
          <SparklesIcon className="h-5 w-5" />
          <span>Advanced Analytics</span>
        </div>
        <h1 className="text-5xl font-bold">Link Performance Insights</h1>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Total Clicks */}
        <AnalyticsCard title="Total Clicks" icon={<LinkIcon />}>
          <div className="text-4xl font-bold">{data.totalClicks.toLocaleString()}</div>
          <div className="flex items-center gap-2 mt-2 text-neon-purple">
            <span className="text-sm">↑ 12% last week</span>
          </div>
        </AnalyticsCard>

        {/* Timeline Chart */}
        <AnalyticsCard title="Clicks Timeline" icon={<ClockIcon />} className="md:col-span-2">
          <div className="h-48">
            <LineChart width={500} height={200} data={data.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#8b5cf6" 
                strokeWidth={2}
              />
            </LineChart>
          </div>
        </AnalyticsCard>

        {/* Traffic Sources */}
        <AnalyticsCard title="Traffic Sources" icon={<ChartBarIcon />}>
          <div className="h-48">
            <PieChart width={300} height={200}>
              <Pie
                data={data.trafficSources}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
              >
                {data.trafficSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </div>
        </AnalyticsCard>

        {/* Device Breakdown */}
        <AnalyticsCard title="Device Usage" icon={<DevicePhoneMobileIcon />}>
          <div className="space-y-3">
            {data.devices.map((device, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-neon-blue/10 rounded-lg">
                <span>{device.device}</span>
                <span className="font-bold text-neon-purple">{device.clicks}</span>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Geographic Distribution */}
        <AnalyticsCard title="Global Reach" icon={<GlobeAltIcon />} className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.locations.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 rounded-xl">
                <span>{location.name}</span>
                <span className="text-xl font-bold">{location.clicks}</span>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Top Links */}
        <AnalyticsCard title="Top Links" icon={<LinkIcon />}>
          <div className="space-y-3">
            {data.topLinks.map((link, index) => (
              <div key={index} className="group flex items-center justify-between p-3 hover:bg-neon-blue/5 rounded-lg transition-colors">
                <div>
                  <div className="font-mono text-neon-purple">/{link.code}</div>
                  <div className="text-sm text-gray-500 truncate">{link.url}</div>
                </div>
                <span className="font-bold">{link.clicks}</span>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Performance Metrics */}
        <AnalyticsCard title="Performance" icon={<SparklesIcon />}>
          <div className="grid grid-cols-2 gap-4">
            {data.performance.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 rounded-xl">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.metric}</div>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Recent Activity */}
        <AnalyticsCard title="Recent Activity" icon={<ClockIcon />}>
          <div className="space-y-3">
            {data.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neon-purple/10 rounded-lg">
                <div>
                  <div className="font-medium">{activity.time}</div>
                  <div className="text-sm text-gray-500">{activity.location}</div>
                </div>
                <span className="text-neon-blue">{activity.device}</span>
              </div>
            ))}
          </div>
        </AnalyticsCard>
      </div>
    </div>
  );
}