import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    const saved = localStorage.getItem('ry_currency');
    return saved === 'USD' ? 'USD' : 'INR';
  });

  useEffect(() => {
    localStorage.setItem('ry_currency', currency);
  }, [currency]);

  const toggleCurrency = () => {
    setCurrencyState((prev) => (prev === 'INR' ? 'USD' : 'INR'));
  };

  const setCurrency = (curr) => {
    if (curr === 'USD' || curr === 'INR') {
      setCurrencyState(curr);
    }
  };

  const symbol = currency === 'USD' ? '$' : '₹';

  const formatPrice = (inrAmount, usdAmount = null) => {
    if (currency === 'USD') {
      const finalUsd = usdAmount !== null && usdAmount !== undefined ? usdAmount : Math.round(Number(inrAmount) / 80);
      return `$${Number(finalUsd).toLocaleString('en-US')}`;
    }
    return `₹${Number(inrAmount).toLocaleString('en-IN')}`;
  };

  const convertAmount = (inrAmount, usdAmount = null) => {
    if (currency === 'USD') {
      return usdAmount !== null && usdAmount !== undefined ? usdAmount : Math.round(Number(inrAmount) / 80);
    }
    return Number(inrAmount);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        symbol,
        toggleCurrency,
        setCurrency,
        formatPrice,
        convertAmount,
        isUSD: currency === 'USD',
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;
