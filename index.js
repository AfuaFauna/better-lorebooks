// ensure the extension is loaded
console.log('--- Afua\'s Better Lorebooks is Loaded ---');

// ====== IMPORTING ======
const { getContext } = SillyTavern.getContext();

function logCreationSuccess() {
    // 1. Check if the current action is 'createcharacter'
    const isCreating = $('#form_create').attr('actiontype') === 'createcharacter';
    
    if (isCreating) {
        // Your logic to check if the character list has grown will go here.
        // The core 'createOrEditCharacter' function runs, saves the character,
        // and refreshes the list *after* the button is clicked.
        
        // We'll set a small timeout to let the core function finish saving and refreshing data.
        setTimeout(() => {
            const context = getContext();
            const newCharacter = context.characters[context.characters.length - 1];
            
            // Re-check actiontype to be safe, though context length is better
            if (newCharacter) {
                console.log(`[CharLogger] 🎉 Button pressed and character list updated! Name: **${newCharacter.name}**`);
                // toastr.info(`Attempted to create: ${newCharacter.name}`);
            }
        }, 500); // 500ms should be enough time for the API call and list refresh
    }
}

function attachButtonListener() {
    // Find the save button within the creation form (assuming it's a specific ID)
    const createButton = document.getElementById('create_button'); 

    if (createButton) {
        createButton.addEventListener('click', logCreationSuccess);
        console.log('[CharLogger] Attached listener to the Create/Save button.');
    } else {
        console.warn('[CharLogger] Create/Save button not found. Will retry.');
        // If not found immediately, we need to wait for the UI to load it.
    }
}

// Use APP_READY and a delay to ensure the DOM elements exist
SillyTavern.getContext().eventSource.on(SillyTavern.getContext().event_types.APP_READY, () => {
    // Attach the listener once the main UI is likely finished rendering
    setTimeout(attachButtonListener, 200);
});