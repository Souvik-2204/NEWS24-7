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
        volume: '1.25B'
      }
    ],
    indianStocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: 3045.20, change: 24.80, percent: 0.82, pe: 26.4 },
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4280.50, change: 58.10, percent: 1.38, pe: 31.2 },
      { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1785.40, change: 18.25, percent: 1.03, pe: 19.8 },
      { symbol: 'INFY', name: 'Infosys Ltd', price: 1920.10, change: -12.40, percent: -0.64, pe: 28.5 },
      { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', price: 1310.75, change: 14.50, percent: 1.12, pe: 18.2 }
    ],
    globalIndices: [
      {
        id: 'nasdaq',
        symbol: '^IXIC',
        name: 'NASDAQ Composite',
        region: 'USA',
        current: 19845.20,
        change: 195.40,
        percentChange: 0.99,
        high: 19910.00,
        low: 19680.50
      },
      {
        id: 'sp500',
        symbol: '^GSPC',
        name: 'S&P 500',
        region: 'USA',
        current: 5980.60,
        change: 38.20,
        percentChange: 0.64,
        high: 5995.00,
        low: 5945.10
      },
      {
        id: 'dowjones',
        symbol: '^DJI',
        name: 'DOW JONES',
        region: 'USA',
        current: 43810.15,
        change: 145.80,
        percentChange: 0.33,
        high: 43920.00,
        low: 43680.00
      },
      { id: 'ftse100', symbol: '^FTSE', name: 'FTSE 100', region: 'UK', current: 8415.50, change: 32.10, percentChange: 0.38 },
      { id: 'dax', symbol: '^GDAXI', name: 'DAX 40', region: 'Germany', current: 19480.90, change: 112.40, percentChange: 0.58 },
      { id: 'nikkei225', symbol: '^N225', name: 'NIKKEI 225', region: 'Japan', current: 39120.40, change: 240.60, percentChange: 0.62 }
    ],
    currencies: [
      { symbol: 'USD/INR', rate: 86.82, percent: -0.16 },
      { symbol: 'EUR/INR', rate: 91.45, percent: +0.31 },
      { symbol: 'GBP/INR', rate: 109.12, percent: +0.41 }
    ],
    topGainers: [
      { symbol: 'TATASTEEL', name: 'Tata Steel', price: 168.40, percent: 5.12 },
      { symbol: 'NVDA', name: 'NVIDIA Corp', price: 142.80, percent: 4.73 },
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1620.00, percent: 3.95 },
      { symbol: 'MSFT', name: 'Microsoft Corp', price: 448.20, percent: 2.94 }
    ],
    topLosers: [
      { symbol: 'TITAN', name: 'Titan Company', price: 3280.00, percent: -2.15 },
      { symbol: 'TSLA', name: 'Tesla Inc', price: 284.10, percent: -2.03 },
      { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 6890.00, percent: -1.57 }
    ]
  };

  const data = markets || defaultMarkets;
  const allIndices = [...(data.indianIndices || []), ...(data.globalIndices || [])];
  const activeIndex = allIndices.find((idx) => idx.id === activeIndexId) || data.indianIndices?.[0];

  const chartSeries = activeIndex?.history?.[selectedTimeframe] || [
    { time: '09:15', value: 25720 },
    { time: '11:00', value: 25780 },
    { time: '13:00', value: 25830 },
    { time: '15:30', value: 25890 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Financial Terminal Header */}
      <div className="pb-8 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1.5">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Dalal & Wall Street Intelligence Terminal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white">
            Real-Time Financial Markets
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-2xl">
            Live tick aggregation, multi-timeframe analytics, index trends, and corporate valuation metrics.
          </p>
        </div>

        {/* Currency Rates Box */}
        <div className="flex items-center space-x-3 bg-zinc-900/90 border border-zinc-800 p-3 rounded-2xl">
          {data.currencies?.map((c) => (
            <div key={c.symbol} className="text-xs px-2 border-r last:border-r-0 border-zinc-800">
              <span className="text-gray-400 block font-semibold">{c.symbol}</span>
              <span className="text-white font-mono font-bold">{c.rate}</span>
              <span className={`text-[10px] block font-mono ${c.percent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {c.percent >= 0 ? `+${c.percent}%` : `${c.percent}%`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Primary Index Chart & Detail (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Index Selector Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            {allIndices.map((idx) => {
              const isSelected = activeIndex?.id === idx.id;
              return (
                <button
                  key={idx.id}
                  onClick={() => setActiveIndexId(idx.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-amber-400 text-black border-amber-400 shadow-md'
                      : 'bg-zinc-900/80 text-gray-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {idx.name}
                </button>
              );
            })}
          </div>

          {/* Large Interactive Chart Card */}
          <div className="glass-card rounded-3xl p-6 border border-zinc-800 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-serif text-2xl font-bold text-white">{activeIndex?.name}</h2>
                  <span className="text-xs font-mono text-gray-400">({activeIndex?.symbol})</span>
                </div>
                <div className="flex items-baseline space-x-3 mt-1">
                  <span className="text-3xl font-bold font-mono text-white">
                    {activeIndex?.current?.toLocaleString()}
                  </span>
                  <span className={`text-sm font-mono font-bold ${activeIndex?.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {activeIndex?.change >= 0 ? `+${activeIndex?.change}` : activeIndex?.change} ({activeIndex?.percentChange}%)
                  </span>
                </div>
              </div>

              {/* Timeframe Buttons */}
              <div className="flex items-center space-x-1.5 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 self-start sm:self-auto">
                {['1D', '1W', '1M', '1Y'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      selectedTimeframe === tf
                        ? 'bg-zinc-800 text-amber-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-80 w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="terminalGoldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#52525b" tick={{ fontSize: 11, fill: '#71717a' }} />
                  <YAxis stroke="#52525b" domain={['dataMin - 40', 'dataMax + 40']} tick={{ fontSize: 11, fill: '#71717a' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#3f3f46',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#terminalGoldGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Key Technical Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800/80 text-xs font-mono">
              <div>
                <span className="text-gray-500 block">Day High</span>
                <span className="text-white font-bold text-sm">{activeIndex?.high?.toLocaleString() || '25,940'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Day Low</span>
                <span className="text-white font-bold text-sm">{activeIndex?.low?.toLocaleString() || '25,710'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Volume</span>
                <span className="text-white font-bold text-sm">{activeIndex?.volume || '3.84B'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Status</span>
                <span className="text-emerald-400 font-bold text-sm flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Active Live</span>
                </span>
              </div>
            </div>
          </div>

          {/* Indian Bluechip Equities Table */}
          <div className="glass-card rounded-3xl p-6 border border-zinc-800">
            <h3 className="font-serif text-lg font-bold text-white mb-4">
              Major Indian Equities (NSE Bluechips)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 text-gray-400">
                    <th className="pb-3">Symbol</th>
                    <th className="pb-3">Company</th>
                    <th className="pb-3 text-right">LTP (₹)</th>
                    <th className="pb-3 text-right">Change</th>
                    <th className="pb-3 text-right">% Change</th>
                    <th className="pb-3 text-right">P/E</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {data.indianStocks?.map((stk) => (
                    <tr key={stk.symbol} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 font-bold text-amber-400">{stk.symbol}</td>
                      <td className="py-3 font-sans text-gray-200">{stk.name}</td>
                      <td className="py-3 text-right text-white font-bold">₹{stk.price}</td>
                      <td className={`py-3 text-right ${stk.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stk.change >= 0 ? `+${stk.change}` : stk.change}
                      </td>
                      <td className={`py-3 text-right font-bold ${stk.percent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stk.percent >= 0 ? `+${stk.percent}%` : `${stk.percent}%`}
                      </td>
                      <td className="py-3 text-right text-gray-400">{stk.pe || '24.2'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Col: International Indices & Gainers/Decliners (Col 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Global Markets Overview */}
          <div className="glass-card rounded-3xl p-6 border border-zinc-800">
            <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>International Indices</span>
              <Globe className="w-4 h-4 text-amber-400" />
            </h3>
            <div className="space-y-3">
              {data.globalIndices?.map((g) => (
                <div
                  key={g.id}
                  className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{g.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{g.region} • {g.symbol}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-white font-bold block">{g.current?.toLocaleString()}</span>
                    <span className={`text-[10px] font-bold ${g.percentChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {g.percentChange >= 0 ? `+${g.percentChange}%` : `${g.percentChange}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gainers & Losers Box */}
          <div className="glass-card rounded-3xl p-6 border border-zinc-800">
            <h3 className="font-serif text-lg font-bold text-white mb-4">
              Top Gainers & Decliners
            </h3>

            <div className="space-y-2 mb-6">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                Top Gainers
              </span>
              {data.topGainers?.map((g) => (
                <div key={g.symbol} className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">{g.symbol}</span>
                  <span className="text-emerald-400 font-bold">+{g.percent}%</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">
                Top Decliners
              </span>
              {data.topLosers?.map((l) => (
                <div key={l.symbol} className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">{l.symbol}</span>
                  <span className="text-rose-400 font-bold">{l.percent}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
