# Laboratorio Docker: MySQL + Chinook

## Contexto

Vamos a trabajar con **Chinook**, una base de datos de ejemplo que simula una tienda de música digital.

Puedes descargar el script SQL desde el repositorio oficial:

- Repositorio: [https://github.com/lerocha/chinook-database](https://github.com/lerocha/chinook-database)
- Descarga directa: [https://raw.githubusercontent.com/lerocha/chinook-database/master/ChinookDatabase/DataSources/Chinook_MySql.sql](https://raw.githubusercontent.com/lerocha/chinook-database/master/ChinookDatabase/DataSources/Chinook_MySql.sql)

Imagen oficial de MySQL:

- [https://hub.docker.com/\_/mysql](https://hub.docker.com/_/mysql)

---

## Objetivo del laboratorio

Aprender a:

- Levantar un contenedor MySQL con Docker
- Configurar variables de entorno
- Usar volúmenes para persistencia
- Cargar una base de datos desde un script SQL

> ⚠️ Nota: El objetivo principal es aprender Docker. Las consultas SQL se utilizan únicamente para verificar que todo funciona correctamente.

---

## 🧱 Parte obligatoria

### 1. Crear el contenedor

Crea un contenedor de MySQL con las siguientes características:

- Nombre del contenedor: `mysql-chinook`
- Contraseña de root: `LemonCode1234`
- Puerto: `3306`
- Debe tener un **volumen con nombre** para persistir los datos

---

### 2. Cargar la base de datos

Carga el archivo `Chinook_MySql.sql` dentro del contenedor.

Puedes hacerlo:

- copiando el fichero al contenedor
- o montando un volumen
- o usando `/docker-entrypoint-initdb.d`

---

### 3. Verificar que funciona

Comprueba que la base de datos se ha cargado correctamente.

Ejecuta:

```sql
SELECT COUNT(*) FROM Track;
```

Debe devolver aproximadamente **3503 registros**.

También puedes ejecutar:

```sql
SELECT Name FROM Track LIMIT 5;
```

---

### 4. Comprobar persistencia

1. Inserta un registro de prueba:

```sql
INSERT INTO Artist (Name) VALUES ('Grupo Docker');
```

2. Detén y elimina el contenedor

3. Vuelve a crear el contenedor

4. Comprueba si el dato sigue existiendo:

```sql
SELECT * FROM Artist WHERE Name = 'Grupo Docker';
```

---

## ⭐ Parte opcional

### 5. Exploración básica

Ejecuta algunas consultas para explorar los datos:

```sql
SELECT Name, UnitPrice FROM Track LIMIT 10;
```

```sql
SELECT Name FROM Artist LIMIT 10;
```

```sql
SHOW TABLES;
```

```sql
DESCRIBE Track;
```

---

## ❓ Preguntas para reflexionar

1. ¿Qué ocurre si eliminas el contenedor sin volumen?
2. ¿Qué ocurre si usas `docker volume rm`?
3. ¿Por qué el script SQL no se ejecuta siempre al reiniciar?
4. ¿Qué ventaja tiene usar Docker frente a instalar MySQL local?

---

## 🚨 Problemas comunes

### ❌ El puerto 3306 está ocupado

Solución: cambia el puerto, por ejemplo:

```bash
-p 3307:3306
```

---

### ❌ El SQL no se carga

Puede ser porque:

- El volumen ya existía
- El script no está en la ruta correcta

Solución:

```bash
docker compose down -v
```

---

## 🧠 Conclusión

En este laboratorio has aprendido:

- Cómo levantar un contenedor MySQL con Docker
- Cómo persistir datos usando volúmenes
- Cómo cargar una base de datos desde un fichero SQL
- Cómo validar que todo funciona correctamente

👉 Este es el patrón real que se usa en proyectos profesionales.
