import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/aplicacion/store';
import { Text } from 'react-native';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <Text>App lista 🚀</Text>
    </Provider>
  );
}

export default App;