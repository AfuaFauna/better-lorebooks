import { eventSource } from "../../../../script.js";

function handleCharacterCreation(characterID, characterName) {
    console.log('Extension function triggered!');
    console.log(`New Character ID: ${characterId}`);
    console.log(`New Character Name: ${characterName}`);
}

// L. for the character creation event
eventSource.on(event_types.CHARACTER_SELECTED, async (data) => {
    // This is the currently selected character ID
    const selectedChid = data.detail.id;

    // Check if the current action type is 'char_create' from the select_rm_info call
    // This is a common pattern for SillyTavern to signal that the selection was a new creation.
    if (data.detail.source === 'char_create') {
        try {
            // 2. Get the character object using the ID
            // The characters object holds all loaded character data
            const newCharacter = characters[selectedChid];

            if (newCharacter) {
                // 3. Extract the required character name
                const charName = newCharacter.name;

                // 4. Execute your function
                handleCharacterCreation(selectedChid, charName);
            }
        } catch (error) {
            console.error('Extension failed to process new character creation:', error);
        }
    }
});