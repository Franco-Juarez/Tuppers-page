import { useState, useEffect } from 'react';
import BitcoinPrices from '../data/bitcoinPrice.json';

const useBitcoinPrice = () => {
  const [bitcoinPrice, setBitcoinPrice] = useState(null); // Estado inicial vacío

  useEffect(() => {
    if (typeof window === 'undefined') return; // Evitar errores en SSR

    const savedData = localStorage.getItem('BitcoinPrices');
    setBitcoinPrice(savedData ? JSON.parse(savedData) : BitcoinPrices);

    const today = new Date();
    const actualMonth = today.toLocaleString('en-US', { month: 'long' });

    if (today.getDate() === 1) {
      fetchBitcoinPrice(actualMonth);
    }
  }, []);

  const fetchBitcoinPrice = async (actualMonth) => {
    try {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
      const data = await response.json();
      const price = data.bpi.USD.rate_float;

      setBitcoinPrice((prevPrices) => {
        if (!prevPrices) return null; // Evitar errores si aún no se cargó

        const updatedPrices = prevPrices.BitcoinPrices.map((entry) => {
          if (entry.month.toLowerCase() === actualMonth.toLowerCase()) {
            console.log(`➡ Actualizando ${entry.month}: ${entry.value} → ${price}`);
            return { ...entry, value: entry.value === 0 ? price : entry.value };
          }
          return entry;
        });

        const newData = { BitcoinPrices: updatedPrices };
        localStorage.setItem('BitcoinPrices', JSON.stringify(newData));
        return newData;
      });
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
    }
  };

  return bitcoinPrice;
};

export default useBitcoinPrice;
