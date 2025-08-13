import React from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Download, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AnalysisResult } from '../types';

interface ResultScreenProps {
  result: AnalysisResult;
  onBack: () => void;
  onRefresh: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, onBack, onRefresh }) => {
  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'text-green-600 bg-green-50 border-green-200';
      case 'SELL': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BUY': return <TrendingUp className="w-6 h-6" />;
      case 'SELL': return <TrendingDown className="w-6 h-6" />;
      default: return <Minus className="w-6 h-6" />;
    }
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatPercent = (percent: number) => `${percent.toFixed(2)}%`;

  // Prepare chart data
  const chartData = result.chart_data.timestamps.map((timestamp, index) => ({
    time: new Date(timestamp).toLocaleDateString(),
    price: result.chart_data.prices[index],
    volume: result.chart_data.volumes[index],
    sma20: result.chart_data.sma_20[index],
    sma50: result.chart_data.sma_50[index],
    rsi: result.chart_data.rsi[index],
    macd: result.chart_data.macd[index],
    macdSignal: result.chart_data.macd_signal[index],
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={onRefresh}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Symbol Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{result.symbol}</h1>
              <p className="text-gray-600">Interval: {result.interval}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">
                {formatPrice(result.current_price)}
              </div>
              <div className={`text-lg ${result.change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {result.change_24h >= 0 ? '+' : ''}{formatPercent(result.change_24h)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Volume</div>
              <div className="font-semibold">{result.volume.toLocaleString()}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">24h High</div>
              <div className="font-semibold">{formatPrice(result.high_24h)}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">24h Low</div>
              <div className="font-semibold">{formatPrice(result.low_24h)}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">RSI</div>
              <div className="font-semibold">{result.indicators.rsi.toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* Trading Signal */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Trading Signal</h2>
          <div className={`flex items-center justify-between p-6 rounded-lg border-2 ${getSignalColor(result.signal.signal)}`}>
            <div className="flex items-center">
              {getSignalIcon(result.signal.signal)}
              <div className="ml-4">
                <div className="text-2xl font-bold">{result.signal.signal}</div>
                <div className="text-sm opacity-80">Confidence: {result.signal.confidence}%</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium mb-2">Reasons:</div>
              <ul className="text-sm space-y-1">
                {result.signal.reasons.map((reason, index) => (
                  <li key={index}>• {reason}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Indicators */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Technical Indicators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">RSI (14)</div>
              <div className="text-xl font-bold">{result.indicators.rsi.toFixed(1)}</div>
              <div className={`text-sm ${result.indicators.rsi > 70 ? 'text-red-600' : result.indicators.rsi < 30 ? 'text-green-600' : 'text-gray-600'}`}>
                {result.indicators.rsi > 70 ? 'Overbought' : result.indicators.rsi < 30 ? 'Oversold' : 'Neutral'}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">MACD</div>
              <div className="text-xl font-bold">{result.indicators.macd.toFixed(4)}</div>
              <div className={`text-sm ${result.indicators.macd > result.indicators.macd_signal ? 'text-green-600' : 'text-red-600'}`}>
                {result.indicators.macd > result.indicators.macd_signal ? 'Bullish' : 'Bearish'}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">SMA 20</div>
              <div className="text-xl font-bold">{formatPrice(result.indicators.sma_20)}</div>
              <div className={`text-sm ${result.current_price > result.indicators.sma_20 ? 'text-green-600' : 'text-red-600'}`}>
                {result.current_price > result.indicators.sma_20 ? 'Above' : 'Below'}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">SMA 50</div>
              <div className="text-xl font-bold">{formatPrice(result.indicators.sma_50)}</div>
              <div className={`text-sm ${result.current_price > result.indicators.sma_50 ? 'text-green-600' : 'text-red-600'}`}>
                {result.current_price > result.indicators.sma_50 ? 'Above' : 'Below'}
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Price Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Price & Moving Averages</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} name="Price" />
                <Line type="monotone" dataKey="sma20" stroke="#f59e0b" strokeWidth={1} name="SMA 20" />
                <Line type="monotone" dataKey="sma50" stroke="#ef4444" strokeWidth={1} name="SMA 50" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* RSI Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">RSI Indicator</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="rsi" stroke="#8b5cf6" strokeWidth={2} name="RSI" />
                <Line y={70} stroke="#ef4444" strokeDasharray="5 5" />
                <Line y={30} stroke="#10b981" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* MACD Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">MACD</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="macd" stroke="#2563eb" strokeWidth={2} name="MACD" />
                <Line type="monotone" dataKey="macdSignal" stroke="#f59e0b" strokeWidth={2} name="Signal" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Volume Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Volume</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};