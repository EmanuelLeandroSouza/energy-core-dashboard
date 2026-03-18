import { useState, useEffect } from "react";

export function useEnergyData() {
  const [data, setData] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const itv = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const newData = {
        time: timeStr,
        vA: 121.2 + Math.random() * 0.5,
        vB: 120.8 + Math.random() * 0.5,
        vC: 121.5 + Math.random() * 0.5,
        cA: 24.5 + Math.random() * 0.3,
        cB: 24.2 + Math.random() * 0.3,
        cC: 24.8 + Math.random() * 0.3,
      };

      setData(newData);
      setHistory(prev => [...prev, newData].slice(-25));
    }, 1500);
    return () => clearInterval(itv);
  }, []);

  return { data, history };
}