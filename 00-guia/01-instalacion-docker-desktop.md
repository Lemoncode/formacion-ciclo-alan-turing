# Guía de Instalación de Docker Desktop

## Índice

1. [¿Qué es Docker Desktop?](#1-qué-es-docker-desktop)
2. [Requisitos del sistema](#2-requisitos-del-sistema)
3. [Instalación en Windows](#3-instalación-en-windows)
   - [Paso 1: Verificar la versión de Windows](#paso-1-verificar-la-versión-de-windows)
   - [Paso 2: Verificar y activar la virtualización en BIOS/UEFI](#paso-2-verificar-y-activar-la-virtualización-en-biosuefi)
   - [Paso 3: Activar WSL2 en Windows 10](#paso-3-activar-wsl2-en-windows-10-home-pro-y-enterprise)
   - [Paso 3 (alternativa): Activar WSL2 en Windows 11](#paso-3-alternativa-activar-wsl2-en-windows-11-home-pro-y-enterprise)
   - [Paso 4: Descargar Docker Desktop](#paso-4-descargar-docker-desktop-para-windows)
   - [Paso 5: Instalar Docker Desktop](#paso-5-instalar-docker-desktop-en-windows)
4. [Instalación en Mac](#4-instalación-en-mac)
   - [Paso 1: Identificar el tipo de procesador](#paso-1-identificar-el-tipo-de-procesador)
   - [Paso 2: Descargar Docker Desktop](#paso-2-descargar-docker-desktop-para-mac)
   - [Paso 3: Instalar Docker Desktop](#paso-3-instalar-docker-desktop-en-mac)
5. [Verificar que la instalación es correcta](#5-verificar-que-la-instalación-es-correcta)
6. [Solución de problemas frecuentes](#6-solución-de-problemas-frecuentes)
7. [Mantener Docker Desktop actualizado](#7-mantener-docker-desktop-actualizado)

---

## 1. ¿Qué es Docker Desktop?

Docker es una tecnología que permite crear y ejecutar **contenedores**: entornos de software aislados y reproducibles. Piensa en un contenedor como una caja que incluye todo lo que una aplicación necesita para funcionar (el código, las dependencias, la configuración), de forma que se ejecuta igual en cualquier ordenador.

**Docker Desktop** es la aplicación oficial que permite usar Docker en tu ordenador personal. Incluye:
- Un interfaz gráfico para gestionar contenedores e imágenes
- La herramienta de línea de comandos `docker`
- Un motor Docker local que corre en segundo plano

> 💡 **NOTA:** Docker Desktop es gratuito para uso personal, educativo y proyectos de código abierto. Para uso comercial en empresas grandes puede requerir suscripción. Puedes consultar los detalles en la [página de precios de Docker](https://www.docker.com/pricing/).

---

## 2. Requisitos del sistema

Antes de instalar, comprueba que tu ordenador cumple los requisitos mínimos.

### Windows

> ⚠️ **IMPORTANTE:** Docker Desktop en Windows requiere activar **WSL2** (Subsistema de Windows para Linux) independientemente de la versión o edición de Windows que tengas. Este proceso se detalla en la sección de instalación.

| | Windows 10 Home | Windows 10 Pro / Enterprise / Education | Windows 11 Home | Windows 11 Pro / Enterprise / Education |
|---|---|---|---|---|
| **Versión mínima** | 22H2 (Build 19045) | 22H2 (Build 19045) | 23H2 (Build 22631) | 23H2 (Build 22631) |
| **Backend disponible** | Solo WSL2 | WSL2 o Hyper-V | Solo WSL2 | WSL2 o Hyper-V |
| **Contenedores Linux** | ✅ | ✅ | ✅ | ✅ |
| **Contenedores Windows** | ❌ | ✅ | ❌ | ✅ |
| **Activación WSL2** | Manual (varios pasos) | Manual (varios pasos) | Simplificada | Simplificada |

**Requisitos de hardware (todas las ediciones):**
- Procesador de 64 bits con soporte de virtualización por hardware (Intel VT-x o AMD-V/SVM)
- Mínimo **8 GB de RAM** (recomendado 16 GB)
- Espacio en disco suficiente para las imágenes que vayas a usar (recomendado mínimo 20 GB libres)
- WSL versión **2.1.5 o superior** (se instala automáticamente en los pasos siguientes)

**Referencia oficial de requisitos:** [Docker Desktop para Windows — Docker Docs](https://docs.docker.com/desktop/setup/install/windows-install/)

> 💡 **NOTA:** La diferencia principal entre Windows Home y Pro/Enterprise es que Home **solo puede usar WSL2** como motor de Docker, mientras que Pro/Enterprise puede elegir entre WSL2 e Hyper-V. Para este curso usaremos siempre WSL2, que es la opción recomendada por Docker para todos los casos.

### Mac

| | Mac con procesador Intel | Mac con Apple Silicon (M1/M2/M3/M4) |
|---|---|---|
| **macOS mínimo** | Las tres últimas versiones principales de macOS | Las tres últimas versiones principales de macOS |
| **RAM mínima** | 4 GB | 4 GB |
| **Espacio en disco** | 20 GB libres | 20 GB libres |
| **Notas** | — | Soporte nativo, rendimiento óptimo |

> 💡 **NOTA:** Docker Desktop soporta oficialmente las **tres últimas versiones principales de macOS**. A fecha de este documento, eso incluye macOS 13 (Ventura), macOS 14 (Sonoma) y macOS 15 (Sequoia). Puedes consultar en todo momento las versiones soportadas en la [documentación oficial de Docker Desktop para Mac](https://docs.docker.com/desktop/setup/install/mac-install/).

> 💡 **NOTA:** Los Mac con Apple Silicon (chips M1, M2, M3, M4) tienen soporte nativo y excelente rendimiento. Los Mac con Intel también funcionan perfectamente con Docker Desktop.

---

## 3. Instalación en Windows

### Paso 1: Verificar la versión de Windows

Antes de empezar, debes saber qué versión y edición de Windows tienes instalada.

1. Pulsa las teclas **Windows + R** para abrir el cuadro "Ejecutar"
2. Escribe `winver` y pulsa **Aceptar**

> 📸 **CAPTURA:** Cuadro de diálogo "Ejecutar" con el texto "winver" escrito y el botón Aceptar visible.

Se abrirá una ventana que muestra:
- La **edición** de Windows (Home, Pro, Enterprise...)
- La **versión** (por ejemplo: 22H2)
- El **número de compilación** (por ejemplo: 19045)

> 📸 **CAPTURA:** Ventana "Acerca de Windows" mostrando la edición, versión y número de compilación resaltados.

> ⚠️ **IMPORTANTE:** Si tu Windows 10 es anterior a la versión **22H2 (Build 19045)** o tu Windows 11 es anterior a **23H2 (Build 22631)**, debes actualizar Windows antes de continuar. Ve a **Configuración → Windows Update → Buscar actualizaciones**. Consulta los requisitos exactos y actualizados en la [documentación oficial de Docker Desktop para Windows](https://docs.docker.com/desktop/setup/install/windows-install/).

---

### Paso 2: Verificar y activar la virtualización en BIOS/UEFI

Docker necesita que la virtualización por hardware esté activada en la BIOS/UEFI de tu ordenador. En muchos equipos ya viene activada de fábrica, pero conviene comprobarlo.

#### Verificar si la virtualización está activa

1. Haz clic derecho en la barra de tareas y selecciona **Administrador de tareas**
2. Haz clic en la pestaña **Rendimiento**
3. Selecciona **CPU** en el panel izquierdo
4. Busca el apartado **Virtualización** en la parte inferior derecha

> 📸 **CAPTURA:** Administrador de tareas en la pestaña Rendimiento > CPU, con el campo "Virtualización: Habilitada" claramente visible en la parte inferior.

Si aparece **"Habilitada"**, puedes pasar directamente al [Paso 3](#paso-3-activar-wsl2-en-windows-10-home-pro-y-enterprise).

Si aparece **"Deshabilitada"**, debes activarla en la BIOS/UEFI siguiendo los pasos de abajo.

#### Activar la virtualización en la BIOS/UEFI

Hay dos formas de acceder a la BIOS/UEFI. Te recomendamos empezar por la **Opción A** (desde Windows), que es más sencilla y no depende del fabricante.

##### Opción A: Acceso desde la Configuración de Windows (recomendada)

Este es el método oficial de Microsoft y funciona en cualquier equipo con Windows 10/11:

1. Ve a **Configuración → Sistema → Recuperación**
2. En la sección **"Inicio avanzado"**, haz clic en **"Reiniciar ahora"**

   > 📸 **CAPTURA:** Panel de Configuración de Windows mostrando la opción "Recuperación" con el botón "Reiniciar ahora" en la sección Inicio avanzado.

3. El ordenador se reiniciará en el **Entorno de recuperación de Windows**. Selecciona **"Solucionar problemas"**
4. Luego **"Opciones avanzadas"**
5. Luego **"Configuración de firmware UEFI"**
6. Haz clic en **"Reiniciar"** — el ordenador arrancará directamente en la BIOS/UEFI

   > 📸 **CAPTURA:** Pantalla del Entorno de recuperación de Windows mostrando la ruta: Solucionar problemas → Opciones avanzadas → Configuración de firmware UEFI.

**Referencia oficial:** [Habilitar la virtualización en Windows — Microsoft Support](https://support.microsoft.com/es-es/windows/habilitar-la-virtualizaci%C3%B3n-en-windows-c5578302-6e43-4b4b-a449-8ced115f58e1)

##### Opción B: Acceso mediante tecla al arranque (alternativa)

> ⚠️ **IMPORTANTE:** El proceso varía según el fabricante del ordenador. La tecla exacta depende de cada modelo.

1. **Reinicia el ordenador**
2. **Entra en la BIOS/UEFI** pulsando repetidamente la tecla indicada al arrancar. Las más comunes según fabricante son:
   - **Dell:** F2 o F12
   - **HP:** F10 o Esc
   - **Lenovo:** F1, F2 o Enter
   - **Asus:** F2 o Supr
   - **Acer:** F2 o Supr
   - **MSI:** Supr o F2

   > 💡 **NOTA:** Si no encuentras tu tecla, busca en Google el modelo exacto de tu ordenador seguido de "BIOS key" o consulta el manual del fabricante.

3. **Busca la opción de virtualización.** Suele estar en una sección llamada "CPU", "Advanced", "Security" o similar:

   - **Intel:** Busca "Intel Virtualization Technology", "Intel VT-x" o "VT-d" y cámbiala a **Enabled**

     > 📸 **CAPTURA:** Pantalla de BIOS con opción "Intel Virtualization Technology" o "VT-x" en estado "Enabled" resaltada.

   - **AMD:** Busca "SVM Mode" o "AMD-V" y cámbiala a **Enabled**

     > 📸 **CAPTURA:** Pantalla de BIOS con opción "SVM Mode" en estado "Enabled" resaltada.

4. **Guarda y sal** de la BIOS (normalmente F10 o la opción "Save & Exit")
5. El ordenador se reiniciará con la virtualización activada

---

### Paso 3: Activar WSL2 en Windows 10 (Home, Pro y Enterprise)

> ⚠️ **IMPORTANTE:** Este paso es necesario en **todas las ediciones de Windows 10**, tanto Home como Pro y Enterprise. No es un problema exclusivo de Windows Home.

WSL2 (Windows Subsystem for Linux 2) es la capa de compatibilidad con Linux que Docker Desktop necesita para funcionar. En Windows 10 hay que activarla manualmente siguiendo estos pasos.

#### Opción A: Activación por PowerShell (recomendada)

1. Busca **PowerShell** en el menú Inicio, haz clic derecho y selecciona **"Ejecutar como administrador"**

   > 📸 **CAPTURA:** Menú inicio con PowerShell en los resultados y el menú contextual con "Ejecutar como administrador" resaltado.

2. Ejecuta el siguiente comando para activar el Subsistema de Windows para Linux:

   ```powershell
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   ```

3. A continuación, activa la Plataforma de Máquina Virtual:

   ```powershell
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```

   > 📸 **CAPTURA:** Ventana de PowerShell mostrando la ejecución de los comandos con el mensaje de éxito "La operación se completó correctamente."

4. **Reinicia el ordenador** para que los cambios surtan efecto.

#### Opción B: Activación por Panel de Control (alternativa visual)

1. Ve a **Panel de control → Programas → Activar o desactivar las características de Windows**

   > 📸 **CAPTURA:** Ventana "Características de Windows" con las casillas "Subsistema de Windows para Linux" y "Plataforma de máquina virtual" marcadas.

2. Marca las dos casillas siguientes:
   - ✅ **Subsistema de Windows para Linux**
   - ✅ **Plataforma de máquina virtual**

3. Haz clic en **Aceptar** y espera a que se instalen.
4. **Reinicia el ordenador** cuando se te solicite.

#### Instalar el paquete del kernel de Linux para WSL2

Tras el reinicio, necesitas descargar e instalar el paquete del kernel de Linux:

1. Descarga el paquete desde el enlace oficial de Microsoft:
   **[Descargar paquete de actualización del kernel de Linux para WSL2](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)**

2. Ejecuta el archivo `.msi` descargado y sigue el asistente de instalación.

   > 📸 **CAPTURA:** Asistente de instalación del paquete del kernel WSL2 con el botón "Next" visible.

3. Una vez instalado, abre PowerShell como administrador y ejecuta:

   ```powershell
   wsl --set-default-version 2
   ```

   > 📸 **CAPTURA:** PowerShell mostrando el mensaje de confirmación tras ejecutar el comando.

#### Instalar una distribución Linux (opcional pero recomendado)

> 💡 **NOTA:** Docker Desktop **no requiere** que instales una distribución Linux de forma manual. Al instalarse, Docker crea automáticamente sus propias distribuciones WSL2 internas (`docker-desktop` y `docker-desktop-data`). Sin embargo, instalar Ubuntu es útil si en algún momento quieres explorar el entorno Linux directamente.

Si quieres instalar Ubuntu igualmente (recomendado para el curso):

1. Abre la **Microsoft Store** desde el menú Inicio
2. Busca **"Ubuntu"**
3. Selecciona **Ubuntu** (la versión sin número, que siempre es la LTS más reciente) y haz clic en **Obtener**

   > 📸 **CAPTURA:** Microsoft Store mostrando la aplicación "Ubuntu" con el botón "Obtener" o "Instalar" visible.

4. Cuando finalice la instalación, haz clic en **Abrir** y espera a que Ubuntu termine de configurarse (puede tardar unos minutos la primera vez)
5. Se te pedirá que crees un **nombre de usuario** y una **contraseña** para Linux. Este usuario es independiente de tu usuario de Windows.

   > 📸 **CAPTURA:** Terminal de Ubuntu pidiendo "Enter new UNIX username:" con un cursor de texto.

Una vez configurado, puedes cerrar Ubuntu. Docker Desktop lo detectará automáticamente.

**Referencia oficial:** [Instalación manual de WSL — Microsoft Learn](https://learn.microsoft.com/es-es/windows/wsl/install-manual)

---

### Paso 3 (alternativa): Activar WSL2 con el método simplificado

> 💡 **NOTA:** Este método simplificado funciona en **Windows 10 versión 2004 (Build 19041) o superior** y en **Windows 11 (todas las ediciones)**. Si tienes Windows 10 con versión 22H2 (requisito mínimo de Docker), puedes usar directamente este método en lugar del manual anterior.

En Windows 11 el proceso es mucho más sencillo, y también funciona en Windows 10 moderno.

1. Busca **PowerShell** en el menú Inicio, haz clic derecho y selecciona **"Ejecutar como administrador"**

2. Ejecuta el siguiente comando:

   ```powershell
   wsl --install
   ```

   Este único comando activa automáticamente todas las características necesarias e instala Ubuntu.

   > 📸 **CAPTURA:** PowerShell mostrando la ejecución del comando `wsl --install` con el progreso de instalación visible.

3. **Reinicia el ordenador** cuando se te solicite.

4. Tras el reinicio, se abrirá automáticamente una ventana de Ubuntu para que configures el usuario Linux. Introduce un **nombre de usuario** y una **contraseña**.

   > 📸 **CAPTURA:** Terminal de Ubuntu en Windows 11 pidiendo nombre de usuario y contraseña para el nuevo usuario Linux.

5. Una vez configurado, puedes cerrar Ubuntu.

**Referencia oficial:** [Instalar WSL — Microsoft Learn](https://learn.microsoft.com/es-es/windows/wsl/install)

---

### Paso 4: Descargar Docker Desktop para Windows

1. Abre tu navegador y ve a la página oficial de Docker Desktop:
   **[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)**

2. Haz clic en el botón **"Download for Windows"**

   > 📸 **CAPTURA:** Página web de Docker Desktop con el botón "Download for Windows" destacado.

3. Se descargará el archivo **Docker Desktop Installer.exe** (aproximadamente 500 MB)

> 💡 **NOTA:** Asegúrate de descargar siempre desde el sitio oficial `docker.com` para garantizar que obtienes la versión legítima y más actualizada.

---

### Paso 5: Instalar Docker Desktop en Windows

1. Localiza el archivo **Docker Desktop Installer.exe** en tu carpeta de Descargas y haz doble clic para ejecutarlo.

   > ⚠️ **IMPORTANTE:** Si Windows muestra un aviso de "Control de cuentas de usuario" preguntando si deseas permitir que esta aplicación realice cambios, haz clic en **Sí**.

2. Se abrirá el asistente de instalación. Verás las siguientes opciones:

   - ✅ **Use WSL 2 instead of Hyper-V (recommended)** — **Debe estar marcada.** En Windows Home es obligatoria; en Windows Pro/Enterprise es la opción recomendada.
   - ✅ **Add shortcut to desktop** — Opcional, pero recomendado para facilitar el acceso.

   > 📸 **CAPTURA:** Pantalla inicial del instalador de Docker Desktop con las dos opciones visibles, la casilla "Use WSL 2 instead of Hyper-V" marcada.

3. Haz clic en **Ok** para comenzar la instalación. El proceso puede tardar varios minutos.

   > 📸 **CAPTURA:** Barra de progreso del instalador de Docker Desktop mostrando la instalación en curso.

4. Cuando finalice, haz clic en **Close and restart** para reiniciar el ordenador.

   > 📸 **CAPTURA:** Pantalla final del instalador con el mensaje "Installation succeeded" y el botón "Close and restart".

5. Tras el reinicio, Docker Desktop se iniciará automáticamente. Verás el icono de la ballena de Docker en la barra de tareas (área de notificación, esquina inferior derecha).

   > 📸 **CAPTURA:** Barra de tareas de Windows con el icono de Docker (ballena) visible en el área de notificación.

6. La primera vez que abres Docker Desktop, deberás **aceptar los términos del servicio**. Léelos y haz clic en **Accept**.

   > 📸 **CAPTURA:** Ventana de Docker Desktop mostrando los términos del servicio con el botón "Accept" resaltado.

7. Docker Desktop mostrará un tutorial de inicio. Puedes seguirlo si quieres o cerrarlo haciendo clic en la **X** de la esquina superior derecha.

   > 📸 **CAPTURA:** Pantalla de bienvenida/tutorial de Docker Desktop con la opción de saltárselo visible.

8. Cuando el motor esté listo, verás un punto **verde** en la parte inferior izquierda con el texto **"Engine running"**.

   > 📸 **CAPTURA:** Interfaz principal de Docker Desktop con el indicador verde "Engine running" en la esquina inferior izquierda.

**Referencia oficial:** [Instalar Docker Desktop en Windows — Docker Docs](https://docs.docker.com/desktop/setup/install/windows-install/)

---

## 4. Instalación en Mac

### Paso 1: Identificar el tipo de procesador

Es fundamental saber si tu Mac tiene procesador **Intel** o **Apple Silicon** (M1, M2, M3 o M4), ya que hay versiones de Docker Desktop diferentes para cada tipo.

1. Haz clic en el menú **Apple** (manzana) en la esquina superior izquierda de la pantalla
2. Selecciona **"Acerca de este Mac"**

> 📸 **CAPTURA:** Menú Apple abierto con la opción "Acerca de este Mac" resaltada.

En la ventana que aparece:

- Si ves **"Procesador: Intel..."** → descarga la versión para **Intel**
- Si ves **"Chip: Apple M1"** (o M2, M3, M4) → descarga la versión para **Apple Silicon**

> 📸 **CAPTURA:** Ventana "Acerca de este Mac" con el campo "Chip" o "Procesador" resaltado para identificar el tipo.

---

### Paso 2: Descargar Docker Desktop para Mac

1. Abre tu navegador y ve a la página oficial:
   **[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)**

2. Haz clic en el botón **"Download for Mac"**. Aparecerá un menú desplegable con dos opciones:
   - **"Mac with Apple Silicon"** → para chips M1, M2, M3 o M4
   - **"Mac with Intel Chip"** → para procesadores Intel

   > 📸 **CAPTURA:** Página web de Docker Desktop con el menú desplegable mostrando las opciones "Mac with Apple Silicon" y "Mac with Intel Chip".

3. Selecciona la opción que corresponde a tu Mac. Se descargará un archivo **Docker.dmg** (aproximadamente 500-600 MB).

---

### Paso 3: Instalar Docker Desktop en Mac

1. Localiza el archivo **Docker.dmg** en tu carpeta de Descargas y haz doble clic para abrirlo.

2. Se abrirá una ventana con el icono de Docker y la carpeta Aplicaciones. **Arrastra el icono de Docker hacia la carpeta Aplicaciones**.

   > 📸 **CAPTURA:** Ventana del archivo .dmg mostrando el icono de Docker y la flecha hacia la carpeta "Applications", en el proceso de arrastrar.

3. Abre la carpeta **Aplicaciones** y haz doble clic en **Docker** para iniciarlo por primera vez.

4. macOS mostrará un aviso de seguridad indicando que Docker es una aplicación descargada de Internet. Haz clic en **Abrir**.

   > 📸 **CAPTURA:** Diálogo de seguridad de macOS preguntando si deseas abrir Docker con el botón "Abrir" resaltado.

5. Docker te pedirá tu **contraseña de administrador** del Mac para instalar los componentes del sistema necesarios. Introdúcela y haz clic en **Instalar Helper**.

   > 📸 **CAPTURA:** Diálogo de macOS solicitando contraseña de administrador con el campo de contraseña y el botón "Instalar Helper".

6. En **macOS 13 (Ventura) o superior**, es posible que necesites conceder permisos adicionales. Ve a **Configuración del sistema → Privacidad y seguridad** si se te solicita.

   > 📸 **CAPTURA:** Panel "Privacidad y Seguridad" en Configuración del sistema de macOS con una solicitud de permisos de Docker visible.

7. Docker Desktop se iniciará y aparecerá el icono de la ballena en la **barra de menús** (parte superior derecha de la pantalla).

   > 📸 **CAPTURA:** Barra de menús de macOS con el icono de Docker (ballena) visible en la parte superior derecha.

8. La primera vez, deberás **aceptar los términos del servicio**. Haz clic en **Accept**.

   > 📸 **CAPTURA:** Ventana de Docker Desktop en Mac mostrando los términos del servicio con el botón "Accept".

9. Cuando el motor esté listo, el icono de la ballena dejará de animarse y verás el punto **verde** con **"Engine running"** en la parte inferior de la ventana de Docker Desktop.

   > 📸 **CAPTURA:** Interfaz principal de Docker Desktop en Mac con el indicador "Engine running" en verde.

> 💡 **NOTA para Apple Silicon (M1/M2/M3/M4):** Rosetta 2 **ya no es obligatoria** para usar Docker Desktop en Mac Apple Silicon. Sin embargo, algunas herramientas de línea de comandos opcionales aún la pueden necesitar. Si en algún momento la necesitas, puedes instalarla con: `softwareupdate --install-rosetta`

**Referencia oficial:** [Instalar Docker Desktop en Mac — Docker Docs](https://docs.docker.com/desktop/setup/install/mac-install/)

---

## 5. Verificar que la instalación es correcta

Una vez instalado Docker Desktop (tanto en Windows como en Mac), realiza estas comprobaciones para asegurarte de que todo funciona correctamente.

### Comprobar la versión instalada

Abre una **terminal**:
- **Windows:** Busca "PowerShell" o "Símbolo del sistema" en el menú Inicio
- **Mac:** Busca "Terminal" en el Launchpad o en Aplicaciones → Utilidades

Ejecuta el siguiente comando:

```bash
docker --version
```

Deberías ver algo similar a:

```
Docker version 27.x.x, build xxxxxxx
```

> 📸 **CAPTURA:** Terminal mostrando el resultado del comando `docker --version` con el número de versión visible.

### Ejecutar el contenedor de prueba

El comando más usado para verificar que Docker funciona correctamente es:

```bash
docker run hello-world
```

Este comando le pide a Docker que ejecute un contenedor basado en la imagen `hello-world`. La primera vez que lo ejecutas, Docker descargará automáticamente esa imagen desde Internet.

Deberías ver una salida similar a esta:

```
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
...
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.
...
```

> 📸 **CAPTURA:** Terminal mostrando la salida completa del comando `docker run hello-world` con el mensaje "Hello from Docker!" visible.

**¿Qué significa este mensaje?** Docker te está indicando exactamente lo que ha hecho:
1. Ha buscado la imagen `hello-world` en tu ordenador (no la encontró porque es la primera vez)
2. La ha descargado desde Docker Hub (el repositorio oficial de imágenes)
3. Ha creado un contenedor a partir de esa imagen
4. El contenedor ha ejecutado un pequeño programa que ha imprimido este mensaje en tu pantalla

Si ves el mensaje **"Hello from Docker!"**, la instalación es correcta y Docker está funcionando perfectamente.

### Verificar en el Dashboard de Docker Desktop

Abre Docker Desktop y comprueba que:

1. El indicador en la esquina inferior izquierda muestra **"Engine running"** con un punto **verde**
2. En la sección **"Containers"** del panel izquierdo, verás el contenedor `hello-world` que acabas de ejecutar (puede aparecer en estado "Exited", que es normal ya que ese contenedor solo ejecuta el mensaje y se detiene)
3. En la sección **"Images"** del panel izquierdo, verás la imagen `hello-world` descargada

> 📸 **CAPTURA:** Docker Desktop Dashboard mostrando la sección "Containers" con el contenedor "hello-world" en estado "Exited" y el indicador verde "Engine running" en la esquina inferior.

> 📸 **CAPTURA:** Docker Desktop Dashboard mostrando la sección "Images" con la imagen "hello-world" listada con su tamaño y fecha de descarga.

---

## 6. Solución de problemas frecuentes

### Error: "WSL 2 installation is incomplete"

**Síntoma:** Docker Desktop muestra un error al arrancar indicando que WSL2 no está completo.

**Solución:**
1. Abre PowerShell como administrador
2. Ejecuta: `wsl --update`
3. Reinicia Docker Desktop

Si el error persiste:
1. Descarga e instala manualmente el paquete del kernel: [Paquete de actualización del kernel de WSL2](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)
2. Reinicia el ordenador

---

### Error: "Hardware assisted virtualization and data execution protection must be enabled"

**Síntoma:** Docker Desktop no puede iniciarse e indica que la virtualización por hardware no está habilitada.

**Solución:**
- Sigue los pasos del [Paso 2](#paso-2-verificar-y-activar-la-virtualización-en-biosuefi) para activar la virtualización en la BIOS/UEFI.
- Si ya está activada en BIOS, comprueba que las características de Windows están habilitadas ([Paso 3](#paso-3-activar-wsl2-en-windows-10-home-pro-y-enterprise)).

---

### Docker no arranca en Windows tras el reinicio

**Síntoma:** El icono de Docker no aparece en la barra de tareas o aparece con un icono de error.

**Solución:**
1. Abre el menú Inicio, busca **"Docker Desktop"** y ejecútalo manualmente
2. Si no inicia, abre PowerShell como administrador y ejecuta:
   ```powershell
   wsl --shutdown
   ```
   Espera 10 segundos y vuelve a abrir Docker Desktop

3. Si el problema persiste, reinicia el ordenador y vuelve a intentarlo

---

### Error en Mac: "Docker.app can't be opened because Apple cannot check it for malicious software"

**Síntoma:** macOS bloquea la apertura de Docker Desktop la primera vez.

**Solución:**
1. Ve a **Ajustes del sistema → Privacidad y seguridad**
2. En la sección "Seguridad", busca el mensaje sobre Docker y haz clic en **"Abrir igualmente"**
3. Introduce tu contraseña de administrador

> 📸 **CAPTURA:** Panel "Privacidad y Seguridad" de macOS con el mensaje sobre Docker y el botón "Abrir igualmente" resaltado.

---

### Consumo elevado de memoria RAM

**Síntoma:** El ordenador va lento cuando Docker Desktop está en ejecución.

**Solución:** Puedes limitar la memoria RAM que Docker utiliza:
1. Abre Docker Desktop
2. Ve a **Settings** (icono de engranaje) → **Resources** → **Advanced**
3. Reduce el valor de **"Memory"** a la mitad de tu RAM total (por ejemplo, 4 GB si tienes 8 GB)
4. Haz clic en **"Apply & Restart"**

> 📸 **CAPTURA:** Panel de Settings de Docker Desktop en la sección Resources > Advanced mostrando el control deslizante de Memory.

---

### Error: "Error response from daemon: pull access denied"

**Síntoma:** Al intentar descargar una imagen, Docker indica que no tienes permiso.

**Solución:** Algunas imágenes requieren una cuenta gratuita en Docker Hub. Crea una en [https://hub.docker.com/](https://hub.docker.com/) e inicia sesión en Docker Desktop desde **Settings → Sign in**.

---

## 7. Mantener Docker Desktop actualizado

Es importante mantener Docker Desktop actualizado para disponer de las últimas correcciones de seguridad y funcionalidades.

### Actualización automática

Por defecto, Docker Desktop comprueba si hay actualizaciones disponibles y te lo notifica. Cuando aparezca la notificación:

1. Haz clic en el icono de Docker en la barra de tareas (Windows) o barra de menús (Mac)
2. Selecciona **"Check for Updates"**
3. Si hay una actualización disponible, haz clic en **"Download update"**
4. Cuando termine la descarga, haz clic en **"Update and restart"**

> 📸 **CAPTURA:** Menú de Docker Desktop mostrando la opción "Check for Updates" y/o la notificación de actualización disponible.

### Verificar la versión instalada

En cualquier momento puedes ver tu versión actual en:
- **Docker Desktop → Settings → About Docker Desktop**

O desde la terminal:
```bash
docker version
```

> 💡 **NOTA:** Puedes consultar el historial de versiones y las notas de cambios en la [documentación oficial de Docker Desktop](https://docs.docker.com/desktop/release-notes/).

---

## Recursos adicionales

- [Documentación oficial de Docker Desktop](https://docs.docker.com/desktop/)
- [Guía de inicio rápido de Docker](https://docs.docker.com/get-started/)
- [Docker Hub — Repositorio oficial de imágenes](https://hub.docker.com/)
- [Instalación de WSL — Microsoft Learn](https://learn.microsoft.com/es-es/windows/wsl/install)
- [Solución de problemas de WSL — Microsoft Learn](https://learn.microsoft.com/es-es/windows/wsl/troubleshooting)
- [Foro de la comunidad Docker](https://forums.docker.com/)
