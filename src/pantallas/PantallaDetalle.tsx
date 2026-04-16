import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAppDispatch, useAppSelector } from '../aplicacion/hooks';
import { alternarFavorito } from '../funcionalidades/favoritos/favoritosSlice';
import { RootStackParamList } from '../navegacion/NavegadorPrincipal';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalle'>;

export function PantallaDetalle({ route }: Props) {
  const { producto } = route.params;
  const dispatch = useAppDispatch();

  const esFavorito = useAppSelector(
    state => Boolean(state.favoritos.entidades[producto.id])
  );

  const onAlternarFavorito = () => {
    dispatch(alternarFavorito(producto));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image
          source={{ uri: producto.imagenPrincipal }}
          style={styles.imagen}
          resizeMode="cover"
        />

        <View style={styles.caja}>
          <Text style={styles.titulo}>{producto.titulo}</Text>
          <Text style={styles.categoria}>{producto.categoria}</Text>
          <Text style={styles.precio}>USD {producto.precio.toFixed(2)}</Text>

          <Text style={styles.subtitulo}>Descripción</Text>
          <Text style={styles.descripcion}>{producto.descripcion}</Text>

          <TouchableOpacity
            style={[
              styles.boton,
              esFavorito ? styles.botonQuitar : styles.botonAgregar,
            ]}
            onPress={onAlternarFavorito}
          >
            <Text style={styles.textoBoton}>
              {esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scroll: {
    paddingBottom: 24,
  },
  imagen: {
    width: '100%',
    height: 300,
    backgroundColor: '#eaeaea',
  },
  caja: {
    padding: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
  },
  categoria: {
    marginTop: 8,
    fontSize: 15,
    color: '#666',
    textTransform: 'capitalize',
  },
  precio: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '700',
    color: '#0b57d0',
  },
  subtitulo: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  descripcion: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  boton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  botonAgregar: {
    backgroundColor: '#0b57d0',
  },
  botonQuitar: {
    backgroundColor: '#c62828',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});