const API_URL = 'http://localhost:3000/api';

const slotsContainer = document.getElementById('slots');
const logContainer = document.getElementById('log');
const slotSelect = document.getElementById('slotSelect');
const plateInput = document.getElementById('plate');
const actionSelect = document.getElementById('action');

let currentData = {}; 

async function fetchData() {
    try {
        const res = await fetch(`${API_URL}/status`);
        const data = await res.json();
        currentData = data.slots;
        renderMap();
        renderLogs(data.logs);
        updateDropdown();
        updateStats();
    } catch (e) {}
}

function renderMap() {
    slotsContainer.innerHTML = '';
    
    Object.keys(currentData).forEach(key => {
        const slot = currentData[key];
        const idStr = key.replace('slot-', 'P-');
        
        const div = document.createElement('div');
        div.className = `slot ${slot.state}`;
        
        // MOSTRAR DATOS
        const show = slot.display.mostrarDatos;
        const ingreso = show ? slot.display.ingreso : '--:--';
        const salida = show ? slot.display.salida : '--:--';
        const costo = show ? slot.display.costo : 0;
        const placa = show ? slot.plate : '';

        // Si ya hay costo calculado, el color del precio es VERDE, si no, es gris
        const priceColor = (costo > 0) ? '#22c55e' : '#94a3b8';

        div.innerHTML = `
            <div class="slot-header">
                ${idStr}
                ${placa ? `<span class="slot-plate">${placa}</span>` : ''}
            </div>
            
            <div class="slot-info">
                <div>
                    <span class="info-label">H.Ingreso:</span>
                    <span class="info-val">${ingreso}</span>
                </div>
                
                <div style="text-align:right;">
                    <span class="info-label">Bs.</span>
                    <span class="info-val" style="color:${priceColor}; font-size:1.1rem;">${costo}</span>
                </div>

                <div>
                    <span class="info-label">H.Salida:</span>
                    <span class="info-val">${salida}</span>
                </div>

                <button onclick="reiniciarSlot('${key}')" class="btn-reset-slot">
                    Reiniciar
                </button>
            </div>
        `;

        div.addEventListener('click', (e) => {
            if(e.target.tagName !== 'BUTTON') {
                slotSelect.value = key;
                plateInput.value = (slot.plate !== '--') ? slot.plate : '';
            }
        });

        slotsContainer.appendChild(div);
    });
}

// Acción del botón REINICIAR (dentro de tarjeta)
async function reiniciarSlot(slotId) {
    await sendAction(slotId, 'free', ''); // 'free' actúa como reset visual
}

// Acción del botón EJECUTAR (Panel derecho)
document.getElementById('doAction').addEventListener('click', async () => {
    const slotId = slotSelect.value;
    const action = actionSelect.value; // 'occupy', 'leave', 'free'
    const plate = plateInput.value;

    if(!slotId) return alert("Selecciona plaza");

    await sendAction(slotId, action, plate);
    plateInput.value = "";
});

async function sendAction(slotId, action, plate) {
    await fetch(`${API_URL}/manual-action`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ slotId, action, plate })
    });
    fetchData();
}

// Helpers
function renderLogs(logs) { logContainer.innerHTML = logs.map(l => `<div>${l}</div>`).join(''); }

function updateDropdown() {
    if(slotSelect.options.length > 0) return;
    Object.keys(currentData).forEach(k => {
        const opt = document.createElement('option');
        opt.value = k; opt.textContent = k.toUpperCase();
        slotSelect.appendChild(opt);
    });
}

function updateStats() {
    const keys = Object.keys(currentData);
    const occ = keys.filter(k => currentData[k].state === 'occupied').length;
    document.getElementById('totalCount').textContent = keys.length;
    document.getElementById('freeCount').textContent = keys.length - occ;
    document.getElementById('occCount').textContent = occ;
}

// --- CONFIGURACIÓN: REINICIAR SISTEMA (CORREGIDO) ---
document.getElementById('resetBtn').addEventListener('click', async () => {
   // 1. Leemos el valor del input
   const count = document.getElementById('initialSlots').value;

   // 2. Se lo enviamos al servidor
   await fetch(`${API_URL}/reset`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ count: count }) 
   });
   
   // 3. Limpiamos el dropdown para que se regenere con la nueva cantidad
   slotSelect.innerHTML = "";
   fetchData();
});

setInterval(fetchData, 1000);
fetchData();