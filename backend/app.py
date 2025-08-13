import pandas as pd
import numpy as np
import yfinance as yf
from flask import Flask, request, jsonify
from flask_cors import CORS
import talib
import pandas_ta as ta
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

class TechnicalAnalyzer:
    def __init__(self):
        self.timeframe_mapping = {
            '1m': '1m',
            '5m': '5m', 
            '15m': '15m',
            '1h': '1h',
            '4h': '4h',
            '1d': '1d'
        }
    
    def fetch_data(self, symbol, interval='1d', period='1y'):
        """Fetch stock data using yfinance"""
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period=period, interval=interval)
            
            if data.empty:
                return None
                
            # Ensure we have enough data points
            if len(data) < 50:
                data = ticker.history(period='2y', interval=interval)
                
            return data
        except Exception as e:
            print(f"Error fetching data for {symbol}: {e}")
            return None
    
    def calculate_indicators(self, data):
        """Calculate technical indicators using both talib and pandas_ta"""
        if data is None or len(data) < 20:
            return None
            
        try:
            indicators = {}
            
            # Price data
            high = data['High'].values
            low = data['Low'].values
            close = data['Close'].values
            volume = data['Volume'].values
            
            # Moving Averages (TA-Lib)
            indicators['sma_20'] = talib.SMA(close, timeperiod=20)
            indicators['sma_50'] = talib.SMA(close, timeperiod=50)
            indicators['ema_12'] = talib.EMA(close, timeperiod=12)
            indicators['ema_26'] = talib.EMA(close, timeperiod=26)
            
            # RSI (TA-Lib)
            indicators['rsi'] = talib.RSI(close, timeperiod=14)
            
            # MACD (TA-Lib)
            macd, macd_signal, macd_hist = talib.MACD(close, fastperiod=12, slowperiod=26, signalperiod=9)
            indicators['macd'] = macd
            indicators['macd_signal'] = macd_signal
            indicators['macd_histogram'] = macd_hist
            
            # Bollinger Bands (TA-Lib)
            bb_upper, bb_middle, bb_lower = talib.BBANDS(close, timeperiod=20, nbdevup=2, nbdevdn=2)
            indicators['bb_upper'] = bb_upper
            indicators['bb_middle'] = bb_middle
            indicators['bb_lower'] = bb_lower
            
            # Stochastic (TA-Lib)
            slowk, slowd = talib.STOCH(high, low, close, fastk_period=14, slowk_period=3, slowd_period=3)
            indicators['stoch_k'] = slowk
            indicators['stoch_d'] = slowd
            
            # Additional indicators using pandas_ta
            df = data.copy()
            
            # Williams %R
            df.ta.willr(length=14, append=True)
            if 'WILLR_14' in df.columns:
                indicators['williams_r'] = df['WILLR_14'].values
            
            # Average True Range
            df.ta.atr(length=14, append=True)
            if 'ATR_14' in df.columns:
                indicators['atr'] = df['ATR_14'].values
            
            # Commodity Channel Index
            df.ta.cci(length=20, append=True)
            if 'CCI_20_0.015' in df.columns:
                indicators['cci'] = df['CCI_20_0.015'].values
            
            return indicators
            
        except Exception as e:
            print(f"Error calculating indicators: {e}")
            return None
    
    def generate_signals(self, data, indicators):
        """Generate trading signals based on technical indicators"""
        if not indicators:
            return {'signal': 'HOLD', 'confidence': 0, 'reasons': []}
        
        signals = []
        reasons = []
        
        try:
            # Get latest values (handle NaN values)
            latest_close = data['Close'].iloc[-1]
            latest_rsi = indicators['rsi'][-1] if not np.isnan(indicators['rsi'][-1]) else 50
            latest_macd = indicators['macd'][-1] if not np.isnan(indicators['macd'][-1]) else 0
            latest_macd_signal = indicators['macd_signal'][-1] if not np.isnan(indicators['macd_signal'][-1]) else 0
            latest_sma_20 = indicators['sma_20'][-1] if not np.isnan(indicators['sma_20'][-1]) else latest_close
            latest_sma_50 = indicators['sma_50'][-1] if not np.isnan(indicators['sma_50'][-1]) else latest_close
            latest_bb_upper = indicators['bb_upper'][-1] if not np.isnan(indicators['bb_upper'][-1]) else latest_close * 1.02
            latest_bb_lower = indicators['bb_lower'][-1] if not np.isnan(indicators['bb_lower'][-1]) else latest_close * 0.98
            
            # RSI Signals
            if latest_rsi < 30:
                signals.append(1)  # Bullish
                reasons.append(f"RSI oversold ({latest_rsi:.1f})")
            elif latest_rsi > 70:
                signals.append(-1)  # Bearish
                reasons.append(f"RSI overbought ({latest_rsi:.1f})")
            
            # MACD Signals
            if latest_macd > latest_macd_signal:
                signals.append(1)
                reasons.append("MACD bullish crossover")
            elif latest_macd < latest_macd_signal:
                signals.append(-1)
                reasons.append("MACD bearish crossover")
            
            # Moving Average Signals
            if latest_close > latest_sma_20 > latest_sma_50:
                signals.append(1)
                reasons.append("Price above moving averages")
            elif latest_close < latest_sma_20 < latest_sma_50:
                signals.append(-1)
                reasons.append("Price below moving averages")
            
            # Bollinger Bands
            if latest_close < latest_bb_lower:
                signals.append(1)
                reasons.append("Price near lower Bollinger Band")
            elif latest_close > latest_bb_upper:
                signals.append(-1)
                reasons.append("Price near upper Bollinger Band")
            
            # Calculate overall signal
            if not signals:
                return {'signal': 'HOLD', 'confidence': 0, 'reasons': ['No clear signals']}
            
            signal_strength = sum(signals)
            confidence = min(abs(signal_strength) * 20, 100)
            
            if signal_strength > 0:
                signal = 'BUY'
            elif signal_strength < 0:
                signal = 'SELL'
            else:
                signal = 'HOLD'
            
            return {
                'signal': signal,
                'confidence': confidence,
                'reasons': reasons
            }
            
        except Exception as e:
            print(f"Error generating signals: {e}")
            return {'signal': 'HOLD', 'confidence': 0, 'reasons': ['Error in analysis']}

