// ensure the extension is loaded
console.log('--- Afua\'s Better Lorebooks is Loaded ---');

// ====== IMPORTING ======
const { eventSource, eventTypes } = SillyTavern.getContext();

// define a unique ID for the injection target, as the block has no ID.
const TARGET_CONTAINER_CLASS = '.form_create_bottom_buttons_block';

/**
 * 1. Checks if the form is in "edit" mode.
 * 2. If true, creates and injects the button.
 */
function createAndInjectButton() {
    const $form = $('#form_create');
    const actionType = $form.attr('actiontype');
    
    // Check: The button should ONLY be added if we are NOT in 'createcharacter' mode.
    // The presence of a character means actionType is likely 'edit' or undefined/other.
    if (actionType === 'createcharacter') {
        // We are creating a NEW character; do not inject the button.
        console.log('[CustomLogger] Currently in "Create Character" mode. Button injection skipped.');
        return;
    }

    // --- We are in Edit/Save mode, proceed with injection ---

    const $targetContainer = $(TARGET_CONTAINER_CLASS);
    
    if (!$targetContainer.length) {
        console.warn(`[CustomLogger] Target container (${TARGET_CONTAINER_CLASS}) not found. Retrying...`);
        // Retry if the UI is still loading
        setTimeout(createAndInjectButton, 500);
        return;
    }

    // A. Create the Button Element using jQuery for simplicity, mimicking existing structure
    const $newButton = $('<div/>')
        .attr('id', 'my-custom-logger-button')
        .addClass('menu_button fa-solid fa-code-branch interactable') // Using a unique icon class
    
    // B. Attach the Event Listener
    $newButton.on('click', () => {
        const context = getContext();
        const currentCharacter = context.characters[context.characterId];
        
        // Log the message based on the character's name
        let message;
        if (currentCharacter) {
            message = `Custom Button Pressed while editing: **${currentCharacter.name}**`;
        } else {
            message = "Custom Button Pressed. Character context unavailable.";
        }

        console.log(`[CustomLogger] ${message}`);
        
        if (context.toastr) {
             context.toastr.info(message, 'Custom Extension Action');
        }
    });

    // C. Inject into the DOM (before the delete button, for example)
    // Find a sibling element for precise placement, e.g., before the Export button.
    $targetContainer.find('#export_button').before($newButton);
    
    console.log('[CustomLogger] Successfully injected custom button for "Edit Character" mode.');
}

// Start the setup process when the application signals it's ready.
eventSource.on(eventTypes.APP_READY, () => {
    // A small delay ensures the form is fully rendered and its actiontype attribute is set.
    setTimeout(createAndInjectButton, 200);
});