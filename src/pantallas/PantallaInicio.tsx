import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppDispatch, useAppSelector } from '../aplicacion/hooks';
import {
  setBusqueda,
  obtenerProductos,
  refrescarProductos,
} from '../funcionalidades/productos/productosSlice';
import { Producto } from '../funcionalidades/productos/productosTipos';
import {
  RootStackParamList,
  TabParamList,
} from '../navegacion/NavegadorPrincipal';

type Props = BottomTabScreenProps<TabParamList, 'InicioTab'>;

function SkeletonCard() {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.skeletonImagen} />
      <View style={styles.info}>
        <View style={styles.skeletonTitulo} />
        <View style={styles.skeletonCategoria} />
        <View style={styles.skeletonPrecio} />
      </View>
    </View>
  );
}

export function PantallaInicio({ navigation }: Props) {
  const dispatch = useAppDispatch();

  const {
    items,
    status,
    error,
    hasMore,
    refrescando,
    textoBusqueda,
  } = useAppSelector(state => state.productos);

  const [textoLocal, setTextoLocal] = useState(textoBusqueda);
  const primeraCarga = useRef(true);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(obtenerProductos());
    }
  }, [dispatch, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (primeraCarga.current) {
        primeraCarga.current = false;
        return;
      }

      if (textoLocal === textoBusqueda) {
        return;
      }

      dispatch(setBusqueda(textoLocal));
      dispatch(obtenerProductos());
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, textoLocal, textoBusqueda]);

  const cargandoInicial = status === 'loading' && items.length === 0;
  const cargandoMas = status === 'loading' && items.length > 0;

  const onRefresh = () => {
    dispatch(refrescarProductos());
  };

  const onEndReached = () => {
    if (!cargandoMas && !refrescando && hasMore && status !== 'loading') {
      dispatch(obtenerProductos());
    }
  };

  const onReintentar = () => {
    dispatch(obtenerProductos());
  };

  const abrirDetalle = (producto: Producto) => {
    const parentNavigation =
      navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

    parentNavigation?.navigate('Detalle', { producto });
  };

  const renderItem = ({ item }: { item: Producto }) => (
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
        <Text style={styles.categoria}>{item.categoria}</Text>
        <Text style={styles.precio}>USD {item.precio.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  const footer = useMemo(() => {
    if (cargandoMas) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" />
          <Text style={styles.textoSecundario}>Cargando más productos...</Text>
        </View>
      );
    }

    if (!hasMore && items.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.textoSecundario}>Ya no hay más productos.</Text>
        </View>
      );
    }

    return <View style={{ height: 20 }} />;
  }, [cargandoMas, hasMore, items.length]);

  if (cargandoInicial) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titulo}>Catálogo de productos</Text>

        <TextInput
          value={textoLocal}
          onChangeText={setTextoLocal}
          placeholder="Buscar por título..."
          placeholderTextColor="#888"
          style={styles.input}
        />

        <View style={styles.lista}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'failed' && items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titulo}>Catálogo de productos</Text>

        <TextInput
          value={textoLocal}
          onChangeText={setTextoLocal}
          placeholder="Buscar por título..."
          placeholderTextColor="#888"
          style={styles.input}
        />

        <View style={styles.centrado}>
          <Text style={styles.error}>Ocurrió un error al cargar productos</Text>
          <Text style={styles.textoSecundario}>{error}</Text>

          <Pressable style={styles.botonReintentar} onPress={onReintentar}>
            <Text style={styles.textoBotonReintentar}>Reintentar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Catálogo de productos</Text>

      <TextInput
        value={textoLocal}
        onChangeText={setTextoLocal}
        placeholder="Buscar por título..."
        placeholderTextColor="#888"
        style={styles.input}
      />

      {status === 'loading' && items.length > 0 ? (
        <View style={styles.buscandoBox}>
          <ActivityIndicator size="small" />
          <Text style={styles.textoSecundario}>Buscando productos...</Text>
        </View>
      ) : null}

      {status === 'failed' && items.length > 0 ? (
        <View style={styles.errorInline}>
          <Text style={styles.errorInlineTexto}>
            Hubo un problema al actualizar los resultados.
          </Text>
          <Pressable style={styles.botonMini} onPress={onReintentar}>
            <Text style={styles.textoBotonMini}>Reintentar</Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centradoVacio}>
            <Text style={styles.textoSecundario}>
              No hay productos para mostrar.
            </Text>
          </View>
        }
        ListFooterComponent={footer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  input: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#111',
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
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
  categoria: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    textTransform: 'capitalize',
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
  centradoVacio: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  textoSecundario: {
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
  error: {
    fontSize: 18,
    fontWeight: '700',
    color: '#b00020',
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skeletonImagen: {
    width: '100%',
    height: 180,
    backgroundColor: '#e3e3e3',
  },
  skeletonTitulo: {
    height: 22,
    width: '75%',
    borderRadius: 8,
    backgroundColor: '#e3e3e3',
    marginBottom: 10,
  },
  skeletonCategoria: {
    height: 16,
    width: '35%',
    borderRadius: 8,
    backgroundColor: '#ececec',
    marginBottom: 10,
  },
  skeletonPrecio: {
    height: 20,
    width: '28%',
    borderRadius: 8,
    backgroundColor: '#e3e3e3',
  },
  botonReintentar: {
    marginTop: 16,
    backgroundColor: '#0b57d0',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  textoBotonReintentar: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  buscandoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  errorInline: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fdecec',
    borderWidth: 1,
    borderColor: '#f2b8b5',
  },
  errorInlineTexto: {
    color: '#8a1c1c',
    marginBottom: 8,
  },
  botonMini: {
    alignSelf: 'flex-start',
    backgroundColor: '#0b57d0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  textoBotonMini: {
    color: '#fff',
    fontWeight: '700',
  },
});