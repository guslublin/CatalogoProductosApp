export interface Producto {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagenPrincipal: string;
  imagenes: string[];
}

export interface RespuestaProductosApi {
  products: any[];
  total: number;
  skip: number;
  limit: number;
}

export type EstadoCarga = 'idle' | 'loading' | 'succeeded' | 'failed';