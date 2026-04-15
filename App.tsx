import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { store } from './src/aplicacion/store';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.texto}>Base Redux lista ✅</Text>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texto: {
    fontSize: 22,
    fontWeight: '600',
  },
});

export default App;