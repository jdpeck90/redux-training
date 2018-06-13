import React from 'react';
import CartContainer from './CartContainer';
import ProductsContainer from './ProductsContainer';

const App = () => (
  <div>
    <h2>Redux Shopping Cart</h2>
    <ProductsContainer />
    <br />
    <CartContainer />
  </div>
);

export default App;
