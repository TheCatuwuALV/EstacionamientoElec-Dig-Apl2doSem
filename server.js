const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const PRECIO_POR_MINUTO = 5; // Tarifa

let slots = {};
let logs = [];

function initSystem(count = 12) {
    slots = {};
    for(let i=1; i<=count; i++) {
        slots[`slot-${i}`] = { 
            state: "free", 
            plate: "--", 
            entryTimestamp: null, // Hora exacta para cálculos
            display: {
                ingreso: "--:--",
                salida: "--:--",
                costo: 0,
                mostrarDatos: false
            }
        };
    }
}

function addLog(msg) {
    const time = new Date().toLocaleTimeString();
    logs.unshift(`[${time}] ${msg}`);
    if (logs.length > 30) logs.pop();
}

// LÓGICA DE COBRO (Compartida por Sensor y Manual)
function finalizarEstadia(slotId) {
    const slot = slots[slotId];
    if (slot.entryTimestamp) {
        const now = Date.now();
        const diffMin = Math.ceil((now - slot.entryTimestamp) / 60000);
        const costo = diffMin * PRECIO_POR_MINUTO;
        const horaSalida = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // ACTUALIZAMOS VISUAL (El precio se queda visible)
        slot.display.salida = horaSalida;
        slot.display.costo = costo;
        
        // El sensor ve libre, pero la pantalla muestra los datos
        slot.state = "free";
        slot.entryTimestamp = null; 
        
        addLog(`Salida: ${slotId}. Total a pagar: ${costo} Bs.`);
    }
}

initSystem(12);

// --- RUTAS ---

app.get("/api/status", (req, res) => {
    res.json({ slots, logs });
});

// ACCIONES MANUALES (Web)
app.post("/api/manual-action", (req, res) => {
    const { slotId, action, plate } = req.body;
    
    if(!slots[slotId]) return res.status(400).json({error: "Error"});

    if (action === 'occupy') {
        const hora = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        slots[slotId].state = "occupied";
        slots[slotId].plate = plate || "Manual";
        slots[slotId].entryTimestamp = Date.now();
        
        // Reset visual al entrar
        slots[slotId].display = {
            ingreso: hora,
            salida: "--:--",
            costo: 0,
            mostrarDatos: true
        };
        addLog(`Entrada Manual: ${plate} en ${slotId}`);
    } 
    else if (action === 'leave') {
        // COBRAR
        finalizarEstadia(slotId);
    }
    else if (action === 'free') { // ESTO ES "REINICIAR"
        slots[slotId].state = "free";
        slots[slotId].plate = "--";
        slots[slotId].entryTimestamp = null;
        slots[slotId].display = { ingreso: "--:--", salida: "--:--", costo: 0, mostrarDatos: false };
        addLog(`Reinicio: ${slotId} limpia.`);
    }

    res.json({status: "ok"});
});

// SENSOR ARDUINO
app.post("/api/sensor", (req, res) => {
    const { slotId, estado } = req.body;
    if(slots[slotId]) {
        const prev = slots[slotId].state;

        // AUTO SALE -> COBRAR
        if(estado === 'free' && prev === 'occupied') {
            finalizarEstadia(slotId);
        }
        // AUTO ENTRA (Sin registro manual previo)
        else if (estado === 'occupied' && prev === 'free') {
            const hora = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            slots[slotId].state = "occupied";
            slots[slotId].plate = "Detectando..."; // Opcional
            slots[slotId].entryTimestamp = Date.now();
            slots[slotId].display = { ingreso: hora, salida: "--:--", costo: 0, mostrarDatos: true };
            addLog(`Sensor: Entrada en ${slotId}`);
        }
    }
    res.json({status: "ok"});
});

app.post("/api/reset", (req, res) => {
    initSystem(req.body.count || 12);
    res.json({status: "ok"});
});

app.listen(3000, () => {
    console.log("✅ SISTEMA DE COBROS LISTO (5 Bs/min)");
});