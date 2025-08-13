import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, Play } from 'lucide-react';
import { TradingSymbol } from '../types';
import { tradingApi } from '../services/api';

interface HomeScreenProps {
  onAnalyze: (symbol: string, interval: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onAnalyze }) => {
  const [symbols, setSymbols] = useState<TradingSymbol[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [selectedInterval, setSelectedInterval] = useState('1d');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const intervals = [
    { value: '1m', label: '1 Minute' },
    { value: '5m', label: '5 Minutes' },
    { value: '15m', label: '15 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '1d', label: '1 Day' },
  ];

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const data = await tradingApi.getSymbols();
        setSymbols(data);
      } catch (error) {
        console.error('Failed to fetch symbols:', error);
        // Fallback symbols if API fails
        setSymbols([
          { symbol: 'AAPL', name: 'Apple Inc.' },
          { symbol: 'GOOGL', name: 'Alphabet Inc.' },
          { symbol: 'MSFT', name: 'Microsoft Corporation' },
          { symbol: 'TSLA', name: 'Tesla Inc.' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSymbols();
  }, []);

  const filteredSymbols = symbols.filter(
    symbol =>
      symbol.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symbol.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAnalyze = () => {
    onAnalyze(selectedSymbol, selectedInterval);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <TrendingUp className="w-10 h-10 text-blue-600 mr-3" />
            TradePro Analysis
          </h1>
          <p className="text-xl text-gray-600">
            Advanced technical analysis powered by TA-Lib and pandas_ta
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Symbol Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <Search className="w-6 h-6 text-blue-600 mr-2" />
                Select Trading Symbol
              </h2>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search symbols..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                {filteredSymbols.map((symbol) => (
                  <button
                    key={symbol.symbol}
                    onClick={() => setSelectedSymbol(symbol.symbol)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedSymbol === symbol.symbol
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">{symbol.symbol}</div>
                    <div className="text-sm text-gray-600 truncate">{symbol.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interval Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="w-6 h-6 text-blue-600 mr-2" />
                Choose Time Interval
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {intervals.map((interval) => (
                  <button
                    key={interval.value}
                    onClick={() => setSelectedInterval(interval.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedInterval === interval.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{interval.value}</div>
                    <div className="text-xs text-gray-600">{interval.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Analysis Button */}
            <div className="text-center">
              <button
                onClick={handleAnalyze}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center mx-auto"
              >
                <Play className="w-6 h-6 mr-2" />
                Analyze {selectedSymbol} ({selectedInterval})
              </button>
            </div>

            {/* Selected Summary */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Analysis Configuration:</h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span><strong>Symbol:</strong> {selectedSymbol}</span>
                <span><strong>Interval:</strong> {selectedInterval}</span>
                <span><strong>Indicators:</strong> RSI, MACD, Bollinger Bands, Moving Averages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};