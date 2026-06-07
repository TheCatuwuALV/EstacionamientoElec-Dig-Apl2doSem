const readline = require('readline');

// URL del servidor
const API_URL = 'http://localhost:3000/api/sensor';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para liberar la plaza (Simular Salida)
async function liberarPlaza(numero) {
    const slotId = `slot-${numero}`;
    
    console.log(`\nDetectando SALIDA en Plaza ${numero}...`);

    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slotId: slotId, estado: 'free' }) // Enviamos 'free'
        });
        
        if(respuesta.ok) {
            console.log(`Salida registrada. Revisa el cobro en la web.`);
        } else {
            console.log("El servidor no respondió bien.");
        }
    } catch (error) {
        console.log("Error: Servidor desconectado.");
    }
}

console.log("\n=============================================");
console.log("   SENSOR DE SALIDAS (Simulador)");
console.log("=============================================");
console.log(" MODO DE USO:");
console.log(" 1. Registra un auto en la Página Web (Entrada Manual).");
console.log(" 2. Cuando quieras que 'se vaya', escribe aquí el número de plaza.");
console.log("");
console.log(" Ejemplo: Escribe '1' y Enter -> Libera la Plaza 1.");
console.log("=============================================\n");

process.stdout.write("Escribe número de plaza a liberar > ");

rl.on('line', (input) => {
    const numero = input.trim();
    
    if (numero > 0) {
        liberarPlaza(numero);
    } else {
        console.log("Por favor escribe solo el número (ej: 1, 5, 12)");
    }

    setTimeout(() => process.stdout.write("\nEscribe número de plaza a liberar > "), 500);
});