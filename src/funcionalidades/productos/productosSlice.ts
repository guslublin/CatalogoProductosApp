import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { obtenerProductosApi, buscarProductosApi } from '../../api/productosApi';
import { Producto } from './productosTipos';
import { RootState } from '../../aplicacion/store';

type EstadoCarga = 'idle' | 'loading' | 'succeeded' | 'failed';

interface EstadoProductos {
  items: Producto[];
  status: EstadoCarga;
  error: string | null;
  page: number;
  limite: number;
  hasMore: boolean;
  textoBusqueda: string;
  refrescando: boolean;
}

const estadoInicial: EstadoProductos = {
  items: [],
  status: 'idle',
  error: null,
  page: 0,
  limite: 10,
  hasMore: true,
  textoBusqueda: '',
  refrescando: false,
};

const unirSinDuplicados = (
  actuales: Producto[],
  nuevos: Producto[],
): Producto[] => {
  const mapa = new Map<number, Producto>();

  for (const producto of actuales) {
    mapa.set(producto.id, producto);
  }

  for (const producto of nuevos) {
    mapa.set(producto.id, producto);
  }

  return Array.from(mapa.values());
};

export const obtenerProductos = createAsyncThunk<
  { productos: Producto[]; total: number },
  void,
  { state: RootState }
>('productos/obtenerProductos', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const { page, limite, textoBusqueda } = state.productos;

  const skip = page * limite;

  if (textoBusqueda.trim()) {
    return await buscarProductosApi(textoBusqueda, limite, skip);
  }

  return await obtenerProductosApi(limite, skip);
});

export const refrescarProductos = createAsyncThunk<
  { productos: Producto[]; total: number },
  void,
  { state: RootState }
>('productos/refrescarProductos', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const { limite, textoBusqueda } = state.productos;

  if (textoBusqueda.trim()) {
    return await buscarProductosApi(textoBusqueda, limite, 0);
  }

  return await obtenerProductosApi(limite, 0);
});

const productosSlice = createSlice({
  name: 'productos',
  initialState: estadoInicial,
  reducers: {
    setBusqueda: (state, action: PayloadAction<string>) => {
      state.textoBusqueda = action.payload;
      state.page = 0;
      state.hasMore = true;
      state.error = null;
    },
    limpiarProductos: state => {
      state.items = [];
      state.page = 0;
      state.hasMore = true;
      state.status = 'idle';
      state.error = null;
      state.textoBusqueda = '';
      state.refrescando = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(obtenerProductos.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(obtenerProductos.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const nuevos = action.payload.productos;

        if (state.page === 0) {
          state.items = nuevos;
        } else {
          state.items = unirSinDuplicados(state.items, nuevos);
        }

        state.page += 1;
        state.hasMore = state.items.length < action.payload.total;
      })
      .addCase(obtenerProductos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error al cargar productos';
      })
      .addCase(refrescarProductos.pending, state => {
        state.refrescando = true;
        state.error = null;
      })
      .addCase(refrescarProductos.fulfilled, (state, action) => {
        state.refrescando = false;
        state.status = 'succeeded';
        state.items = action.payload.productos;
        state.page = 1;
        state.hasMore = state.items.length < action.payload.total;
      })
      .addCase(refrescarProductos.rejected, (state, action) => {
        state.refrescando = false;
        state.error = action.error.message || 'Error al refrescar';
      });
  },
});

export const { setBusqueda, limpiarProductos } = productosSlice.actions;

export default productosSlice.reducer;