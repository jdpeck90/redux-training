import React from 'react';
import Product from './Product';
import PropTypes from 'prop-types';

const ProductItem = ({product, onAddToCartClicked}) => (
  <div>
    {console.log ('Console from ProductItem', product)}
    <Product
      title={product.title}
      price={product.price}
      quantity={product.inventory}
    />

    <button
      onClick={onAddToCartClicked}
      disabled={product.inventory > 0 ? '' : 'disabled'}
    >
      {product.inventory > 0 ? 'Add To Cart' : 'Sold Out'}
    </button>
  </div>
);

ProductItem.propTypes = {
  product: PropTypes.shape ({
    title: PropTypes.string,
    price: PropTypes.number,
    quantity: PropTypes.number,
  }).isRequired,
  onAddToCartClicked: PropTypes.func.isRequired,
};

export default ProductItem;
