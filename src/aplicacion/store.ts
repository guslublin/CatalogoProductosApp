import { configureStore } from '@reduxjs/toolkit';
import { productosReducer } from '../funcionalidades/productos/productosSlice';
import { favoritosReducer } from '../funcionalidades/favoritos/favoritosSlice';

export const store = configureStore({
  reducer: {
    productos: productosReducer,
    favoritos: favoritosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;