import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer, { 
  addToWishlist, 
  removeFromWishlist, 
  selectIsWishlisted 
} from './wishlistSlice';

const mockStore = () => configureStore({
  reducer: {
    wishlist: wishlistReducer
  }
});

describe('wishlistSlice', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore();
  });

  describe('addToWishlist', () => {
    it('should add movie to wishlist', () => {
      store.dispatch(addToWishlist('movie1'));
      
      const state = store.getState().wishlist;
      expect(state.items).toContain('movie1');
    });

    it('should not add duplicate movies', () => {
      store.dispatch(addToWishlist('movie1'));
      store.dispatch(addToWishlist('movie1'));
      
      const state = store.getState().wishlist;
      expect(state.items).toEqual(['movie1']);
    });
  });

  describe('removeFromWishlist', () => {
    beforeEach(() => {
      store.dispatch(addToWishlist('movie1'));
      store.dispatch(addToWishlist('movie2'));
    });

    it('should remove movie from wishlist', () => {
      store.dispatch(removeFromWishlist('movie1'));
      
      const state = store.getState().wishlist;
      expect(state.items).toEqual(['movie2']);
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      store.dispatch(addToWishlist('movie1'));
    });

    it('should check if movie is wishlisted', () => {
      const isWishlisted = selectIsWishlisted(store.getState(), 'movie1');
      const isNotWishlisted = selectIsWishlisted(store.getState(), 'movie2');

      expect(isWishlisted).toBe(true);
      expect(isNotWishlisted).toBe(false);
    });
  });
});
