# Smart Parking System | Panel de control IoT

![Estado](https://img.shields.io/badge/Estado-Terminado-success)
![Semestre](https://img.shields.io/badge/Semestre-2do-blue)
![Tech](https://img.shields.io/badge/Tech_Stack-Node.js_%7C_Express_%7C_Vanilla_JS-yellow)

Este proyecto fue desarrollado como proyecto final de la materia **Electrónica Digital Aplicada**. Es un sistema integral (Hardware + Software) diseñado para la gestión y cobro de un estacionamiento Inteligente.

La base de su funcionamiento es un servidor levantado en **Node.js** que actúa como puente entre los sensores físicos (Arduino) y la interfaz web. El sistema guarda en tiempo real los datos de los vehículos, el estado de la plaza y la hora de ingreso, para que al momento de salida se calcule el tiempo de estadía y el costo total de forma 100% automática.

---

## Características Principales

* **Monitoreo en Tiempo Real:** Dashboard interactivo que muestra el estado de las plazas (Libre, Ocupado, Reservado) al instante.
* **Integracion de IoT:** Endpoints API preparados para recibir señales de sensores ultrasónicos/infrarrojos controlados por Arduino.
* **Facturación Automática:** Calcula el costo de la estadía dinámicamente basado en una tarifa configurable (actualmente como ejemplo de uso se configuró con 5 bs/minuto). 
* **Control Dual (Manual y Automático):** Permite registrar entradas/salidas manualmente desde la web o de forma automática mediante la detección del sensor. 
* **Registro de Actividad (Logs):** Historial en pantalla de todos los movimientos (entradas, salidas, reinicios, y montos cobrados).
* **Modo Simulador:** Incluye un script (`simulador.js`) para probar el sistema y la API desde la terminal sin necesidad de tener el hardware conectado. 

---

# Arquitectura y tecnologías

El proyecto sigue una arquitectura Cliente-Servidor clásica adaptada para el Internet de las Cosas (IoT):

* **Backend:** Node.js con Express. Maneja la lógica de negocio, el cálculo de tarifas y expone el API REST (`/api/status`, `/api/sensor`, `/api/manual-action`). 
* **Frontend:** HTML5, CSS3 puro (con CSS Grid y variables nativas para un diseño Dark Mode moderno) y Vanilla JavaScript (`fetch` API) para la reactividad. 
* **Hardware (Mock):** Preparado para microcontroladores (Arduino, ESP32) que envíen peticiones POST al cambiar el estado del sensor de proximidad. 

---

# Instalación y uso

Si deseas correr este proyecto de forma local sigue estos pasos:

### 1. Clonar e Instalar las dependencias

Abre tu terminal en la carpeta del proyecto e instala los paquetes necesarios (Express y CORS):

```bash
npm install
```

### 2. Levantar el servidor principal

Inicia el backend que alojará el sistema API y manejará la lógica:

```bash
node server.js
```

El servidor indicará en la consola: SISTEMAS DE COBROS LISTO (5 Bs/min)

### 3. Abrir el dashboard

Simplemente abre el archivo index.html en tu navegador favorito para ver la interfaz de control. 

### 4. Usar el simulador de Hardware (Opcional)

Si no se tiene el Hardware conectado y se requiere simular que el auto salga de la plaza (para ver cómo funciona la interfaz de cobro), abre una segunda terminal en la misma carpeta y ejecuta:

```bash
node simulador.js
```

El simulador te pedirá que ingreses el número de plaza a liberar, enviando la petición al servidor exactamente como lo haría un microcontrolador.

## Autor

**Jose Andres Callisaya Choque**
*Estudiante de Ingeniería en Sistemas Informáticos | Universidad Privada del Valle | UNIVALLE*