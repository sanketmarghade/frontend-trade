import React, { useState, useEffect } from 'react';
import { Download, BarChart3, TrendingUp, Activity, CheckCircle } from 'lucide-react';

interface LoadingScreenProps {
  symbol: string;
  interval: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ symbol, interval }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { icon: Download, text: `Fetching ${symbol} data...`, duration: 2000 },
    { icon: BarChart3, text: 'Calculating technical indicators...', duration: 2500 },
    { icon: TrendingUp, text: 'Analyzing price patterns...', duration: 2000 },
    { icon: Activity, text: 'Generating trading signals...', duration: 1500 },
    { icon: CheckCircle, text: 'Analysis complete!', duration: 500 },
  ];

  useEffect(() => {
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;

    const progressInterval = setInterval(() => {
      elapsed += 50;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Update current step based on elapsed time
      let stepElapsed = 0;
      for (let i = 0; i < steps.length; i++) {
        stepElapsed += steps[i].duration;
        if (elapsed <= stepElapsed) {
          setCurrentStep(i);
          break;
        }
      }
    }, 50);

    return () => clearInterval(progressInterval);
  }, []);

  const CurrentIcon = steps[currentStep]?.icon || Download;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Animated Icon */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <CurrentIcon className="w-12 h-12 text-white animate-pulse" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-white/20 rounded-full animate-spin border-t-white/60"></div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-2">
          Analyzing {symbol}
        </h2>
        <p className="text-blue-200 mb-8">
          Time interval: {interval}
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-white/20 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white text-sm">{Math.round(progress)}% Complete</p>
        </div>

        {/* Current Step */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <p className="text-white text-lg font-medium">
            {steps[currentStep]?.text || 'Processing...'}
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500/20 text-green-200'
                    : isCurrent
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/60'
                }`}
              >
                <StepIcon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                <span className="text-sm">{step.text}</span>
                {isCompleted && <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />}
              </div>
            );
          })}
        </div>

        {/* Technical Details */}
        <div className="mt-8 text-xs text-blue-200/80">
          <p>Using TA-Lib and pandas_ta for technical analysis</p>
          <p>Calculating RSI, MACD, Bollinger Bands, and more...</p>
        </div>
      </div>
    </div>
  );
};