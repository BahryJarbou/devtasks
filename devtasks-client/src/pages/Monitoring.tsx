import Layout from "../components/Layout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, Server, Cpu, Database, Wifi } from "lucide-react";

const latencyData = [
  { time: '00:00', latency: 45, load: 32 },
  { time: '04:00', latency: 42, load: 28 },
  { time: '08:00', latency: 89, load: 65 },
  { time: '12:00', latency: 110, load: 82 },
  { time: '16:00', latency: 75, load: 55 },
  { time: '20:00', latency: 50, load: 40 },
  { time: '24:00', latency: 48, load: 35 },
];

export default function Monitoring() {
  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-10 w-full max-w-7xl mx-auto space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-accent">
            <Activity className="w-5 h-5" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Realtime_Diagnostics</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="text-3xl font-bold font-mono tracking-tighter uppercase">Cluster_Monitoring</h1>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-mono font-bold rounded-sm border border-green-500/20">SYSTEM_UP</span>
              <span className="px-2 py-1 bg-accent/10 text-accent text-[10px] font-mono font-bold rounded-sm border border-accent/20">LOAD: NORMAL</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard icon={Server} label="Uptime" value="99.98%" sub="24d 12h 4m" />
          <MetricCard icon={Cpu} label="CPU Usage" value="42%" sub="avg / cluster" />
          <MetricCard icon={Database} label="DB Conn" value="124" sub="active pools" />
          <MetricCard icon={Wifi} label="Network" value="1.2 GB/s" sub="throughput" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-card border border-line rounded-sm space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase text-muted tracking-widest">Request_Latency::ms</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={latencyData}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#666', fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#666', fontFamily: 'monospace' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', fontSize: '12px', fontFamily: 'monospace' }}
                  />
                  <Area type="monotone" dataKey="latency" stroke="var(--color-accent)" fillOpacity={1} fill="url(#colorLatency)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 bg-card border border-line rounded-sm space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase text-muted tracking-widest">Resource_Load::percentage</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#666', fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#666', fontFamily: 'monospace' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', fontSize: '12px', fontFamily: 'monospace' }}
                  />
                  <Line type="stepAfter" dataKey="load" stroke="#666" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function MetricCard({ icon: Icon, label, value, sub }: { icon: React.ElementType, label: string, value: string, sub: string }) {
  return (
    <div className="p-4 bg-card border border-line rounded-sm space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-3 h-3 text-accent" />
        <span className="text-[10px] font-mono uppercase text-muted font-bold">{label}</span>
      </div>
      <div>
        <div className="text-xl font-bold font-mono tracking-tighter">{value}</div>
        <div className="text-[10px] font-mono text-muted uppercase opacity-60">{sub}</div>
      </div>
    </div>
  );
}
