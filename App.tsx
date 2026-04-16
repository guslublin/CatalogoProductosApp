import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/aplicacion/store';
import { NavegadorPrincipal } from './src/navegacion/NavegadorPrincipal';
import { useAppDispatch, useAppSelector } from './src/aplicacion/hooks';
import { establecerFavoritos } from './src/funcionalidades/favoritos/favoritosSlice';
import {
  cargarFavoritos,
  guardarFavoritos,
} from './src/utilidades/favoritosStorage';

function PersistenciaFavoritos(): React.JSX.Element | null {
  const dispatch = useAppDispatch();
  const favoritos = useAppSelector(state => state.favoritos);
  const cargadoInicial = useRef(false);

  useEffect(() => {
    const inicializar = async () => {
      try {
        const favoritosGuardados = await cargarFavoritos();
        dispatch(establecerFavoritos(favoritosGuardados));
      } catch (error) {
        console.warn('No se pudieron cargar los favoritos guardados', error);
      } finally {
        cargadoInicial.current = true;
      }
    };

    inicializar();
  }, [dispatch]);

  useEffect(() => {
    if (!cargadoInicial.current) {
      return;
    }

    guardarFavoritos(favoritos).catch(error => {
      console.warn('No se pudieron guardar los favoritos', error);
    });
  }, [favoritos]);

  return null;
}

function AppContent(): React.JSX.Element {
  return (
    <>
      <PersistenciaFavoritos />
      <NavegadorPrincipal />
    </>
  );
}

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;