import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import './styles/styles.css'; // Import global CSS styles.

// Render the App component inside the root element in index.html.

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);




