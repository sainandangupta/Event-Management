'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  DollarSign,
  Calendar,
  Heart,
  Hotel,
  TrendingUp,
  Brain,
  ArrowRight,
  Sparkles,
  FileText
} from 'lucide-react';
import { useEventManagementStore } from '../modules/event-management/services/store';

// Mock charts data
const revenueData = [
  { name: 'Jan', revenue: 4.2 },
  { name: 'Mar', revenue: 5.8 },
  { name: 'May', revenue: 7.5 },
  { name: 'Jul', revenue: 9.1 },
  { name: 'Sep', revenue: 10.8 },
  { name: 'Nov', revenue: 12.4 }
];

const bookingMixData = [
  { name: 'Weddings', value: 45, color: '#fed88e' },
  { name: 'Corporate', value: 35, color: '#a88ede' },
  { name: 'Hotels', value: 20, color: '#4CAF8D' }
];

export default function WorkspaceDashboard() {
  const { events, activeRole } = useEventManagementStore();

  // Filter events to count stats
  const activeEventsCount = events.filter((e) => e.status === 'In Progress').length || 48;
  const totalEventsCount = events.length;

  return (
    <div>
      {/* Header Welcome Section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-hanken text-headline-lg font-bold text-on-surface">
            Executive Overview
          </h2>
          <p className="text-body-lg text-on-surface-variant">
            Welcome back, Alexander. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-secondary text-secondary font-semibold hover:bg-secondary-container/10 transition-all cursor-pointer text-label-md">
            Generate Report
          </button>
          <button className="px-5 py-2.5 rounded-xl btn-gradient text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform cursor-pointer text-label-md">
            New Booking
          </button>
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Card 1: Total Revenue */}
        <div className="bg-surface-container-lowest p-6 rounded-card soft-shadow border border-border-gray">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <DollarSign size={20} />
            </div>
            <span className="text-emerald-green font-bold text-label-sm">+12.5%</span>
          </div>
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
            Total Revenue
          </p>
          <h3 className="font-hanken text-headline-md font-bold text-on-surface">$12.4M</h3>
        </div>

        {/* Card 2: Active Events */}
        <div className="bg-surface-container-lowest p-6 rounded-card soft-shadow border border-border-gray">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-secondary-container/30 text-secondary">
              <Calendar size={20} />
            </div>
            <span className="text-emerald-green font-bold text-label-sm">+{totalEventsCount}</span>
          </div>
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
            Active Events
          </p>
          <h3 className="font-hanken text-headline-md font-bold text-on-surface">{activeEventsCount + 46}</h3>
        </div>

        {/* Card 3: Upcoming Weddings */}
        <div className="bg-surface-container-lowest p-6 rounded-card soft-shadow border border-border-gray">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-tertiary-container/30 text-tertiary">
              <Heart size={20} />
            </div>
            <span className="text-on-surface-variant font-bold text-label-sm">High Priority</span>
          </div>
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
            Upcoming Weddings
          </p>
          <h3 className="font-hanken text-headline-md font-bold text-on-surface">12</h3>
        </div>

        {/* Card 4: Hotel Occupancy */}
        <div className="bg-surface-container-lowest p-6 rounded-card soft-shadow border border-border-gray">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-emerald-green/10 text-emerald-green">
              <Hotel size={20} />
            </div>
            <span className="text-emerald-green font-bold text-label-sm">Peak Season</span>
          </div>
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
            Hotel Occupancy
          </p>
          <h3 className="font-hanken text-headline-md font-bold text-on-surface">92%</h3>
        </div>
      </div>

      {/* KPI Row 2 - Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Leads Pipeline */}
        <div className="bg-surface-container-lowest p-6 rounded-card soft-shadow border border-border-gray">
          <p className="text-label-sm text-on-surface-variant mb-1 font-semibold">Leads Pipeline</p>
          <h3 className="font-hanken text-headline-md font-bold text-on-surface">156</h3>
          <div className="mt-4 h-1.5 w-full bg-background-alt rounded-full overflow-hidden">
            <div className="h-full bg-primary-container w-[75%] rounded-full"></div>
          </div>
        </div>

        {/* Vendor Utilization */}
        <div className="bg-surface-container-lowest p-6 rounded-card soft-shadow border border-border-gray">
          <p className="text-label-sm text-on-surface-variant mb-1 font-semibold">Vendor Utilization</p>
          <h3 className="font-hanken text-headline-md font-bold text-on-surface">78%</h3>
          <div className="mt-4 h-1.5 w-full bg-background-alt rounded-full overflow-hidden">
            <div className="h-full bg-secondary w-[78%] rounded-full"></div>
          </div>
        </div>

        {/* Outstanding Payments */}
        <div className="bg-surface-container-lowest p-6 rounded-card soft-shadow border border-border-gray">
          <p className="text-label-sm text-on-surface-variant mb-1 font-semibold">Outstanding Payments</p>
          <h3 className="font-hanken text-headline-md font-bold text-on-surface">$45k</h3>
          <p className="text-label-sm text-error font-medium mt-2">12 Overdue</p>
        </div>

        {/* Profit Margin */}
        <div className="bg-surface-container-lowest p-6 rounded-card soft-shadow border border-border-gray">
          <p className="text-label-sm text-on-surface-variant mb-1 font-semibold">Profit Margin</p>
          <h3 className="font-hanken text-headline-md font-bold text-on-surface">24%</h3>
          <p className="text-label-sm text-emerald-green font-medium mt-2">+2.4% vs LY</p>
        </div>
      </div>

      {/* Central Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Revenue Growth Trend Area Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-card soft-shadow border border-border-gray relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="font-hanken text-headline-md font-bold text-on-surface">
                Revenue Growth
              </h4>
              <p className="text-body-sm text-on-surface-variant">
                Annualized projected revenue trend ($ Millions)
              </p>
            </div>
            <div className="flex bg-background-alt p-1 rounded-lg">
              <button className="px-3 py-1 text-label-sm font-semibold rounded-md bg-white shadow-sm cursor-pointer">
                Yearly
              </button>
              <button className="px-3 py-1 text-label-sm font-semibold text-on-surface-variant cursor-pointer">
                Monthly
              </button>
            </div>
          </div>
          {/* Chart Wrapper */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: '12px', fill: '#584140' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: '12px', fill: '#584140' }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#ae2f34" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Mix Donut Chart */}
        <div className="bg-surface-container-lowest p-8 rounded-card soft-shadow border border-border-gray">
          <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-2">
            Booking Mix
          </h4>
          <p className="text-body-sm text-on-surface-variant mb-6">
            Revenue share by event category
          </p>
          <div className="relative h-44 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingMixData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bookingMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-headline-md font-bold text-on-surface">100%</span>
              <span className="text-label-sm text-on-surface-variant font-medium">Capacity</span>
            </div>
          </div>
          {/* Legend */}
          <div className="space-y-2.5">
            {bookingMixData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  <span className="text-label-md text-on-surface">{entry.name}</span>
                </div>
                <span className="text-label-md font-bold text-on-surface">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Grid Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Upcoming Premium Events List */}
        <div className="bg-surface-container-lowest p-8 rounded-card soft-shadow border border-border-gray h-full">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-hanken text-headline-md font-bold text-on-surface">
              Upcoming Premium
            </h4>
            <button className="text-primary text-label-md font-bold hover:underline cursor-pointer">
              View All
            </button>
          </div>
          <div className="space-y-6">
            {/* Item 1 */}
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
                <img
                  alt="Gala Event"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB13Z3PkQIOlDsfVuci2HdCQPiFdiIqJSOvnSGoJ0HxmB61Vn4BlW8AnXOnZsX6aGT6cVtHXRyYkmcSkiJEzHLmtzE9WNFmzH3l7hYZq_qN-ocYr3K5jsMeonDhb9ZusPYKVOzu78vByJcFhLdAhZ2VYzPEImfIB3j6eWeBr29es5RmWqxPq_nMQUbaZT5qxaK5dHgi695rmSbZ-fazWDJYBTEh0IfMiuTzB1iLTf6_QlrUSo-v7MlS-iV8jlkaGY75qR5m7t0urW4H"
                />
              </div>
              <div className="flex-1">
                <p className="text-label-sm text-primary font-bold mb-1">Nov 12, 2024</p>
                <h5 className="text-label-md font-bold text-on-surface group-hover:text-primary transition-colors">
                  The Diamond Gala
                </h5>
                <p className="text-body-sm text-on-surface-variant">Ritz-Carlton Ballroom</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
                <img
                  alt="Wedding Decor"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZZmdQ6mvdyT6o8WXjL779yNpPItC0V--kH3z-AkSztFOJeFAmUalsoMQzBqUO-J2hiwlofIfCZQtqCMF9re2dskMZGkuh5cIbriLjARCmmGji7m-bC8QTHpg4slwgJIDJIUTvLp4XjiuDIho8J821eMcJiULDMbibLs6fecvEyzKeT1PsxPPJ6kCjHYh41dptgjDBNqEIviz9mkyZALTc4vs9zfRWena2-lwCeJQfyU3iAeQrYVmhfJ2d3AKOYQTWLucxuaqmn4tD"
                />
              </div>
              <div className="flex-1">
                <p className="text-label-sm text-primary font-bold mb-1">Dec 05, 2024</p>
                <h5 className="text-label-md font-bold text-on-surface group-hover:text-primary transition-colors">
                  Aria & Julian Wedding
                </h5>
                <p className="text-body-sm text-on-surface-variant">Fairmont Estates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-surface-container-lowest p-8 rounded-card soft-shadow border border-border-gray h-full">
          <h4 className="font-hanken text-headline-md font-bold text-on-surface mb-6">
            Recent Bookings
          </h4>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="border-b border-border-gray">
                <tr>
                  <th className="pb-3 text-label-sm text-on-surface-variant font-medium uppercase tracking-wider">
                    Client
                  </th>
                  <th className="pb-3 text-label-sm text-on-surface-variant font-medium uppercase tracking-wider">
                    Value
                  </th>
                  <th className="pb-3 text-label-sm text-on-surface-variant font-medium uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-gray">
                <tr>
                  <td className="py-4">
                    <p className="text-label-md font-bold text-on-surface">TechCorp Global</p>
                    <p className="text-[11px] text-on-surface-variant font-medium">Summit 2025</p>
                  </td>
                  <td className="py-4 text-label-md text-on-surface font-semibold">$85,000</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-emerald-green/10 text-emerald-green text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Confirmed
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4">
                    <p className="text-label-md font-bold text-on-surface">Sofia Ricci</p>
                    <p className="text-[11px] text-on-surface-variant font-medium">Milestone 40th</p>
                  </td>
                  <td className="py-4 text-label-md text-on-surface font-semibold">$12,400</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-secondary-container/30 text-secondary text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Pending
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: AI Recommendations & Tasks */}
        <div className="space-y-8">
          {/* Glassmorphic AI Card */}
          <div className="glass-card p-6 rounded-card soft-shadow coral-gradient text-white border-none relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={22} className="text-white fill-white" />
              <h4 className="font-hanken text-[18px] font-bold">AI Insights</h4>
            </div>
            <p className="text-body-sm mb-6 leading-relaxed opacity-90 text-[14px]">
              Based on current hotel occupancy (92%), you could increase profit margin by 3.2% by bundle-pricing the upcoming Corporate Summit with hotel suites.
            </p>
            <button className="w-full py-2.5 bg-white text-primary font-bold rounded-xl hover:bg-opacity-95 transition-all text-label-md flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-98">
              <span>Apply Strategy</span>
              <Sparkles size={14} className="text-primary fill-primary" />
            </button>
          </div>

          {/* Today's Tasks Progress */}
          <div className="bg-surface-container-lowest p-6 rounded-card soft-shadow border border-border-gray">
            <h4 className="font-sans text-label-md font-bold text-on-surface mb-4">
              Today&apos;s Priorities
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-label-sm mb-2 text-on-surface font-medium">
                  <span>Vendor Contract Review</span>
                  <span className="font-bold">85%</span>
                </div>
                <div className="h-1.5 w-full bg-background-alt rounded-full">
                  <div className="h-full bg-secondary-container w-[85%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-label-sm mb-2 text-on-surface font-medium">
                  <span>Venue Walkthrough (Aria)</span>
                  <span className="font-bold">20%</span>
                </div>
                <div className="h-1.5 w-full bg-background-alt rounded-full">
                  <div className="h-full bg-primary-container w-[20%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
