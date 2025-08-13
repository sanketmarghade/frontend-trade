import React, { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/HomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultScreen } from './components/ResultScreen';
import { tradingApi } from './services/api';
import { Screen, AnalysisResult } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [selectedInterval, setSelectedInterval] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSplashComplete = () => {
    setCurrentScreen('home');
  };

  const handleAnalyze = async (symbol: string, interval: string) => {
    setSelectedSymbol(symbol);
    setSelectedInterval(interval);
    setCurrentScreen('loading');
    setError(null);

    try {
      // Simulate loading time to show the loading screen
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      const result = await tradingApi.analyzeSymbol(symbol, interval);
      setAnalysisResult(result);
      setCurrentScreen('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setCurrentScreen('home');
    }
  };

  const handleBack = () => {
    setCurrentScreen('home');
    setAnalysisResult(null);
    setError(null);
  };

  const handleRefresh = () => {
    if (selectedSymbol && selectedInterval) {
      handleAnalyze(selectedSymbol, selectedInterval);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Analysis Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  switch (currentScreen) {
    case 'splash':
      return <SplashScreen onComplete={handleSplashComplete} />;
    
    case 'home':
      return <HomeScreen onAnalyze={handleAnalyze} />;
    
    case 'loading':
      return <LoadingScreen symbol={selectedSymbol} interval={selectedInterval} />;
    
    case 'result':
      return analysisResult ? (
        <ResultScreen 
          result={analysisResult} 
          onBack={handleBack}
          onRefresh={handleRefresh}
        />
      ) : (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">No results available</h2>
            <button
              onClick={handleBack}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    
    default:
      return <HomeScreen onAnalyze={handleAnalyze} />;
  }
}

export default App;