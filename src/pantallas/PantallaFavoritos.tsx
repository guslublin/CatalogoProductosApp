import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppSelector } from '../aplicacion/hooks';
import { Producto } from '../funcionalidades/productos/productosTipos';
import {
  RootStackParamList,
  TabParamList,
} from '../navegacion/NavegadorPrincipal';

type Props = BottomTabScreenProps<TabParamList, 'FavoritosTab'>;

export function PantallaFavoritos({ navigation }: Props) {
  const favoritos = useAppSelector(state => state.favoritos);

  const listaFavoritos = useMemo(
    () => favoritos.ids.map(id => favoritos.entidades[id]).filter(Boolean),
    [favoritos]
  );

  const abrirDetalle = (producto: Producto) => {
    const parentNavigation =
      navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    parentNavigation?.navigate('Detalle', { producto });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Favoritos</Text>

      <FlatList
        data={listaFavoritos}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tarjeta}
            activeOpacity={0.9}
            onPress={() => abrirDetalle(item)}
          >
            <Image
              source={{ uri: item.imagenPrincipal }}
              style={styles.imagen}
              resizeMode="cover"
            />
            <View style={styles.info}>
              <Text style={styles.nombre} numberOfLines={2}>
                {item.titulo}
              </Text>
              <Text style={styles.precio}>USD {item.precio.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.centrado}>
            <Text style={styles.textoSecundario}>
              Todavía no agregaste productos a favoritos.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  imagen: {
    width: '100%',
    height: 180,
    backgroundColor: '#eee',
  },
  info: {
    padding: 14,
  },
  nombre: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  precio: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#0b57d0',
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  textoSecundario: {
    color: '#666',
    textAlign: 'center',
  },
});