import React from 'react';
import Header from './components/common/Header';
import Home from './pages/Home';

export default function App() {
  return (
    <div>
      <Header />
      <main>
        <Home />
      </main>
    </div>
  );
}
