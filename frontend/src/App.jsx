import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderStatusPage from './pages/OrderStatusPage';

const App = () => (
  <>
    <Header />
    <Routes>
      <Route path="/"                   element={<MenuPage />} />
      <Route path="/checkout"           element={<CheckoutPage />} />
      <Route path="/order-status/:id"   element={<OrderStatusPage />} />
    </Routes>
  </>
);

export default App;