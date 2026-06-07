import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './css/style.css';
import {Header} from './components/Header';
import {Main} from './components/Main';
import {Footer} from './components/Footer';
import {Autorization} from './components/Autorization';
import {Search} from './components/Search';
import { ResultSearch } from './components/ResultSearch';
import { MenuBurger } from './components/MenuBurger';

function App() {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1440);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1440);
      if (window.innerWidth >= 1440) {
        setIsBurgerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openBurger = () => {
    console.log("openBurger called"); // Проверка
    setIsBurgerOpen(true);
  };

  const closeBurger = () => {
    console.log("closeBurger called"); // Проверка
    setIsBurgerOpen(false);
  };

  console.log("isBurgerOpen:", isBurgerOpen); // Проверка состояния

  return (
    <>
      <Header onBurgerClick={openBurger} isLargeScreen={isLargeScreen} />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/autorization" element={<Autorization />} />
        <Route path="/search" element={<Search />} />
        <Route path="/result-search" element={<ResultSearch />} />
      </Routes>
      <Footer />
      
      {isBurgerOpen && <MenuBurger onClose={closeBurger} />}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);