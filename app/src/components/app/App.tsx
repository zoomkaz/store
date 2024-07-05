import React from 'react';
import Main from '../../pages/main/Main';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { Routes, Route } from 'react-router-dom';
import Error from '../../pages/error/Error';
import Catalog from '../../pages/catalog/Catalog';
import ItemPage from '../../pages/itemPage/ItemPage';
import Admin from '../../pages/admin/Admin';
import Profile from '../../pages/profile/Profile';
import Info from '../profileComponents/info/Info';
import Orders from '../profileComponents/orders/Orders';
import Order from '../../pages/order/Order';
import { useAppInit } from '../../redux/hooks/useAppInit';

function App() {
  useAppInit()
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/category/:name' element={<Catalog />} />
        <Route path='/item/:name' element={<ItemPage />} />
        <Route path='/my/profile' element={<Profile children={<Info />} />} />
        <Route path='/my/orders' element={<Profile children={<Orders />} />} />
        <Route path='/order' element={<Order />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='*' element={<Error />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
