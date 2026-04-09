import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import App from './App.jsx';
import SchoolPage from './SchoolPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/school/:slug" element={<SchoolPage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  </React.StrictMode>
);