analyzer = TechnicalAnalyzer()

@app.route('/api/analyze', methods=['POST'])
def analyze_symbol():
    try:
        data = request.get_json()
        symbol = data.get('symbol', 'AAPL')
        interval = data.get('interval', '1d')
        
        # Fetch stock data
        stock_data = analyzer.fetch_data(symbol, interval)
        if stock_data is None:
            return jsonify({'error': 'Failed to fetch data'}), 400
        
        # Calculate technical indicators
        indicators = analyzer.calculate_indicators(stock_data)
        if indicators is None:
            return jsonify({'error': 'Failed to calculate indicators'}), 400
        
        # Generate trading signals
        signals = analyzer.generate_signals(stock_data, indicators)
        
        # Prepare response data
        latest_data = stock_data.iloc[-1]
        
        # Convert numpy arrays to lists and handle NaN values
        def safe_convert(arr, default=0):
            if arr is None:
                return []
            clean_arr = np.nan_to_num(arr, nan=default)
            return clean_arr.tolist()
        
        response = {
            'symbol': symbol,
            'interval': interval,
            'current_price': float(latest_data['Close']),
            'volume': int(latest_data['Volume']),
            'high_24h': float(stock_data['High'].tail(1 if interval == '1d' else 24).max()),
            'low_24h': float(stock_data['Low'].tail(1 if interval == '1d' else 24).min()),
            'change_24h': float(((latest_data['Close'] - stock_data['Close'].iloc[-2]) / stock_data['Close'].iloc[-2]) * 100),
            'signal': signals,
            'indicators': {
                'rsi': float(indicators['rsi'][-1]) if not np.isnan(indicators['rsi'][-1]) else 50,
                'macd': float(indicators['macd'][-1]) if not np.isnan(indicators['macd'][-1]) else 0,
                'macd_signal': float(indicators['macd_signal'][-1]) if not np.isnan(indicators['macd_signal'][-1]) else 0,
                'sma_20': float(indicators['sma_20'][-1]) if not np.isnan(indicators['sma_20'][-1]) else float(latest_data['Close']),
                'sma_50': float(indicators['sma_50'][-1]) if not np.isnan(indicators['sma_50'][-1]) else float(latest_data['Close']),
                'bb_upper': float(indicators['bb_upper'][-1]) if not np.isnan(indicators['bb_upper'][-1]) else float(latest_data['Close']) * 1.02,
                'bb_lower': float(indicators['bb_lower'][-1]) if not np.isnan(indicators['bb_lower'][-1]) else float(latest_data['Close']) * 0.98,
            },
            'chart_data': {
                'timestamps': [int(ts.timestamp() * 1000) for ts in stock_data.index[-50:]],
                'prices': safe_convert(stock_data['Close'].tail(50).values),
                'volumes': safe_convert(stock_data['Volume'].tail(50).values),
                'sma_20': safe_convert(indicators['sma_20'][-50:]),
                'sma_50': safe_convert(indicators['sma_50'][-50:]),
                'rsi': safe_convert(indicators['rsi'][-50:], 50),
                'macd': safe_convert(indicators['macd'][-50:]),
                'macd_signal': safe_convert(indicators['macd_signal'][-50:]),
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Error in analyze_symbol: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/symbols', methods=['GET'])
def get_symbols():
    """Get list of popular trading symbols"""
    symbols = [
        {'symbol': 'AAPL', 'name': 'Apple Inc.'},
        {'symbol': 'GOOGL', 'name': 'Alphabet Inc.'},
        {'symbol': 'MSFT', 'name': 'Microsoft Corporation'},
        {'symbol': 'TSLA', 'name': 'Tesla Inc.'},
        {'symbol': 'AMZN', 'name': 'Amazon.com Inc.'},
        {'symbol': 'META', 'name': 'Meta Platforms Inc.'},
        {'symbol': 'NVDA', 'name': 'NVIDIA Corporation'},
        {'symbol': 'NFLX', 'name': 'Netflix Inc.'},
        {'symbol': 'AMD', 'name': 'Advanced Micro Devices'},
        {'symbol': 'INTC', 'name': 'Intel Corporation'},
    ]
    return jsonify(symbols)

if __name__ == '__main__':
    app.run(debug=True, port=5000)