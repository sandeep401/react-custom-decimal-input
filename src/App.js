import React, { useState } from 'react';
import CustomDecimalInput from './components/CustomDecimalInput';
import './style.css';

export default function App() {
  const [decimalValue, setDecimalValue] = useState('0.00');

  const handleDecimalChange = (value) => {
    setDecimalValue(value);
  };

  return (
    <div>
      <h3>Current Decimal Value: {decimalValue}</h3>
      <CustomDecimalInput
        value={decimalValue}
        onChange={handleDecimalChange}
        step="0.01"
        placeholder="0.00"
      />
    </div>
  );
}
