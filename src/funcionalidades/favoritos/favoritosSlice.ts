import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Producto } from '../productos/productosTipos';

interface EstadoFavoritos {
  ids: number[];
  entidades: Record<number, Producto>;
}

const estadoInicial: EstadoFavoritos = {
  ids: [],
  entidades: {},
};

const favoritosSlice = createSlice({
  name: 'favoritos',
  initialState: estadoInicial,
  reducers: {
    agregarFavorito: (state, action: PayloadAction<Producto>) => {
      const producto = action.payload;

      if (!state.entidades[producto.id]) {
        state.ids.push(producto.id);
        state.entidades[producto.id] = producto;
      }
    },
    quitarFavorito: (state, action: PayloadAction<number>) => {
      const id = action.payload;

      state.ids = state.ids.filter(itemId => itemId !== id);
      delete state.entidades[id];
    },
    alternarFavorito: (state, action: PayloadAction<Producto>) => {
      const producto = action.payload;

      if (state.entidades[producto.id]) {
        state.ids = state.ids.filter(itemId => itemId !== producto.id);
        delete state.entidades[producto.id];
      } else {
        state.ids.push(producto.id);
        state.entidades[producto.id] = producto;
      }
    },
    establecerFavoritos: (state, action: PayloadAction<EstadoFavoritos>) => {
      state.ids = action.payload.ids;
      state.entidades = action.payload.entidades;
    },
  },
});

export const {
  agregarFavorito,
  quitarFavorito,
  alternarFavorito,
  establecerFavoritos,
} = favoritosSlice.actions;

export const favoritosReducer = favoritosSlice.reducer;