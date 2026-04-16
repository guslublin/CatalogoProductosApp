# Catálogo de Productos App

Aplicación móvil desarrollada en **React Native CLI** con **TypeScript** que consume una API pública de productos, permite visualizar un listado paginado, buscar productos por título, ver el detalle de cada producto y administrar favoritos con Redux y persistencia local.

## Tecnologías utilizadas

- React Native CLI
- TypeScript
- Redux Toolkit
- React Redux
- Axios
- React Navigation
- AsyncStorage

## Funcionalidades implementadas

### 1. Listado de productos
La pantalla principal muestra un catálogo de productos consumidos desde una API pública.

Incluye:

- imagen
- título
- precio
- loading visual
- manejo de errores
- botón de reintento
- pull to refresh
- paginación por scroll

### 2. Búsqueda
La pantalla principal incluye un buscador por título con debounce para evitar recargas innecesarias mientras el usuario escribe.

### 3. Detalle de producto
Al tocar un producto se abre una pantalla de detalle con:

- imagen grande
- título
- categoría
- precio
- descripción

Desde esta pantalla se puede:

- agregar a favoritos
- quitar de favoritos

### 4. Favoritos
Existe una pestaña de favoritos donde se listan los productos marcados por el usuario.

Los favoritos están gestionados con Redux y almacenados en una estructura normalizada por `ids` y `entities`.

### 5. Persistencia local
Los favoritos se guardan localmente con AsyncStorage, de modo que al cerrar y volver a abrir la aplicación se conservan.  

## API utilizada

Se utiliza **DummyJSON** como API pública de productos.

El proyecto trabaja con dos endpoints principales:

- listado paginado de productos
- búsqueda de productos por título

La lógica de consumo de API está centralizada en el módulo `src/api/productosApi.ts`, reutilizando una instancia de Axios configurada en `src/api/clienteAxios.ts`.


Antes de ejecutar el proyecto, es necesario contar con el siguiente entorno configurado:

### 6. Herramientas generales
Node.js 22.11.0 o superior
npm
Git

Para Android
Android Studio
Android SDK
Emulador Android o dispositivo físico
Variables de entorno configuradas correctamente

### 7. Instalación del proyecto
1. Clonar el repositorio
git clone https://github.com/guslublin/CatalogoProductosApp.git
cd CatalogoProductosApp

2. Instalar dependencias
npm install

### 8. Configuración para Android

React Native necesita conocer la ubicación del SDK de Android.

1. Verificar instalación del SDK

Ruta habitual:

/Users/TU_USUARIO/Library/Android/sdk

2. Crear/Modificar archivo local.properties

Dentro de la carpeta android/ modificar local.properties:

- sdk.dir=/Users/TU_USUARIO/Library/Android/sdk

3. Configurar variables de entorno (En el caso de ser necesario)

- Editar ~/.zshrc o ~/.bashrc:

export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

Aplicar cambios:
(Mac)
- source ~/.zshrc

### 8. Ejecución del proyecto

1. Levantar Metro en una terminal
- npm start

2. Ejecutar en Android en otra terminal (Visualizar el desarrollo en emulador o en dispositivo Android conectado en modo desarrollador)
- npm run android


## Configuración adicional requerida (Android)

Durante la configuración del entorno, fue necesario instalar componentes adicionales desde Android Studio para asegurar el correcto funcionamiento del proyecto.

Estos componentes se pueden instalar desde:

Android Studio → Settings → Android SDK → SDK Tools

Se deben tener instalados:

- NDK (Side by side)
- Android SDK Command-line Tools (latest)
- CMake
