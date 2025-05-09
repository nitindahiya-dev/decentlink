"use client";

import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { ArrowUpIcon, ArrowDownIcon, UsersIcon, GlobeAltIcon, ChartBarIcon } from "@heroicons/react/24/outline";


export default function AnalyticsPage() {
  const [shortenedUrls, ] = useState([]);



  const activityData = shortenedUrls.map((url) => ({
    date: new Date(url.createdAt).toLocaleDateString(),
    visits: url.clicks,
  }));

  const linkClicks = shortenedUrls.map((url) => ({
    link: url.shortCode,
    clicks: url.clicks,
  }));

  const referrals = [
    { name: "Social Media", value: 400 },
    { name: "Email", value: 300 },
    { name: "Direct", value: 200 },
    { name: "Search", value: 100 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Analytics Dashboard for User
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow-md p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-secondary" /> Total URLs
              </h2>
              <p className="text-2xl font-bold mt-2 text-primary">{shortenedUrls.length}</p>
            </div>
            <span className="text-success flex items-center text-sm">
              <ArrowUpIcon className="w-4 h-4 mr-1" /> 12%
            </span>
          </div>
        </div>
        <div className="bg-white shadow-md p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <GlobeAltIcon className="w-5 h-5 text-secondary" /> Total Clicks
              </h2>
              <p className="text-2xl font-bold mt-2 text-primary">
                {shortenedUrls.reduce((sum, url) => sum + url.clicks, 0)}
              </p>
            </div>
            <span className="text-red-500 flex items-center text-sm">
              <ArrowDownIcon className="w-4 h-4 mr-1" /> 3%
            </span>
          </div>
        </div>
        <div className="bg-white shadow-md p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-secondary" /> Average Clicks
              </h2>
              <p className="text-2xl font-bold mt-2 text-primary">
                {shortenedUrls.length ? Math.round(shortenedUrls.reduce((sum, url) => sum + url.clicks, 0) / shortenedUrls.length) : 0}
              </p>
            </div>
            <span className="text-success flex items-center text-sm">
              <ArrowUpIcon className="w-4 h-4 mr-1" /> 8%
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-md p-4 rounded-lg mb-8">
        <h2 className="text-xl font-bold text-primary mb-4">URL Activity</h2>
        <div className="h-64">
          <LineChart
            width={typeof window !== "undefined" && window.innerWidth > 768 ? 900 : 300}
            height={250}
            data={activityData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="visits" stroke="#A76545" strokeWidth={2} />
          </LineChart>
        </div>
      </div>
      
      <div className="bg-white shadow-md p-4 rounded-lg mb-8">
        <h2 className="text-xl font-bold text-primary mb-4">Top Links</h2>
        <BarChart
          width={typeof window !== "undefined" && window.innerWidth > 768 ? 900 : 300}
          height={250}
          data={linkClicks}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="link" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="clicks" fill="#A76545" />
        </BarChart>
      </div>
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl font-bold text-primary mb-4">Referral Sources</h2>
        <div className="flex justify-center">
          <PieChart width={400} height={300}>
            <Pie
              data={referrals}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {referrals.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={["#A76545", "#FFA55D", "#FFDF88", "#ACC572"][index]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}