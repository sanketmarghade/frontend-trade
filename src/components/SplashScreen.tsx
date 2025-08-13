import React, { useEffect } from 'react';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="animate-bounce delay-0">
              <TrendingUp className="w-12 h-12 text-blue-400" />
            </div>
            <div className="animate-bounce delay-150">
              <BarChart3 className="w-12 h-12 text-purple-400" />
            </div>
            <div className="animate-bounce delay-300">
              <Activity className="w-12 h-12 text-indigo-400" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-20 blur-xl rounded-full animate-pulse"></div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
          TradePro
        </h1>
        <p className="text-xl text-blue-200 mb-8 animate-fade-in-delay">
          Advanced Technical Analysis Platform
        </p>
        
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
};