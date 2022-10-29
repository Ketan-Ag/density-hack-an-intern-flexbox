import React from 'react';
import Portfolio from "./components/PortfolioPage/Portfolio";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrderPage from './components/OrderPage/OrderPage';
import UserState from './Context/UserState';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div className="App">
      <UserState>
        <BrowserRouter>
        <Routes>
          <Route path='/' element={<Portfolio />} />
          <Route path='/order' element={<OrderPage />} />
        </Routes>
        </BrowserRouter>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </UserState>
    </div>
  );
}

export default App;
