import React, { useEffect, useMemo, useState } from 'react';
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
  Button,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAppDispatch, useAppSelector } from '../aplicacion/hooks';

import {
  establecerTextoBusqueda,
  obtenerProductos,
  refrescarProductos,
} from '../funcionalidades/productos/productosSlice';

import { Producto } from '../funcionalidades/productos/productosTipos';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  RootStackParamList,
  TabParamList,
} from '../navegacion/NavegadorPrincipal';

type Props = BottomTabScreenProps<TabParamList, 'InicioTab'>;

export function PantallaInicio({ navigation }: Props) {
  const dispatch = useAppDispatch();

  const {
    items,
    estado,
    error,
    tieneMas,
    refrescando,
    textoBusqueda,
  } = useAppSelector(state => state.productos);

  const [textoLocal, setTextoLocal] = useState(textoBusqueda);

  useEffect(() => {
    if (estado === 'idle') {
      dispatch(obtenerProductos());
    }
  }, [dispatch, estado]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (textoLocal !== textoBusqueda) {
        dispatch(establecerTextoBusqueda(textoLocal));
        dispatch(obtenerProductos());
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, textoLocal, textoBusqueda]);

  const cargandoInicial = estado === 'loading' && items.length === 0;
  const cargandoMas = estado === 'loading' && items.length > 0;

  const onRefresh = () => {
    dispatch(refrescarProductos());
  };

  const onEndReached = () => {
    if (!cargandoMas && !refrescando && tieneMas) {
      dispatch(obtenerProductos());
    }
  };

  const renderItem = ({ item }: { item: Producto }) => (
    <TouchableOpacity
      style={styles.tarjeta}
      activeOpacity={0.9}
      onPress={() => {
        const parentNavigation =
          navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
        parentNavigation?.navigate('Detalle', { producto: item });
      }}
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

  const pieLista = useMemo(() => {
    if (cargandoMas) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" />
          <Text style={styles.textoSecundario}>Cargando más productos...</Text>
        </View>
      );
    }

    if (!tieneMas && items.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.textoSecundario}>Ya no hay más productos.</Text>
        </View>
      );
    }

    return <View style={{ height: 20 }} />;
  }, [cargandoMas, tieneMas, items.length]);

  if (cargandoInicial) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" />
        <Text style={styles.textoSecundario}>Cargando productos...</Text>
      </View>
    );
  }

  if (estado === 'failed' && items.length === 0) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>Ocurrió un error</Text>
        <Text style={styles.textoSecundario}>{error}</Text>
        <Button title="Reintentar" onPress={() => dispatch(obtenerProductos())} />
      </View>
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

      <FlatList
        data={items}
        keyExtractor={(item, index) => `${item.id}-${index}`}
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
        ListFooterComponent={pieLista}
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
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});