import React from 'react';
import PropTypes from 'prop-types';

const ProductList = ({title, children}) => (
  <div>
    <h3>{title}</h3>
    <div>{children}</div>
  </div>
);

ProductList.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default ProductList;
