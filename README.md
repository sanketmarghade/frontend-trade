# TradePro - Advanced Trading Analysis Platform

A comprehensive trading analysis application with Python backend using TA-Lib and pandas_ta for technical analysis, and a modern React frontend.

## Features

### Frontend (React + TypeScript)
- **Splash Screen**: Professional branding with animations
- **Home Screen**: Symbol selection and interval configuration
- **Loading Screen**: Multi-step analysis progress
- **Result Screen**: Comprehensive technical analysis results with interactive charts

### Backend (Python + Flask)
- **Technical Analysis**: Powered by TA-Lib and pandas_ta
- **Real-time Data**: Yahoo Finance integration
- **Multiple Indicators**: RSI, MACD, Bollinger Bands, Moving Averages, and more
- **Trading Signals**: Automated buy/sell/hold recommendations

## Technical Indicators

- **RSI (Relative Strength Index)**: Momentum oscillator
- **MACD**: Moving Average Convergence Divergence
- **Bollinger Bands**: Volatility indicator
- **Moving Averages**: SMA 20, SMA 50, EMA 12, EMA 26
- **Stochastic Oscillator**: Momentum indicator
- **Williams %R**: Momentum indicator
- **ATR (Average True Range)**: Volatility measure
- **CCI (Commodity Channel Index)**: Trend indicator

## Setup Instructions

### Backend Setup

1. **Install Python Dependencies**:
   ```bash
   cd backend
   python -m pip install -r requirements.txt
   ```

2. **Install TA-Lib** (Required for technical analysis):
   
   **Windows**:
   - Download TA-Lib wheel from: https://www.lfd.uci.edu/~gohlke/pythonlibs/#ta-lib
   - Install: `pip install TA_Lib-0.4.28-cp311-cp311-win_amd64.whl`
   
   **macOS**:
   ```bash
   brew install ta-lib
   ```
   
   **Linux**:
   ```bash
   sudo apt-get update
   sudo apt-get install build-essential
   wget http://prdownloads.sourceforge.net/ta-lib/ta-lib-0.4.0-src.tar.gz
   tar -xzf ta-lib-0.4.0-src.tar.gz
   cd ta-lib/
   ./configure --prefix=/usr
   make
   sudo make install
   ```

3. **Run the Backend**:
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/symbols` - Get list of available trading symbols
- `POST /api/analyze` - Analyze a symbol with technical indicators

### Analysis Request Format:
```json
{
  "symbol": "AAPL",
  "interval": "1d"
}
```

## Supported Time Intervals

- `1m` - 1 minute
- `5m` - 5 minutes  
- `15m` - 15 minutes
- `1h` - 1 hour
- `4h` - 4 hours
- `1d` - 1 day

## Trading Signals

The system generates automated trading signals based on:
- RSI overbought/oversold conditions
- MACD crossovers
- Moving average trends
- Bollinger Band positions

Each signal includes:
- **Signal Type**: BUY, SELL, or HOLD
- **Confidence Level**: 0-100%
- **Reasoning**: Detailed explanation of signal factors

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Axios for API communication
- Lucide React for icons

### Backend
- Python 3.8+
- Flask web framework
- TA-Lib for technical analysis
- pandas_ta for additional indicators
- yfinance for market data
- NumPy and Pandas for data processing

## Architecture

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│   React Frontend│ ◄──────────────► │  Python Backend │
│                 │                 │                 │
│ • Symbol Select │                 │ • TA-Lib        │
│ • Interval Pick │                 │ • pandas_ta     │
│ • Results View  │                 │ • Yahoo Finance │
│ • Charts        │                 │ • Signal Gen    │
└─────────────────┘                 └─────────────────┘
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details