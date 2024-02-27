import { useDispatch } from 'react-redux';
import { idbPromise } from '../../utils/helpers';
import { removedFromCart, cartQuantityUpdated } from '../../utils/reducers';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const removeFromCart = (item) => {
    dispatch(
      removedFromCart({
        _id: item._id
      })
    );
    idbPromise('cart', 'delete', { ...item });
  };

  const onChange = (e) => {
    const value = e.target.value;
    if (value === '0') {
      dispatch(
        removedFromCart({
          _id: item._id
        })
      );
      idbPromise('cart', 'delete', { ...item });
    } else {
      dispatch(
        cartQuantityUpdated({
          _id: item._id,
          purchaseQuantity: parseInt(value)
        })
      );
      idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });
    }
  };

  return (
    <div className='flex-row'>
      <div>
        <img src={`/images/${item.image}`} alt='' />
      </div>
      <div>
        <div>
          {item.name}, ${item.price}
        </div>
        <div>
          <span>Qty:</span>
          <input
            type='number'
            placeholder='1'
            value={item.purchaseQuantity}
            onChange={onChange}
          />
          <span
            role='img'
            aria-label='trash'
            onClick={() => removeFromCart(item)}>
            🗑️
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
