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
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#ded5c2] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-bold text-[#946638] uppercase tracking-widest">
              Financial Intelligence
            </span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1c1917] mt-1">
            Global & Indian Stock Exchanges
          </h2>
        </div>

        {/* Currency Ticker Pill */}
        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar">
          {data.currencies?.map((curr) => (
            <div
              key={curr.symbol}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#ded5c2] text-xs flex items-center space-x-2 shrink-0 shadow-sm"
            >
              <span className="font-bold text-[#1c1917]">{curr.symbol}</span>
              <span className="text-[#574f45] font-mono">{curr.rate}</span>
              <span className={`text-[10px] font-mono font-bold ${curr.percent >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {curr.percent >= 0 ? `+${curr.percent}%` : `${curr.percent}%`}
              </span>
            </div>
          ))}

          <Link
            to="/markets"
            className="px-3 py-1.5 rounded-xl bg-[#f2ece0] hover:bg-[#eae2d2] text-[#784f27] border border-[#d3c4b0] text-xs font-bold flex items-center space-x-1 shrink-0 transition-colors"
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
            <div className="flex items-center space-x-2 bg-[#ede5d6] p-1 rounded-xl border border-[#ded5c2]">
              <button
                onClick={() => { setSelectedMarketTab('indian'); setSelectedSymbolId('nifty50'); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedMarketTab === 'indian'
                    ? 'bg-[#946638] text-white shadow-sm'
                    : 'text-[#574f45] hover:text-[#1c1917]'
                }`}
              >
                Indian Indices (NSE / BSE)
              </button>
              <button
                onClick={() => { setSelectedMarketTab('global'); setSelectedSymbolId('nasdaq'); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedMarketTab === 'global'
                    ? 'bg-[#946638] text-white shadow-sm'
                    : 'text-[#574f45] hover:text-[#1c1917]'
                }`}
              >
                International (Wall St, Europe, Asia)
              </button>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center space-x-1 bg-[#ede5d6] p-1 rounded-xl border border-[#ded5c2]">
              {['1D', '1W', '1M', '1Y'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    activeTimeframe === tf
                      ? 'bg-white text-[#1c1917] shadow-sm'
                      : 'text-[#574f45] hover:text-[#1c1917]'
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
                      ? 'bg-white border-[#946638] shadow-md ring-1 ring-[#946638]/20'
                      : 'bg-white/80 border-[#ded5c2] hover:border-[#bda588] hover:bg-white'
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
                  <div className="mt-2">
                    <span className="text-lg font-bold font-mono text-[#1c1917]">
                      {idx.current?.toLocaleString('en-IN')}
                    </span>
                    <div className="flex items-center space-x-1.5 mt-0.5 text-xs font-mono">
                      <span className={isPositive ? 'text-emerald-700' : 'text-rose-700'}>
                        {isPositive ? `+${idx.change}` : idx.change}
                      </span>
                      <span className={`text-[10px] font-bold ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                        ({isPositive ? `+${idx.percentChange}%` : `${idx.percentChange}%`})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Recharts AreaChart Card */}
          <div className="glass-card rounded-2xl p-5 border border-[#ded5c2]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-serif text-base font-bold text-[#1c1917] flex items-center space-x-2">
                  <span>{activeIndex?.name} Performance Curve</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#f2ece0] text-[#784f27] font-mono font-bold">
                    {activeTimeframe} Interval
                  </span>
                </h4>
                <p className="text-[11px] text-[#786f63]">
                  Real-time tick aggregation • Source: National Stock Exchange / Bloomberg Financial
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-[#1c1917]">
                  {activeIndex?.current?.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-700 font-mono font-bold block">
                  +{activeIndex?.percentChange}% ({activeTimeframe})
                </span>
              </div>
            </div>

            {/* Recharts Area Container */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="warmCamelMarketGradient" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#warmCamelMarketGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Col: Top Movers, Bluechips & Market Headlines */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Top Gainers & Losers Box */}
          <div className="glass-card rounded-2xl p-5 border border-[#ded5c2]">
            <h3 className="font-serif text-base font-bold text-[#1c1917] mb-3 flex items-center justify-between">
              <span>Market Movers</span>
              <span className="text-[10px] text-[#946638] uppercase tracking-wider font-sans font-bold">
                Dalal & Wall St
              </span>
            </h3>

            {/* Gainers */}
            <div className="space-y-2 mb-4">
              <span className="text-[10px] font-bold tracking-wider text-emerald-700 uppercase block">
                Top Gainers
              </span>
              {data.topGainers?.slice(0, 3).map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-2 rounded-xl bg-[#faf7f2] border border-[#ded5c2] text-xs">
                  <div>
                    <span className="font-bold text-[#1c1917]">{stock.symbol}</span>
                    <p className="text-[10px] text-[#786f63] truncate max-w-[120px]">{stock.name}</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[#1c1917] font-semibold">₹{stock.price}</span>
                    <span className="text-emerald-700 text-[10px] block font-bold">+{stock.percent}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Losers */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-wider text-rose-700 uppercase block">
                Top Decliners
              </span>
              {data.topLosers?.slice(0, 2).map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-2 rounded-xl bg-[#faf7f2] border border-[#ded5c2] text-xs">
                  <div>
                    <span className="font-bold text-[#1c1917]">{stock.symbol}</span>
                    <p className="text-[10px] text-[#786f63] truncate max-w-[120px]">{stock.name}</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[#1c1917] font-semibold">₹{stock.price}</span>
                    <span className="text-rose-700 text-[10px] block font-bold">{stock.percent}%</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Financial Editorial Dispatch Callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#f5eee2] via-white to-[#ede3d2] border border-[#d9ccb6] shadow-sm">
            <span className="text-[10px] font-bold text-[#946638] uppercase tracking-widest block mb-1">
              Morning Bell Briefing
            </span>
            <h4 className="font-serif text-sm font-bold text-[#1c1917] leading-snug">
              Why central banks are quietly realigning balance sheets toward digital sovereign debt.
            </h4>
            <p className="text-xs text-[#574f45] mt-2 leading-relaxed">
              Subscribers receive our daily Wall Street & Dalal Street pre-market analysis at 08:00 IST.
            </p>
            <Link
              to="/markets"
              className="mt-3 inline-flex items-center text-xs font-bold text-[#946638] hover:text-[#784f27]"
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
