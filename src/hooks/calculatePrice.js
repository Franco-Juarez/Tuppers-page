import { useState, useEffect } from 'react';

const useBitcoinPrice = () => {
  const [bitcoinPrice, setBitcoinPrice] = useState(null);

  const fetchBitcoinPrice = async () => {
    try {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
      const data = await response.json();
      const price = data.bpi.USD.rate_float;
      setBitcoinPrice(price);
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
    }
  };

  useEffect(() => {
    const today = new Date();
    const isFirstDayOfMonth = today.getDate() === 1;

    if (isFirstDayOfMonth) {
      fetchBitcoinPrice();
    }
  }, []);

  return bitcoinPrice;
};

export default useBitcoinPrice;