import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, DollarSign, Activity, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';

export const MarketSection = () => {
  const { markets, refreshGlobalData } = useNews();
  const [selectedMarketTab, setSelectedMarketTab] = useState('indian'); // 'indian' | 'global'
  const [activeTimeframe, setActiveTimeframe] = useState('1D'); // '1D' | '1W' | '1M' | '1Y'
  const [selectedSymbolId, setSelectedSymbolId] = useState('nifty50');

  const defaultMarkets = {
    indianIndices: [
      {
        id: 'nifty50',
        name: 'NIFTY 50',
        current: 25890.45,
        change: 182.35,
        percentChange: 0.71,
        history: {
          '1D': [{ time: '09:15', value: 25720 }, { time: '11:45', value: 25810 }, { time: '15:30', value: 25890.45 }],
          '1W': [{ time: 'Mon', value: 25510 }, { time: 'Wed', value: 25580 }, { time: 'Fri', value: 25890.45 }],
          '1M': [{ time: 'W1', value: 25100 }, { time: 'W2', value: 25350 }, { time: 'W4', value: 25890.45 }],
          '1Y': [{ time: 'Q1', value: 22100 }, { time: 'Q3', value: 24800 }, { time: 'Q4', value: 25890.45 }]
        }
      },
      {
        id: 'sensex',
        name: 'BSE SENSEX',
        current: 84920.80,
        change: 590.25,
        percentChange: 0.70
      },
      {
        id: 'banknifty',
        name: 'BANK NIFTY',
        current: 54210.15,
        change: 412.60,
        percentChange: 0.77
      }
    ],
    globalIndices: [
      {
        id: 'nasdaq',
        name: 'NASDAQ Composite',
        current: 19845.20,
        change: 195.40,
        percentChange: 0.99
      },
      {
        id: 'sp500',
        name: 'S&P 500',
        current: 5980.60,
        change: 38.20,
        percentChange: 0.64
      },
      {
        id: 'dowjones',
        name: 'DOW JONES',
        current: 43810.15,
        change: 145.80,
        percentChange: 0.33
      }
    ],
    currencies: [
      { symbol: 'USD/INR', rate: 86.82, percent: -0.16 },
      { symbol: 'EUR/INR', rate: 91.45, percent: +0.31 },
      { symbol: 'GBP/INR', rate: 109.12, percent: +0.41 }
    ],
    topGainers: [
      { symbol: 'TATASTEEL', name: 'Tata Steel', price: 168.40, percent: 5.12 },
      { symbol: 'NVDA', name: 'NVIDIA Corp', price: 142.80, percent: 4.73 },
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1620.00, percent: 3.95 }
    ],
    topLosers: [
      { symbol: 'TITAN', name: 'Titan Company', price: 3280.00, percent: -2.15 },
      { symbol: 'TSLA', name: 'Tesla Inc', price: 284.10, percent: -2.03 }
    ]
  };

  const data = markets || defaultMarkets;
  const currentIndices = selectedMarketTab === 'indian' ? (data.indianIndices || []) : (data.globalIndices || []);
  const activeIndex = currentIndices.find((idx) => idx.id === selectedSymbolId) || currentIndices[0] || (data.indianIndices?.[0]);

  // Extract chart series for active index and timeframe
  const chartData = activeIndex?.history?.[activeTimeframe] || [
    { time: '09:30', value: 25700 },
    { time: '11:00', value: 25780 },
    { time: '13:00', value: 25820 },
    { time: '15:30', value: 25890 }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-zinc-800/80 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              Financial Intelligence
            </span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">
            Global & Indian Stock Exchanges
          </h2>
        </div>

        {/* Currency Ticker Pill */}
        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar">
          {data.currencies?.map((curr) => (
            <div
              key={curr.symbol}
              className="px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs flex items-center space-x-2 shrink-0"
            >
              <span className="font-semibold text-gray-300">{curr.symbol}</span>
              <span className="text-white font-mono">{curr.rate}</span>
              <span className={`text-[10px] font-mono ${curr.percent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {curr.percent >= 0 ? `+${curr.percent}%` : `${curr.percent}%`}
              </span>
            </div>
          ))}

          <Link
            to="/markets"
            className="px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 text-xs font-semibold flex items-center space-x-1 shrink-0 transition-colors"
          >
            <span>Full Terminal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Indices cards, Chart, and Gainers/Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left Col: Index cards and Chart */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Market Tab Selector (Indian vs Global) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => { setSelectedMarketTab('indian'); setSelectedSymbolId('nifty50'); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedMarketTab === 'indian'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Indian Indices (NSE / BSE)
              </button>
              <button
                onClick={() => { setSelectedMarketTab('global'); setSelectedSymbolId('nasdaq'); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedMarketTab === 'global'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                International (Wall St, Europe, Asia)
              </button>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center space-x-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              {['1D', '1W', '1M', '1Y'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    activeTimeframe === tf
                      ? 'bg-zinc-800 text-amber-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Index Selector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {currentIndices.map((idx) => {
              const isSelected = (activeIndex?.id === idx.id);
              const isPositive = idx.change >= 0;
              return (
                <div
                  key={idx.id}
                  onClick={() => setSelectedSymbolId(idx.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-zinc-800/90 border-amber-400/80 shadow-lg'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-300">{idx.name}</span>
                    {isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="text-lg font-bold font-mono text-white">
                      {idx.current?.toLocaleString('en-IN')}
                    </span>
                    <div className="flex items-center space-x-1.5 mt-0.5 text-xs font-mono">
                      <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                        {isPositive ? `+${idx.change}` : idx.change}
                      </span>
                      <span className={`text-[10px] ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ({isPositive ? `+${idx.percentChange}%` : `${idx.percentChange}%`})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Recharts AreaChart Card */}
          <div className="glass-card rounded-2xl p-5 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-serif text-base font-bold text-white flex items-center space-x-2">
                  <span>{activeIndex?.name} Performance Curve</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono">
                    {activeTimeframe} Interval
                  </span>
                </h4>
                <p className="text-[11px] text-gray-400">
                  Real-time tick aggregation • Source: National Stock Exchange / Bloomberg Financial
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-white">
                  {activeIndex?.current?.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-400 font-mono block">
                  +{activeIndex?.percentChange}% ({activeTimeframe})
                </span>
              </div>
            </div>

            {/* Recharts Area Container */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldMarketGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#52525b" tick={{ fontSize: 11, fill: '#71717a' }} />
                  <YAxis stroke="#52525b" domain={['dataMin - 50', 'dataMax + 50']} tick={{ fontSize: 11, fill: '#71717a' }} />
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
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#goldMarketGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Col: Top Movers, Bluechips & Market Headlines */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Top Gainers & Losers Box */}
          <div className="glass-card rounded-2xl p-5 border border-zinc-800/80">
            <h3 className="font-serif text-base font-bold text-white mb-3 flex items-center justify-between">
              <span>Market Movers</span>
              <span className="text-[10px] text-amber-400 uppercase tracking-wider font-sans font-semibold">
                Dalal & Wall St
              </span>
            </h3>

            {/* Gainers */}
            <div className="space-y-2 mb-4">
              <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase block">
                Top Gainers
              </span>
              {data.topGainers?.slice(0, 3).map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs">
                  <div>
                    <span className="font-bold text-white">{stock.symbol}</span>
                    <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{stock.name}</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-gray-200">₹{stock.price}</span>
                    <span className="text-emerald-400 text-[10px] block font-bold">+{stock.percent}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Losers */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-wider text-rose-400 uppercase block">
                Top Decliners
              </span>
              {data.topLosers?.slice(0, 2).map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs">
                  <div>
                    <span className="font-bold text-white">{stock.symbol}</span>
                    <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{stock.name}</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-gray-200">₹{stock.price}</span>
                    <span className="text-rose-400 text-[10px] block font-bold">{stock.percent}%</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Financial Editorial Dispatch Callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-400/10 via-zinc-900 to-zinc-950 border border-amber-400/30">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
              Morning Bell Briefing
            </span>
            <h4 className="font-serif text-sm font-bold text-white leading-snug">
              Why central banks are quietly realigning balance sheets toward digital sovereign debt.
            </h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Subscribers receive our daily Wall Street & Dalal Street pre-market analysis at 08:00 IST.
            </p>
            <Link
              to="/markets"
              className="mt-3 inline-flex items-center text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              <span>Explore Market Intelligence Desk</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
