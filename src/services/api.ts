import axios from 'axios';
import { TradingSymbol, AnalysisResult } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const tradingApi = {
  async getSymbols(): Promise<TradingSymbol[]> {
    try {
      const response = await api.get('/symbols');
      return response.data;
    } catch (error) {
      console.error('Error fetching symbols:', error);
      throw new Error('Failed to fetch trading symbols');
    }
  },

  async analyzeSymbol(symbol: string, interval: string): Promise<AnalysisResult> {
    try {
      const response = await api.post('/analyze', {
        symbol,
        interval,
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing symbol:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to analyze symbol');
      }
      throw new Error('Failed to analyze symbol');
    }
  },
};