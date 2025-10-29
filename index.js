// ensure the extension is loaded
console.log('--- Afua\'s Better Lorebooks is Loaded ---');

// ====== IMPORTING ======
// Destructure eventSource and eventTypes. saveWorldInfo is available globally
const { eventSource, eventTypes } = SillyTavern.getContext();

// define a unique ID for the injection target, as the block has no ID.
const TARGET_CONTAINER_CLASS = '.form_create_bottom_buttons_block';

/**
 * Creates and saves a new World Info entry (Lorebook) using the given name.
 * @param {string} name The title for the new Lorebook entry.
 */
async function createLorebookEntry(name) {
    // The saveWorldInfo function is assumed to be globally available in the ST environment
    if (typeof globalThis.saveWorldInfo !== 'function') {
        console.error('[LorebookCreator] saveWorldInfo function not found globally. Cannot create Lorebook.');
        return;
    }
    
    // Structure the data for a basic new World Info entry
    const newEntry = {
        key: name, // Use the character's name as the key/title
        content: `Lorebook entry for ${name}.`, // Basic starting content
        // Other default properties expected by saveWorldInfo
        isEnabled: true,
        isGlobal: true,
        priority: 0,
        name: name,
        position: 0,
    };

    try {
        // saveWorldInfo is an asynchronous function
        await globalThis.saveWorldInfo(newEntry, 'create'); 
        console.log(`[LorebookCreator] Successfully created Lorebook entry titled: "${name}"`);
        
        const context = SillyTavern.getContext();
        if (context.toastr) {
            context.toastr.success(`Lorebook created for: ${name}`, 'Lorebook Automation');
        }

    } catch (error) {
        console.error(`[LorebookCreator] Failed to create Lorebook entry for "${name}":`, error);
        
        const context = SillyTavern.getContext();
        if (context.toastr) {
            context.toastr.error(`Failed to create Lorebook for ${name}`, 'Lorebook Automation');
        }
    }
}


/**
 * 1. Checks if the form is in "edit" mode.
 * 2. If true, creates and injects the button.
 */
function createAndInjectButton() {
    const $form = $('#form_create');
    const actionType = $form.attr('actiontype');
    
    if (actionType === 'createcharacter') {
        // We are creating a NEW character; do not inject the button.
        console.log('[CustomLogger] Currently in "Create Character" mode. Button injection skipped.');
        return;
    }

    // --- We are in Edit/Save mode, proceed with injection ---

    const $targetContainer = $(TARGET_CONTAINER_CLASS);
    
    if (!$targetContainer.length) {
        console.warn(`[CustomLogger] Target container (${TARGET_CONTAINER_CLASS}) not found. Retrying...`);
        setTimeout(createAndInjectButton, 500);
        return;
    }

    // A. Create the Button Element using jQuery
    const $newButton = $('<div/>')
        .attr('id', 'my-custom-lorebook-button')
        .attr('title', 'Create Lorebook from Character Name')
        .addClass('menu_button fa-solid fa-address-book interactable');
    
    // B. Attach the Event Listener
    $newButton.on('click', async () => {
        const context = SillyTavern.getContext(); 
        const currentCharacter = context.characters[context.characterId];
        
        // 1. Get the Character Name from the form field
        const characterName = String($('#character_name_pole').val()).trim();

        // 2. Check if a valid name exists
        if (characterName.length === 0) {
            console.warn('[CustomLogger] Aborting Lorebook creation: Character name is empty.');
            if (context.toastr) {
                context.toastr.warning('Name field is empty. Cannot create Lorebook.', 'Automation Aborted');
            }
            return;
        }

        // 3. Print the message (your original requirement)
        let message = `Custom Button Pressed while editing. Name: **${characterName}**`;
        console.log(`[CustomLogger] ${message}`);
        
        if (context.toastr) {
             context.toastr.info(message, 'Custom Extension Action');
        }

        // 4. Create the Lorebook entry
        await createLorebookEntry(characterName);
    });

    // C. Inject into the DOM 
    $targetContainer.find('#export_button').before($newButton);
    
    console.log('[CustomLogger] Successfully injected custom button for "Edit Character" mode.');
}

// Start the setup process when the application signals it's ready.
eventSource.on(eventTypes.APP_READY, () => {
    setTimeout(createAndInjectButton, 200);