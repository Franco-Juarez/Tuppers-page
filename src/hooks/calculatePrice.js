import { useState, useEffect } from 'react';
import BitcoinPrices from '../data/bitcoinPrice.json';

const useBitcoinPrice = () => {
  // Cargar los datos desde LocalStorage o usar los datos por defecto
  const [bitcoinPrice, setBitcoinPrice] = useState(() => {
    const savedData = localStorage.getItem('BitcoinPrices');
    return savedData ? JSON.parse(savedData) : BitcoinPrices;
  });

  useEffect(() => {
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

      // Crear una copia actualizada del JSON desde el estado actual
      const updatedPrices = bitcoinPrice.BitcoinPrices.map((entry) => {
        if (entry.month.toLowerCase() === actualMonth.toLowerCase()) {
          console.log(`➡ Actualizando ${entry.month}: ${entry.value} → ${price}`);
          return { ...entry, value: entry.value === 0 ? price : entry.value };
        }
        return entry;
      });

      const newData = { BitcoinPrices: updatedPrices };

      localStorage.setItem('BitcoinPrices', JSON.stringify(newData));

      setBitcoinPrice(newData);

    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
    }
  };

  return bitcoinPrice;
};

export default useBitcoinPrice;
