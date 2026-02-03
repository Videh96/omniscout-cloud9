
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell,
  PolarRadiusAxis
} from 'recharts';

interface ChartProps {
  data: any[];
}

/**
 * Custom Tooltip component following the OmniScout tactical aesthetic.
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const isRadar = payload[0].dataKey === 'A';
    const accentColor = isRadar ? '#ff00ff' : '#00d4ff';
    const glowClass = isRadar ? 'shadow-[0_0_20px_rgba(255,0,255,0.2)]' : 'shadow-[0_0_20px_rgba(0,212,255,0.2)]';
    
    return (
      <div className={`bg-black/90 border border-[${accentColor}] p-3 ${glowClass} backdrop-blur-md relative bracket-container`}>
        <div className="absolute top-0 left-0 w-full h-full striped-bg opacity-5 pointer-events-none"></div>
        <p className="text-[10px] font-black text-white mono uppercase mb-1 tracking-widest relative z-10">{`${label || payload[0].name || 'METRIC'}`}</p>
        <p className={`text-sm font-black mono relative z-10`} style={{ color: accentColor }}>
          {`VAL: `}
          <span className="text-white">{`${payload[0].value}`}</span>
          {payload[0].unit ? payload[0].unit : '/100'}
        </p>
        <div className="mt-2 h-[1px] w-full bg-white/10 relative z-10"></div>
        <p className="text-[8px] text-gray-500 mt-1 mono uppercase italic relative z-10">Data_Ingress_Confirmed</p>
      </div>
    );
  }
  return null;
};

export const RoundedBarChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full group/chart relative">
      <div className="absolute inset-0 bg-[#00d4ff]/5 opacity-0 group-hover/chart:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold', fontFamily: 'JetBrains Mono' }} 
            dy={10}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0, 212, 255, 0.05)' }}
            content={<CustomTooltip />}
            animationDuration={200}
          />
          <Bar 
            dataKey="val" 
            radius={[2, 2, 0, 0]} 
            barSize={30}
            className="transition-all duration-300"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.active ? '#00d4ff' : '#1e1e2d'} 
                className="hover:brightness-125 hover:filter hover:drop-shadow-[0_0_12px_rgba(0,212,255,0.5)] transition-all cursor-crosshair"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const StrategyRadar: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full group/radar relative">
      <div className="absolute inset-0 bg-[#ff00ff]/5 opacity-0 group-hover/radar:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#1e1e2d" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="subject" 
            stroke="#475569" 
            fontSize={10} 
            tick={{ fontFamily: 'JetBrains Mono', fontWeight: 'bold' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} animationDuration={200} />
          <Radar
            name="ENTITY_SIG"
            dataKey="A"
            stroke="#ff00ff"
            fill="#ff00ff"
            fillOpacity={0.2}
            className="transition-all duration-500 hover:fill-opacity-40 cursor-crosshair"
            dot={{ r: 3, fill: '#ff00ff', fillOpacity: 0.8, strokeWidth: 1, stroke: '#0a0a0f' }}
            activeDot={{ r: 5, fill: '#ff00ff', stroke: '#fff', strokeWidth: 2, className: 'flicker' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
