import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { buscarProductosApi, obtenerProductosApi } from '../../api/productosApi';
import { EstadoCarga, Producto } from './productosTipos';

interface EstadoProductos {
  items: Producto[];
  estado: EstadoCarga;
  error: string | null;
  pagina: number;
  limite: number;
  tieneMas: boolean;
  textoBusqueda: string;
  refrescando: boolean;
}

const estadoInicial: EstadoProductos = {
  items: [],
  estado: 'idle',
  error: null,
  pagina: 0,
  limite: 10,
  tieneMas: true,
  textoBusqueda: '',
  refrescando: false,
};

export const obtenerProductos = createAsyncThunk(
  'productos/obtenerProductos',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const { pagina, limite, textoBusqueda } = state.productos as EstadoProductos;

      const salto = pagina * limite;

      if (textoBusqueda.trim()) {
        const respuesta = await buscarProductosApi(textoBusqueda, limite, salto);
        return respuesta;
      }

      const respuesta = await obtenerProductosApi(limite, salto);
      return respuesta;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Ocurrió un error al obtener productos');
    }
  }
);

export const refrescarProductos = createAsyncThunk(
  'productos/refrescarProductos',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const { limite, textoBusqueda } = state.productos as EstadoProductos;

      if (textoBusqueda.trim()) {
        const respuesta = await buscarProductosApi(textoBusqueda, limite, 0);
        return respuesta;
      }

      const respuesta = await obtenerProductosApi(limite, 0);
      return respuesta;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Ocurrió un error al refrescar productos');
    }
  }
);

const productosSlice = createSlice({
  name: 'productos',
  initialState: estadoInicial,
  reducers: {
    establecerTextoBusqueda: (state, action: PayloadAction<string>) => {
      state.textoBusqueda = action.payload;
      state.pagina = 0;
      state.items = [];
      state.tieneMas = true;
      state.error = null;
    },
    reiniciarProductos: state => {
      state.items = [];
      state.estado = 'idle';
      state.error = null;
      state.pagina = 0;
      state.tieneMas = true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(obtenerProductos.pending, state => {
        state.estado = 'loading';
        state.error = null;
      })
      .addCase(obtenerProductos.fulfilled, (state, action) => {
        state.estado = 'succeeded';

        const nuevosProductos = action.payload.productos;
        const total = action.payload.total;

        if (state.pagina === 0) {
          state.items = nuevosProductos;
        } else {
          state.items = [...state.items, ...nuevosProductos];
        }

        const cantidadActual = state.items.length;
        state.tieneMas = cantidadActual < total;
        state.pagina += 1;
      })
      .addCase(obtenerProductos.rejected, (state, action) => {
        state.estado = 'failed';
        state.error = (action.payload as string) || 'Error al obtener productos';
      })
      .addCase(refrescarProductos.pending, state => {
        state.refrescando = true;
        state.error = null;
      })
      .addCase(refrescarProductos.fulfilled, (state, action) => {
        state.refrescando = false;
        state.estado = 'succeeded';
        state.items = action.payload.productos;
        state.pagina = 1;
        state.tieneMas = action.payload.productos.length < action.payload.total;
      })
      .addCase(refrescarProductos.rejected, (state, action) => {
        state.refrescando = false;
        state.error = (action.payload as string) || 'Error al refrescar productos';
      });
  },
});

export const { establecerTextoBusqueda, reiniciarProductos } = productosSlice.actions;
export const productosReducer = productosSlice.reducer;