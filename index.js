// ensure the extension is loaded
console.log('--- Afua\'s Better Lorebooks is Loaded ---');

// ====== IMPORTING ======
const { eventSource, event_types } = SillyTavern.getContext();

// --- Utility function where the error occurred ---
function logCreationSuccess() {
    // ✅ Fix: Call SillyTavern.getContext() every time you need the context object
    const context = SillyTavern.getContext(); 

    const newCharacter = context.characters[context.characters.length - 1];

    if (newCharacter) {
        console.log(`[CharLogger] 🎉 New character created! Name: **${newCharacter.name}**`);
    }
}

// --- Your Hook Implementation (Using Option 1 as an example) ---

let originalGetCharacters;

function onAppReady() {
    if (typeof globalThis.getCharacters === 'function') {
        originalGetCharacters = globalThis.getCharacters;

        globalThis.getCharacters = async function(...args) {
            const result = await originalGetCharacters.apply(this, args);

            // You can also call logCreationSuccess here if you were using Option 1
            setTimeout(logCreationSuccess, 100); 

            return result;
        };
    }
}

// Ensure you use the correct entry point for your chosen option (e.g., APP_READY)
eventSource.on(event_types.APP_READY, onAppReady);