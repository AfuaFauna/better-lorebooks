// ensure the extension is loaded
console.log('--- Afua\'s Better Lorebooks is Loaded ---');

// ====== IMPORTING ======
const { eventSource, eventTypes } = SillyTavern.getContext();

/**
 * Executes the custom logic (printing the console message).
 * This function will be called *before* the core character creation logic.
 */
function printPreCreationMessage() {
    // Check if the form is currently set to 'createcharacter'
    const isCreating = $('#form_create').attr('actiontype') === 'createcharacter';
    
    // We can't check the name length or generation status from here 
    // without duplicating the core logic, so we trust the core function will validate it.
    
    if (isCreating) {
        // --- YOUR CONSOLE MESSAGE INJECTION POINT ---
        console.log('[Afua\'s Better Lorebooks] Attempting to create new character. Validation passed.');
        // ---------------------------------------------
        
        // Return true to allow the original event handler (the core logic) to proceed.
        return true; 
    }
    // If we're editing, or the check failed, the core logic should handle the rest.
}

/**
 * Attaches a listener to the create/save button.
 */
function attachButtonListener() {
    // Target the actual submit input: <input type="submit" id="create_button">
    const $createButton = $('#create_button'); 

    if ($createButton.length) {
        // We use .on('click') to attach our function.
        // It runs immediately when the button is pressed.
        $createButton.on('click', printPreCreationMessage);
        
        console.log('[CharLogger] Attached listener to the Create/Save button.');
    } else {
        console.warn('[CharLogger] Create/Save button not found. Will retry.');
        // Retry if the UI is still loading
        setTimeout(attachButtonListener, 500); 
    }
}

// Wait for the application to be fully loaded before trying to access DOM elements
eventSource.on(eventTypes.APP_READY, () => {
    // Wait a moment after APP_READY to ensure the character form DOM elements are rendered
    setTimeout(attachButtonListener, 200);
});