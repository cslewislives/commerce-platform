import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/client';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  multipleAddedToCart,
  cartToggled,
  selectCartOpen,
  selectCartItems
} from '../../utils/reducers';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = () => {
  const dispatch = useDispatch();
  const cartOpen = useSelector(selectCartOpen);
  const cartItems = useSelector(selectCartItems);
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise('cart', 'get');
      dispatch(
        multipleAddedToCart({
          products: [...cart]
        })
      );
    }

    if (!cartItems.length) {
      getCart();
    }
  }, [cartItems.length, dispatch]);

  function toggleCart() {
    dispatch(cartToggled());
  }

  function calculateTotal() {
    let sum = 0;
    cartItems.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  function submitCheckout() {
    const productIds = [];

    cartItems.forEach((item) => {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });

    getCheckout({
      variables: { products: productIds }
    });
  }

  if (!cartOpen) {
    return (
      <div className='cart-closed' onClick={toggleCart}>
        <span role='img' aria-label='trash'>
          🛒
        </span>
      </div>
    );
  }

  return (
    <div className='cart'>
      <div className='close' onClick={toggleCart}>
        [close]
      </div>
      <h2>Shopping Cart</h2>
      {cartItems.length ? (
        <div>
          {cartItems.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}

          <div className='flex-row space-between'>
            <strong>Total: ${calculateTotal()}</strong>

            {Auth.loggedIn() ? (
              <button onClick={submitCheckout}>Checkout</button>
            ) : (
              <span>(log in to check out)</span>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role='img' aria-label='shocked'>
            😱
          </span>
          You haven&apos;t added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

export default Cart;
