import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, DollarSign, Activity, Globe, ShieldCheck } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { Link } from 'react-router-dom';

export const StockMarketPage = () => {
  const { markets } = useNews();
  const [selectedExchange, setSelectedExchange] = useState('NSE');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [activeIndexId, setActiveIndexId] = useState('nifty50');

  const defaultMarkets = {
    indianIndices: [
      {
        id: 'nifty50',
        symbol: '^NSEI',
        name: 'NIFTY 50',
        current: 25890.45,
        change: 182.35,
        percentChange: 0.71,
        high: 25940.10,
        low: 25710.20,
        volume: '3.84B',
        history: {
          '1D': [{ time: '09:15', value: 25720 }, { time: '11:45', value: 25810 }, { time: '13:00', value: 25790 }, { time: '15:30', value: 25890.45 }],
          '1W': [{ time: 'Mon', value: 25510 }, { time: 'Tue', value: 25620 }, { time: 'Wed', value: 25580 }, { time: 'Fri', value: 25890.45 }],
          '1M': [{ time: 'W1', value: 25100 }, { time: 'W2', value: 25350 }, { time: 'W3', value: 25600 }, { time: 'W4', value: 25890.45 }],
          '1Y': [{ time: 'Q1', value: 22100 }, { time: 'Q2', value: 23400 }, { time: 'Q3', value: 24800 }, { time: 'Q4', value: 25890.45 }]
        }
      },
      {
        id: 'sensex',
        symbol: '^BSESN',
        name: 'BSE SENSEX',
        current: 84920.80,
        change: 590.25,
        percentChange: 0.70,
        high: 85100.50,
        low: 84350.10,
        volume: '1.92B'
      },
      {
        id: 'banknifty',
        symbol: '^NSEBANK',
        name: 'BANK NIFTY',
        current: 54210.15,
        change: 412.60,
        percentChange: 0.77,
        high: 54380.00,
        low: 53820.50,
        volume: '2.14B'
      }
    ],
    globalIndices: [
      {
        id: 'nasdaq',
        symbol: '^IXIC',
        name: 'NASDAQ Composite',
        current: 19845.20,
        change: 195.40,
        percentChange: 0.99,
        high: 19910.00,
        low: 19720.10,
        volume: '5.12B'
      },
      {
        id: 'sp500',
        symbol: '^GSPC',
        name: 'S&P 500',
        current: 5980.60,
        change: 38.20,
        percentChange: 0.64,
        high: 5995.00,
        low: 5950.00,
        volume: '4.20B'
      },
      {
        id: 'dowjones',
        symbol: '^DJI',
        name: 'DOW JONES Industrial',
        current: 43810.15,
        change: 145.80,
        percentChange: 0.33,
        high: 43900.00,
        low: 43680.00,
        volume: '3.40B'
      }
    ],
    topGainers: [
      { symbol: 'TATASTEEL', name: 'Tata Steel', price: 168.40, percent: 5.12 },
      { symbol: 'NVDA', name: 'NVIDIA Corp', price: 142.80, percent: 4.73 },
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1620.00, percent: 3.95 },
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2980.50, percent: 2.84 }
    ],
    topLosers: [
      { symbol: 'TITAN', name: 'Titan Company', price: 3280.00, percent: -2.15 },
      { symbol: 'TSLA', name: 'Tesla Inc', price: 284.10, percent: -2.03 },
      { symbol: 'INFY', name: 'Infosys Ltd', price: 1840.00, percent: -1.72 }
    ]
  };

  const data = markets || defaultMarkets;
  const allIndices = [...(data.indianIndices || []), ...(data.globalIndices || [])];
  const activeIndex = allIndices.find((i) => i.id === activeIndexId) || allIndices[0];

  const chartData = activeIndex?.history?.[selectedTimeframe] || [
    { time: '09:15', value: 25720 },
    { time: '11:45', value: 25810 },
    { time: '13:00', value: 25790 },
    { time: '15:30', value: 25890.45 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Terminal Header */}
      <div className="pb-6 border-b border-[#ded5c2] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#946638] uppercase tracking-widest mb-1.5 font-bold">
            <Activity className="w-4 h-4 text-[#946638]" />
            <span>Financial Intelligence Terminal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1917]">
            Global Market Exchanges & Currencies
          </h1>
          <p className="text-xs text-[#574f45] mt-1">
            Real-time index movements, tick volumes, and institutional financial telemetry.
          </p>
        </div>

        {/* Live status badge */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>DALAL STREET & WALL STREET: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Terminal Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Big Interactive Chart & Indices Selection */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Index Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allIndices.slice(0, 6).map((idx) => {
              const isSelected = idx.id === activeIndexId;
              const isPositive = idx.change >= 0;
              return (
                <div
                  key={idx.id}
                  onClick={() => setActiveIndexId(idx.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#946638] shadow-md ring-1 ring-[#946638]'
                      : 'bg-white border-[#ded5c2] hover:border-[#bda588]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1c1917]">{idx.name}</span>
                    {isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                    )}
                  </div>
                  <p className="text-lg font-bold font-mono text-[#1c1917] mt-1">
                    {idx.current?.toLocaleString()}
                  </p>
                  <span className={`text-[11px] font-mono font-bold ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {isPositive ? `+${idx.percentChange}%` : `${idx.percentChange}%`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Interactive Chart Container */}
          <div className="bg-white rounded-3xl p-6 border border-[#ded5c2] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#ded5c2] gap-2">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1c1917]">
                  {activeIndex?.name} ({activeIndex?.symbol})
                </h3>
                <span className="text-xs text-[#786f63] font-mono">
                  Volume: {activeIndex?.volume || '3.5B'} • High: {activeIndex?.high || 25900} • Low: {activeIndex?.low || 25700}
                </span>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center space-x-1 bg-[#ede5d6] p-1 rounded-xl border border-[#ded5c2]">
                {['1D', '1W', '1M', '1Y'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      selectedTimeframe === tf
                        ? 'bg-white text-[#1c1917] shadow-sm'
                        : 'text-[#574f45] hover:text-[#1c1917]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="warmCamelMarketGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#946638" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#946638" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#b5a996" tick={{ fontSize: 11, fill: '#786f63' }} />
                  <YAxis stroke="#b5a996" domain={['dataMin - 50', 'dataMax + 50']} tick={{ fontSize: 11, fill: '#786f63' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#ded5c2',
                      borderRadius: '0.75rem',
                      color: '#1c1917',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#946638"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#warmCamelMarketGradient2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column: Gainers, Losers, Currency Matrix */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Top Gainers */}
          <div className="bg-white rounded-3xl p-6 border border-[#ded5c2] shadow-sm">
            <h3 className="font-serif text-base font-bold text-[#1c1917] mb-4">
              Top Equities Gainers
            </h3>
            <div className="space-y-3">
              {data.topGainers?.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-2xl bg-[#faf7f2] border border-[#ded5c2] text-xs">
                  <div>
                    <span className="font-bold text-[#1c1917]">{stock.symbol}</span>
                    <p className="text-[10px] text-[#786f63]">{stock.name}</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[#1c1917] font-semibold">₹{stock.price}</span>
                    <span className="text-emerald-700 text-[10px] block font-bold">+{stock.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="bg-white rounded-3xl p-6 border border-[#ded5c2] shadow-sm">
            <h3 className="font-serif text-base font-bold text-[#1c1917] mb-4">
              Top Equities Decliners
            </h3>
            <div className="space-y-3">
              {data.topLosers?.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-2xl bg-[#faf7f2] border border-[#ded5c2] text-xs">
                  <div>
                    <span className="font-bold text-[#1c1917]">{stock.symbol}</span>
                    <p className="text-[10px] text-[#786f63]">{stock.name}</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[#1c1917] font-semibold">₹{stock.price}</span>
                    <span className="text-rose-700 text-[10px] block font-bold">{stock.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Currency Matrix */}
          <div className="bg-white rounded-3xl p-6 border border-[#ded5c2] shadow-sm">
            <h3 className="font-serif text-base font-bold text-[#1c1917] mb-4">
              Forex Rates
            </h3>
            <div className="space-y-2 text-xs">
              {data.currencies?.map((curr) => (
                <div key={curr.symbol} className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf7f2] border border-[#ded5c2]">
                  <span className="font-bold text-[#1c1917]">{curr.symbol}</span>
                  <div className="text-right font-mono">
                    <span className="text-[#1c1917]">{curr.rate}</span>
                    <span className={`text-[10px] ml-2 font-bold ${curr.percent >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {curr.percent >= 0 ? `+${curr.percent}%` : `${curr.percent}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
