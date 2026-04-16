import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import { PantallaInicio } from '../pantallas/PantallaInicio';
import { PantallaDetalle } from '../pantallas/PantallaDetalle';
import { PantallaFavoritos } from '../pantallas/PantallaFavoritos';
import { Producto } from '../funcionalidades/productos/productosTipos';

export type RootStackParamList = {
  Tabs: undefined;
  Detalle: { producto: Producto };
};

export type TabParamList = {
  InicioTab: undefined;
  FavoritosTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0b57d0',
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="InicioTab"
        component={PantallaInicio}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⌂</Text>,
        }}
      />
      <Tab.Screen
        name="FavoritosTab"
        component={PantallaFavoritos}
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>♡</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export function NavegadorPrincipal() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={TabsNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detalle"
          component={PantallaDetalle}
          options={{ title: 'Detalle del producto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}