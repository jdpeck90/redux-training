import shop from '../api/shop';
const ADD_TO_CART = 'ADD_TO_CART';
const CHECKOUT_REQUEST = 'CHECKOUT_REQUEST';
const CHECKOUT_SUCCESS = 'CHECKOUT_SUCCESS';
const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';

const receiveProducts = products => ({
  type: RECEIVE_PRODUCTS,
  products,
  fn: console.log ('From actions/index receiveProducts', products),
});

export const getAllProducts = () => dispatch => {
  console.log ('From actions/index', shop);
  shop.getProducts (products => {
    console.log ('From actions/index shop.getProducts', products);
    dispatch (receiveProducts (products));
  });
};

const addToCartUnsafe = productId => ({
  type: ADD_TO_CART,
  productId,
});

export const addToCart = productId => (dispatch, getState) => {
  console.log ('from actions/index addToCart Dispatch->', dispatch);
  console.log ('from actions/index addToCart productId', productId);
  console.log ('from actions/index addToCart GetState->', getState ());
  if (getState ().products.byId[productId].inventory > 0) {
    dispatch (addToCartUnsafe (productId));
  }
};

export const checkout = products => (dispatch, getState) => {
  const {cart} = getState ();
  console.log ('from checkout action/index ------>', getState);

  dispatch ({
    type: CHECKOUT_REQUEST,
  });

  shop.buyProducts (products, () => {
    dispatch ({
      type: CHECKOUT_SUCCESS,
      cart,
    });
    console.log ('from end of action/index', dispatch);
    console.log ('from end of action/index2', shop);
    // Replace the line above with line below to rollback on failure:
    // dispatch({ type: types.CHECKOUT_FAILURE, cart })
  });
};
