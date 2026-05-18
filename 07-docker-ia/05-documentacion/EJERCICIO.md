# Proyecto 05 — El README que no sirve de nada

> Foco: documentación con IA, validar que lo que genera es correcto · ~15 min

## El escenario

Ayer se incorporó un compañero nuevo al equipo. Esta mañana te escribe:

> "Llevo 40 minutos intentando arrancar el proyecto siguiendo el README y no funciona nada. Ni en local ni con Docker. ¿Qué estoy haciendo mal?"

Tu misión: encontrar todos los errores del README actual con ayuda de la IA y generar una versión correcta que cubra tanto el arranque en local como el despliegue con Docker.

---

## La aplicación

Una API REST con tres endpoints:

- `GET /` — información general de la API
- `GET /users` — lista de usuarios
- `GET /health` — estado del servidor

### Arrancarla correctamente (sin seguir el README)

```bash
npm install
npm run build
npm start
```

Comprueba que funciona:

```bash
curl http://localhost:3000/
curl http://localhost:3000/users
curl http://localhost:3000/health
```

### Arrancarla con Docker (sin seguir el README)

```bash
docker build -t users-api .
docker run -p 3000:3000 users-api
```

---

## El problema

Abre el `README.md` e intenta seguirlo al pie de la letra. Apunta todo lo que falla.

Preguntas para guiarte:

- ¿El comando `npm run serve` existe en el `package.json`?
- ¿La app escucha realmente en el puerto 8080?
- ¿Los endpoints del README coinciden con los de `src/index.ts`?
- ¿Las variables de entorno del README son las que usa la aplicación?
- ¿El comando `npm run unit-tests` existe en el `package.json`?
- ¿El comando `npm run compile` existe en el `package.json`?
- ¿El puerto del `docker run` coincide con el que expone el Dockerfile?
- ¿El `curl` de validación del README apunta a la ruta correcta?

---

## Paso a paso

### Paso 1 — Lista de errores antes de usar la IA

Recorre el README línea a línea y anota cada error que encuentres. Hazlo antes de usar la IA — es parte del ejercicio.

### Paso 2 — Pide a la IA que genere un README correcto

```
Genera un README.md para un proyecto Node.js con TypeScript.

Aquí está el fichero package.json del proyecto:
[pega el package.json aquí]

Aquí el código de la aplicación:
[pega src/index.ts aquí]

Aquí el Dockerfile:
[pega el Dockerfile aquí]

La única variable de entorno que usa la app es PORT (si no se define, usa 3000 por defecto).

El README debe incluir:
- Requisitos (Node.js con versión concreta, npm, Docker)
- Cómo arrancar en local (incluyendo el paso de build)
- Cómo construir y arrancar con Docker
- Los endpoints disponibles con ejemplos de respuesta real
- Las variables de entorno (sin valores reales)

Reglas:
- No inventes scripts que no estén en el package.json
- No pongas puertos ni rutas que no estén en el código o en el Dockerfile
- No inventes variables de entorno que no existan
- Usa bloques de código para todos los comandos
```

### Paso 3 — Valida el README generado

Antes de aceptar lo que ha generado la IA, comprueba cada punto:

- ¿Cada comando que aparece existe realmente en el `package.json`?
- ¿Los endpoints coinciden exactamente con los de `src/index.ts`?
- ¿El puerto de local y el del `docker run` son correctos?
- ¿El arranque en local incluye el paso de `npm run build`?
- ¿La IA inventó alguna variable de entorno que no existe en el código?
- ¿Los ejemplos de respuesta que muestra coinciden con lo que devuelve la app real?

### Paso 4 — Corrige lo que sea necesario

Si la IA inventó algo, corrígelo. El README final debe ser 100% fiel al código, al `package.json` y al Dockerfile reales.

---

## Checklist antes de entregar

- [ ] Un compañero nuevo puede arrancar la app en local siguiendo solo el README
- [ ] Un compañero nuevo puede desplegar con Docker siguiendo solo el README
- [ ] Todos los comandos del README existen en `package.json`
- [ ] Todos los endpoints del README existen en `src/index.ts`
- [ ] El puerto es correcto (3000 por defecto, configurable con `PORT`)
- [ ] No hay variables de entorno inventadas
- [ ] El arranque en local incluye `npm run build` antes de `npm start`
- [ ] Has documentado al menos 1 cosa que la IA generó incorrectamente

---

## Entregable

- `README.md` corregido (sobreescribe el actual)
- Un fichero `ai-review.md` con:
  - Lista de errores que encontraste en el README original
  - Al menos 1 cosa que la IA generó incorrectamente y cómo la corregiste

## Checklist antes de entregar

- [ ] `npm install && npm start` arranca la app según las instrucciones del nuevo README
- [ ] Todos los comandos del README existen en `package.json`
- [ ] Todos los endpoints del README existen en `src/index.js`
- [ ] El puerto es correcto (3000 por defecto, configurable con `PORT`)
- [ ] No hay variables de entorno inventadas
- [ ] Has documentado al menos 1 cosa que la IA generó incorrectamente

---

## Entregable

- `README.md` corregido (sobreescribe el actual)
- Un fichero `ai-review.md` con:
  - Lista de errores que encontraste en el README original
  - Al menos 1 cosa que la IA generó incorrectamente y cómo la corregiste
