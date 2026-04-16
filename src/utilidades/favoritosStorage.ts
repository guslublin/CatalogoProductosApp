import AsyncStorage from '@react-native-async-storage/async-storage';
import { Producto } from '../funcionalidades/productos/productosTipos';

const CLAVE_FAVORITOS = '@catalogo_productos_favoritos';

export interface EstadoFavoritosPersistido {
  ids: number[];
  entidades: Record<number, Producto>;
}

export const guardarFavoritos = async (
  favoritos: EstadoFavoritosPersistido,
): Promise<void> => {
  await AsyncStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
};

export const cargarFavoritos = async (): Promise<EstadoFavoritosPersistido> => {
  const valor = await AsyncStorage.getItem(CLAVE_FAVORITOS);

  if (!valor) {
    return {
      ids: [],
      entidades: {},
    };
  }

  const favoritosParseados = JSON.parse(valor) as EstadoFavoritosPersistido;

  return {
    ids: favoritosParseados.ids ?? [],
    entidades: favoritosParseados.entidades ?? {},
  };
};