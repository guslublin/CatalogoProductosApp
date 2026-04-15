import { clienteAxios } from './clienteAxios';
import { Producto, RespuestaProductosApi } from '../funcionalidades/productos/productosTipos';

const mapearProducto = (productoApi: any): Producto => ({
  id: productoApi.id,
  titulo: productoApi.title,
  descripcion: productoApi.description,
  precio: productoApi.price,
  categoria: productoApi.category,
  imagenPrincipal: productoApi.thumbnail,
  imagenes: productoApi.images ?? [],
});

export const obtenerProductosApi = async (limite: number, salto: number) => {
  const respuesta = await clienteAxios.get<RespuestaProductosApi>(
    `/products?limit=${limite}&skip=${salto}`
  );

  return {
    productos: respuesta.data.products.map(mapearProducto),
    total: respuesta.data.total,
    skip: respuesta.data.skip,
    limit: respuesta.data.limit,
  };
};

export const buscarProductosApi = async (
  textoBusqueda: string,
  limite: number,
  salto: number,
) => {
  const respuesta = await clienteAxios.get<RespuestaProductosApi>(
    `/products/search?q=${encodeURIComponent(textoBusqueda)}&limit=${limite}&skip=${salto}`
  );

  return {
    productos: respuesta.data.products.map(mapearProducto),
    total: respuesta.data.total,
    skip: respuesta.data.skip,
    limit: respuesta.data.limit,
  };
};