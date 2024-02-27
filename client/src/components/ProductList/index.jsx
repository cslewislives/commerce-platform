import { useEffect } from 'react';
import ProductItem from '../ProductItem';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';
import {
  productsUpdated,
  selectCurrentCategory,
  selectProducts
} from '../../utils/reducers';
import { useDispatch, useSelector } from 'react-redux';

function ProductList() {
  const dispatch = useDispatch();
  const currentCategory = useSelector(selectCurrentCategory);
  const stateProducts = useSelector(selectProducts);

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      dispatch(productsUpdated(data.products));
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get').then((products) => {
        dispatch(productsUpdated(products));
      });
    }
  }, [data, loading, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return stateProducts;
    }

    return stateProducts.filter(
      (product) => product.category._id === currentCategory
    );
  }

  return (
    <div className='my-2'>
      <h2>Our Products:</h2>
      {stateProducts.length ? (
        <div className='flex-row'>
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven&apos;t added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt='loading' /> : null}
    </div>
  );
}

export default ProductList;
