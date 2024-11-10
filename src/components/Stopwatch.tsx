import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

interface LapTime {
  id: number;
  time: string;
  duration: string;
}

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapTime[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);

  const formatTime = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    setLastLapTime(0);
  };

  const handleLap = () => {
    const currentLapDuration = time - lastLapTime;
    const newLap: LapTime = {
      id: laps.length + 1,
      time: formatTime(time),
      duration: formatTime(currentLapDuration),
    };
    setLaps((prevLaps) => [newLap, ...prevLaps]);
    setLastLapTime(time);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="text-7xl font-mono text-center mb-8 font-light tracking-wider">
            {formatTime(time)}
          </div>
          
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={handleStartStop}
              className={`p-4 rounded-full ${
                isRunning
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-500'
                  : 'bg-green-500/20 hover:bg-green-500/30 text-green-500'
              } transition-all duration-300`}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button
              onClick={handleLap}
              disabled={!isRunning}
              className="p-4 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Flag size={24} />
            </button>
            
            <button
              onClick={handleReset}
              className="p-4 rounded-full bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 transition-all duration-300"
            >
              <RotateCcw size={24} />
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-auto custom-scrollbar">
            {laps.map((lap) => (
              <div
                key={lap.id}
                className="flex justify-between items-center bg-gray-700/30 rounded-lg p-3 backdrop-blur-sm"
              >
                <span className="text-gray-400">Lap {lap.id}</span>
                <div className="space-x-4">
                  <span className="text-gray-300">{lap.duration}</span>
                  <span className="text-gray-400">{lap.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}