import React from 'react';
import SimpleCurrency from './pages/SimpleCurrency';

function SimpleApp() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <SimpleCurrency />
    </div>
  );
}

export default SimpleApp;