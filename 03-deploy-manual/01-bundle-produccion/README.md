# 01 Bundle de producción

En este ejemplo vamos a crear un bundle (empaquetado) de producción para el frontend utilizando Vite.

Partiremos de la aplicación del ejemplo anterior (`00-aplicacion`).

## Paso 0 — Instalación de dependencias

Antes de nada, asegúrate de instalar las dependencias previas del proyecto:

```bash
npm install
```

## Paso 1 — Configuración y variables de entorno de producción

Primero, revisaremos la configuración actual de Vite. Prestaremos especial atención al prefijo declarado para nuestras variables de entorno (`PUBLIC_`):

_./vite.config.ts_

```javascript
import { defineConfig } from 'vite';
...

export default defineConfig({
  envPrefix: 'PUBLIC_',
  ...
});
```

> **Referencias:** Para saber más sobre cómo Vite procesa estos valores, revisa la [documentación de variables de entorno de Vite](https://vitejs.dev/guide/env-and-mode.html).

A continuación, vamos a fijar variables de entorno exclusivas para el entorno de producción creando el archivo correspondiente:

_./.env.production_

```env
PUBLIC_ORGANIZATION=facebook
```

## Paso 2 — Configuración del comando de Build

Ahora, vamos a añadir el comando `build` en nuestro `package.json` para indicarle a Vite que construya el empaquetado.

También es muy buena práctica añadir un comando `prebuild`. Este comando se ejecutará siempre automáticamente justo antes de arrancar el comando `build` y se asegurará de que el código pase el chequeo de tipos de TypeScript sin fallos, evitando crear entregables rotos si los tipos no son correctos:

_./package.json_

```diff
...
  "scripts": {
    "start": "run-p -l type-check:watch start:dev",
    "start:dev": "vite --port 8080",
+   "build": "npm run type-check && vite build",
    "type-check": "tsc --noEmit --preserveWatchOutput",
    ...
  },
```

## Paso 3 — Ejecutar el build y validar el resultado

Procedemos a lanzar la compilación para producción:

```bash
npm run build
```

> **Nota:** Puedes abrir la nueva carpeta que se acaba de generar con los archivos listos para producción e intentar buscar en su interior el valor de la variable de entorno para comprobar cómo Vite lo inyecta por detrás en la compilación final.

Finalmente, vamos a simular cómo correría ese código si lo enviáramos a un entorno de producción, sirviendo la carpeta recién construida `dist` directamente con un servidor web estático y ligero:

```bash
cd dist
npx lite-server
```

Abre en tu navegador la ruta que te proporcione `lite-server` y podrás comprobar tu _bundle_ de producción funcionando en local.
