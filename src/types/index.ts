export interface TradingSymbol {
  symbol: string;
  name: string;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: number;
  macd_signal: number;
  sma_20: number;
  sma_50: number;
  bb_upper: number;
  bb_lower: number;
}

export interface TradingSignal {
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasons: string[];
}

export interface ChartData {
  timestamps: number[];
  prices: number[];
  volumes: number[];
  sma_20: number[];
  sma_50: number[];
  rsi: number[];
  macd: number[];
  macd_signal: number[];
}

export interface AnalysisResult {
  symbol: string;
  interval: string;
  current_price: number;
  volume: number;
  high_24h: number;
  low_24h: number;
  change_24h: number;
  signal: TradingSignal;
  indicators: TechnicalIndicators;
  chart_data: ChartData;
}

export type Screen = 'splash' | 'home' | 'loading' | 'result';

export interface AppState {
  currentScreen: Screen;
  selectedSymbol: string;
  selectedInterval: string;
  analysisResult: AnalysisResult | null;
  loading: boolean;
  error: string | null;
}