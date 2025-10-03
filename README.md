# 📌 Sistema de Gestión (CRUD Países, Regiones, Ciudades, Compañías y Sucursales)

Este proyecto es una aplicación web sencilla para la **gestión
jerárquica de entidades**:\
**Países → Regiones → Ciudades → Compañías → Sucursales**

Permite realizar operaciones **CRUD (Crear, Leer, Actualizar,
Eliminar)** en cada entidad, con una interfaz amigable y conexión a un
servidor local con **JSON Server**.

------------------------------------------------------------------------

## 📂 Estructura del Proyecto

    ├── index.html          # Página principal con todas las vistas integradas
    ├── countries.html      # CRUD independiente de Países
    ├── regiones.html       # CRUD independiente de Regiones
    ├── cities.html         # CRUD independiente de Ciudades
    ├── companies.html      # CRUD independiente de Compañías
    ├── brenches.html       # CRUD independiente de Sucursales
    ├── styles.css          # Estilos principales (diseño moderno y responsivo)
    ├── script.js           # Lógica CRUD con fetch API
    ├── db.json             # Base de datos usada por JSON Server

------------------------------------------------------------------------

## ⚙️ Instalación y Configuración

1. Clona este repositorio o descarga los archivos.

2. Instala [JSON Server](https://github.com/typicode/json-server) si no
   lo tienes:

   ``` bash
   npm install -g json-server
   ```

3. Inicia el servidor JSON en el archivo `db.json`:

   ``` bash
   json-server --watch db.json --port 3000
   ```

4. Abre el archivo `index.html` en tu navegador.

------------------------------------------------------------------------

## 📑 Entidades y Relaciones

-   **Países (`/countries`)**
    -   id, name
-   **Regiones (`/regions`)**
    -   id, name, countryId
-   **Ciudades (`/cities`)**
    -   id, name, regionId
-   **Compañías (`/companies`)**
    -   id, name, cityId
-   **Sucursales (`/branches`)**
    -   id, name, companyId

Ejemplo de datos (`db.json`):

``` json
{
  "countries": [
    { "id": 1, "name": "Colombia" }
  ],
  "regions": [
    { "id": 1, "name": "Antioquia", "Santander": 1 }
  ],
  "cities": [
    { "id": 1, "name": "Medellín", "Bucaramanga": 1 }
  ],
  "companies": [
    { "id": 1, "name": "Empresa A", "Empresa B": 1 }
  ],
  "branches": [
    { "id": 1, "name": "Sucursal Centro", "companyId": 1 }
  ]
}
```

------------------------------------------------------------------------

## 🖥️ Funcionalidades

✅ **Agregar** nuevas entidades\
✅ **Listar** registros en tablas dinámicas\
✅ **Editar** nombres directamente en la tabla\
✅ **Eliminar** con confirmación\
✅ **Buscar** por nombre\
✅ **Relaciones** mantenidas entre entidades (ej: una compañía depende
de una ciudad)

------------------------------------------------------------------------

## 🎨 Interfaz

-   Estilo diseñado con **CSS3** (colores pastel, botones animados,
    tablas con hover).
-   Navegación entre vistas mediante botones (en `index.html`).
-   Formularios simples con inputs y selects dinámicos.

------------------------------------------------------------------------

## 🚀 Uso

1.  Abre `index.html`.
2.  Selecciona una entidad desde el menú (Países, Regiones, etc.).
3.  Realiza operaciones CRUD:
    -   Escribir nombre y presionar **Agregar**.
    -   Buscar con el campo de búsqueda.
    -   Editar en la tabla con el botón ✏.
    -   Eliminar con el botón 🗑.

------------------------------------------------------------------------

## 📌 Notas

-   La app usa `fetch` para comunicarse con el **JSON Server** en
    `http://localhost:3000`.
-   El archivo `script.js` contiene la función `initCRUD()` que
    centraliza la lógica CRUD.
-   Cada archivo `*.html` puede funcionar de forma independiente o todo
    en conjunto desde `index.html`.
