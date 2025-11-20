import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizPlayLanding from './App';
import ProductDetailPage from './ProductDetailPage';

export default function RouterWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuizPlayLanding />} />
        <Route path="/product-detail/:id" element={<ProductDetailPage />} />
        <Route path="*" element={<QuizPlayLanding />} />
      </Routes>
    </Router>
  );
}