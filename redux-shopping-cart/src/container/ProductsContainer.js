import React from 'react';
import {connect} from 'react-redux';
import {addToCart} from '../actions';
import {getVisibleProducts} from '../reducers/products';
import ProductItem from '../component/ProductItem';
import ProductList from '../component/ProductList';

const ProductsContainer = ({products, addToCart}) => (
  <ProductList title="Products">
    {products.map (product => (
      <ProductItem
        key={product.id}
        product={product}
        onAddToCartClicked={() => addToCart (product.id)}
      />
    ))}
  </ProductList>
);

const mapStateToProps = state => ({
  products: getVisibleProducts (state.products),
});

export default connect (mapStateToProps, {addToCart}) (ProductsContainer);
