import React, { useRef, useEffect, useState } from 'react';

const CustomDecimalInput = ({
  value,
  onChange,
  step = '0.01',
  placeholder = '0.00',
}) => {
  const inputRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(null); // Track the cursor position

  // Parse the step into integer and decimal parts
  const parseStep = () => {
    const [stepInteger, stepDecimal] = step.split('.').map(Number);
    console.log(stepInteger, stepDecimal);
    return {
      integerStep: stepInteger || 0,
      decimalStep: stepDecimal || 0,
      decimalPlaces: (step.split('.')[1] || '').length, // Count of decimal places in the step
    };
  };

  console.log(parseStep());

  const { integerStep, decimalStep, decimalPlaces } = parseStep();

  // Function to determine if the cursor is on the left (integer part) or right (decimal part) side
  const isCursorOnLeftSide = () => {
    const cursorPosition = inputRef.current.selectionStart;
    return cursorPosition <= value.indexOf('.'); // Cursor is on the left if it's before or on the decimal point
  };

  // Set the cursor to the correct position after the value is updated
  const restoreCursorPosition = (position) => {
    inputRef.current.setSelectionRange(position, position);
  };

  // Function to increment either left or right side based on cursor position
  const incrementValue = () => {
    const currentCursorPos = inputRef.current.selectionStart; // Capture cursor position

    if (value === '' || isNaN(value)) {
      onChange(
        `${integerStep}.${decimalStep.toString().padStart(decimalPlaces, '0')}`
      );
    } else {
      let [integerPart, decimalPart] = value.split('.').map(Number);
      if (isCursorOnLeftSide()) {
        // Increment integer part by integer step
        integerPart += integerStep;
      } else {
        // Increment decimal part by decimal step
        decimalPart += decimalStep;
        if (decimalPart >= Math.pow(10, decimalPlaces)) {
          decimalPart = decimalPart % Math.pow(10, decimalPlaces); // Roll over the decimal part
          integerPart += integerStep; // Increment the integer part
        }
      }
      const formattedDecimalPart = decimalPart
        .toString()
        .padStart(decimalPlaces, '0');
      onChange(`${integerPart}.${formattedDecimalPart}`);
    }

    setCursorPosition(currentCursorPos); // Save the cursor position to restore later
  };

  // Function to decrement either left or right side based on cursor position
  const decrementValue = () => {
    const currentCursorPos = inputRef.current.selectionStart; // Capture cursor position

    if (value === '' || isNaN(value)) {
      onChange(
        `-${integerStep}.${decimalStep.toString().padStart(decimalPlaces, '0')}`
      );
    } else {
      let [integerPart, decimalPart] = value.split('.').map(Number);
      if (isCursorOnLeftSide()) {
        // Decrement integer part by integer step
        integerPart -= integerStep;
      } else {
        // Decrement decimal part by decimal step
        decimalPart -= decimalStep;
        if (decimalPart < 0) {
          decimalPart = Math.pow(10, decimalPlaces) + decimalPart; // Roll over the decimal part
          integerPart -= integerStep; // Decrement the integer part
        }
      }
      const formattedDecimalPart = decimalPart
        .toString()
        .padStart(decimalPlaces, '0');
      onChange(`${integerPart}.${formattedDecimalPart}`);
    }

    setCursorPosition(currentCursorPos); // Save the cursor position to restore later
  };

  // Handle direct manual input
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    const currentCursorPos = e.target.selectionStart; // Capture cursor position before value change
    // Allow only numbers, decimal, and empty string
    if (/^-?\d*(\.\d{0,2})?$/.test(newValue) || newValue === '') {
      onChange(newValue);
      setCursorPosition(currentCursorPos); // Save the cursor position to restore later
    }
  };

  // Function to handle key down events for arrow keys
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      // Increment on ⬆️ key press
      e.preventDefault(); // Prevent default behavior of the arrow key
      incrementValue();
    } else if (e.key === 'ArrowDown') {
      // Decrement on ⬇️ key press
      e.preventDefault();
      decrementValue();
    }
  };

  useEffect(() => {
    // Attach event listener to handle keyboard input
    const inputElement = inputRef.current;
    inputElement.addEventListener('keydown', handleKeyDown);

    // Restore the cursor position after the value changes
    if (cursorPosition !== null) {
      restoreCursorPosition(cursorPosition);
    }

    // Clean up event listener on component unmount
    return () => {
      inputElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [value, cursorPosition]); // Rerun the effect when the value or cursor position changes

  return (
    <div>
      <input
        ref={inputRef} // Ref to track cursor position
        type="text"
        value={value}
        onChange={handleInputChange}
        step={step}
        placeholder={placeholder}
      />
      <button type="button" onClick={incrementValue}>
        Increment
      </button>
      <button type="button" onClick={decrementValue}>
        Decrement
      </button>
    </div>
  );
};

export default CustomDecimalInput;
