import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/aplicacion/store';
import { NavegadorPrincipal } from './src/navegacion/NavegadorPrincipal';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavegadorPrincipal />
    </Provider>
  );
}

export default App;