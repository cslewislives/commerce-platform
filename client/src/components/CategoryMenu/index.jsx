import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import {
  categoriesUpdated,
  currentCategoryUpdated,
  selectCategories
} from '../../utils/reducers';

function CategoryMenu() {
  const dispatch = useDispatch();
  const stateCategories = useSelector(selectCategories);

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData && categoryData.categories) {
      dispatch(categoriesUpdated(categoryData.categories));
      categoryData.categories.forEach((category) => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then((categories) => {
        dispatch(categoriesUpdated(categories));
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = (id) => {
    dispatch(currentCategoryUpdated(id));
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {stateCategories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}>
          {item.name}
        </button>
      ))}
      <button
        onClick={() => {
          handleClick('');
        }}>
        All
      </button>
    </div>
  );
}

export default CategoryMenu;
