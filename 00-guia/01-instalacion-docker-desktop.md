# Instalación de Docker Desktop

Docker Desktop es la aplicación oficial para usar Docker en tu ordenador. Incluye la herramienta de línea de comandos `docker`, un motor local y una interfaz gráfica para gestionar contenedores e imágenes.

> Docker Desktop puede ser gratuito en algunos casos (por ejemplo, uso personal, educativo o determinadas organizaciones pequeñas), pero la licencia depende también del tipo y tamaño de la organización y del uso. Consulta las condiciones actualizadas en la página oficial de [precios y licencias](https://www.docker.com/pricing/).

---

## Windows

### Requisitos previos

- Windows 10 versión **22H2** o superior, o Windows 11
- Virtualización por hardware activada en la BIOS (en la mayoría de equipos ya lo está)

> **Versión de Windows:** Pulsa `Win + R`, escribe `winver` y pulsa Enter. Si tu versión es anterior a 22H2, ve a **Configuración → Windows Update** y actualiza antes de continuar.

### 1. Activar la virtualización (solo si es necesario)

Compruébalo en **Administrador de tareas → Rendimiento → CPU**. Si aparece "Virtualización: Habilitada", puedes saltarte este punto.

Si aparece "Deshabilitada":

1. Ve a **Configuración → Sistema → Recuperación → Inicio avanzado → Reiniciar ahora**
2. Selecciona **Solucionar problemas → Opciones avanzadas → Configuración de firmware UEFI → Reiniciar**
3. Dentro de la BIOS, busca **Intel Virtualization Technology** (o **SVM Mode** en AMD) y cámbialo a **Enabled**
4. Guarda y sal (normalmente F10)

[Referencia oficial de Microsoft](https://support.microsoft.com/es-es/windows/habilitar-la-virtualizaci%C3%B3n-en-windows-c5578302-6e43-4b4b-a449-8ced115f58e1)

### 2. Instalar WSL2

Abre **PowerShell como administrador** y ejecuta:

```powershell
wsl --install
```

Esto activa automáticamente todos los componentes necesarios e instala Ubuntu. **Reinicia el ordenador** cuando lo pida.

> **Windows 10 anterior a la versión 2004:** el comando `wsl --install` no está disponible. Sigue los pasos manuales a continuación.

<details>
<summary><strong>Instalación manual de WSL2 (Windows antiguo)</strong></summary>

Abre **PowerShell como administrador** y ejecuta estos comandos uno a uno, reiniciando cuando se indique:

**1. Activar el Subsistema de Windows para Linux:**

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

**2. Activar la Plataforma de Máquina Virtual:**

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

**Reinicia el ordenador.**

**3. Descargar e instalar el paquete del kernel de Linux para WSL2:**

- [Descargar para x64](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi) (la mayoría de equipos)
- [Descargar para ARM64](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_arm64.msi) (equipos ARM)

Ejecuta el `.msi` descargado y sigue el asistente.

**4. Establecer WSL2 como versión por defecto:**

```powershell
wsl --set-default-version 2
```

**5. Instalar Ubuntu desde la Microsoft Store:**

Busca "Ubuntu" en la [Microsoft Store](https://apps.microsoft.com/search?query=Ubuntu) e instala la versión sin número (siempre la LTS más reciente). Al abrirlo por primera vez te pedirá crear un usuario y contraseña de Linux.

[Referencia oficial — Instalación manual de WSL](https://learn.microsoft.com/es-es/windows/wsl/install-manual)

</details>

### 3. Descargar e instalar Docker Desktop

1. Descarga el instalador desde la [página oficial de Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Ejecuta **Docker Desktop Installer.exe**
3. En el instalador, asegúrate de que **"Use WSL 2 instead of Hyper-V"** está marcado
4. Sigue el asistente y reinicia cuando lo pida

Al arrancar, acepta los términos de servicio. Cuando el indicador inferior izquierdo muestre **"Engine running"** en verde, Docker está listo.

[Documentación oficial — Windows](https://docs.docker.com/desktop/setup/install/windows-install/)

---

## Mac

### 1. Identificar el procesador

Ve a **Menú Apple → Acerca de este Mac**:

- Si ves **Chip: Apple M1/M2/M3/M4** → descarga la versión **Apple Silicon**
- Si ves **Procesador: Intel** → descarga la versión **Intel**

### 2. Descargar e instalar Docker Desktop

1. Descarga el instalador correspondiente desde la [página oficial de Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Abre el archivo **Docker.dmg** y arrastra Docker a la carpeta **Aplicaciones**
3. Abre Docker desde Aplicaciones — macOS pedirá tu contraseña de administrador para instalar los componentes del sistema
4. Acepta los términos de servicio

Cuando el icono de la ballena en la barra de menús deje de animarse y muestre **"Engine running"** en verde, Docker está listo.

> **Apple Silicon (M1/M2/M3/M4):** Rosetta 2 ya no es obligatoria para Docker Desktop. Si en algún momento alguna herramienta la requiere, instálala con `softwareupdate --install-rosetta`

> **macOS antiguo:** Docker Desktop soporta las tres últimas versiones principales de macOS. Si tu versión es más antigua, actualiza antes de instalar. [Versiones soportadas](https://docs.docker.com/desktop/setup/install/mac-install/)

[Documentación oficial — Mac](https://docs.docker.com/desktop/setup/install/mac-install/)

## Solución de problemas

- **"WSL 2 installation is incomplete"**  
  Abre PowerShell como administrador y ejecuta `wsl --update`. Reinicia Docker Desktop.
- **"Hardware assisted virtualization must be enabled"**  
  La virtualización está desactivada en la BIOS. Sigue los pasos del apartado [Activar la virtualización](#1-activar-la-virtualización-solo-si-es-necesario).
- **Docker no arranca en Windows**  
  Abre PowerShell como administrador, ejecuta `wsl --shutdown`, espera 10 segundos y vuelve a abrir Docker Desktop.
- **macOS bloquea la apertura de Docker**  
  Ve a **Ajustes del sistema → Privacidad y seguridad** y haz clic en **"Abrir igualmente"** junto al mensaje de Docker.
- **Consumo elevado de RAM**  
  En Docker Desktop ve a **Settings → Resources → Advanced** y reduce el valor de **Memory**.

---

## Verificar la instalación

Abre una terminal y ejecuta:

```bash
docker --version
```

Deberías ver algo como:

```
Docker version 29.x.x, build xxxxxxx
```

Si ambos comandos responden sin error, Docker está correctamente instalado y listo para usar.
