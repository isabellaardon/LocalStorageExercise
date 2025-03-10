//Local Storage Exercise
//Storing notes with localStorage - store data in brower
// We will use localStorage.setItem(key, value) to save data and localStorage.getItem(key) to retrieve it.

//TO DO: create a notes app that:
// 1. User create notes
// 2. Saves notes to localStorage so they dont disappear when page refreshes
// 3. let users create, update, delete notes
// 4. User changes note background color and applied and saved in local storage.

//STEP1: Set up localStorage - to store data in browser permantely - Need to store: 
//1. Notes (array of objects, each w ID n Content )
//2. Note Color
//3. Note Id Counter (so each note has unique ID)

//Wait for DOM to load before running the script
document.addEventListener("DOMContentLoaded", function ()
{ //Select Elements from HTML
	const noteContainer = document.getElementById("note-container");
	const newNoteButton = document.getElementById("new-note-button");
	const colorForm = document.getElementById("color-form");
	const colorInput = document.getElementById("color-input");

	// TODO 1: Get stored (note color) values or set default
	let noteColor = localStorage.getItem("noteColor") || null; // Stores the selected note color from the form.
	// TODO: Load the note ID counter from the local storage.
	let noteIdCounter = Number(localStorage.getItem("noteIdCounter")) || 0; // Counter for assigning unique IDs to new notes.

	// TODO: Load the notes from the local storage.
	//STEP 2: Function Read notes (Retrieve Data)

	//RETRIEVE DATA: localStorage.getItem(key) 
	function readNotes () {
		let notes = localStorage.getItem("notes"); //reads stored notes from local storage
		return notes ? JSON.parse(notes) : []; //converts data from string to array
	}
	//Saves notes back into local storage
	//SAVE DATA: localStorage.setItem(key, value) 
	function saveNotes (notes) {
		localStorage.setItem("notes", JSON.stringify(notes));
	}
//2. Loading Notes when the Page Opens
//Load all the saved notes from local storage when page opens
	function loadNotes() {
		const notes = readNotes(); //read saved notes from local storage

		for (const note of notes) {
			const noteElement = document.createElement("textarea");
			noteElement.setAttribute("data-note-id", note.id.toString());
            noteElement.value = note.content;
            noteElement.className = "note";
            noteElement.style.backgroundColor = noteColor;
            noteContainer.appendChild(noteElement);
		}

	}
	loadNotes();
	//Explanation: - we loop thru stored notes and create <textarea> elements
	//-Each note gets its ID, content and Background color
	//-Notes are added to noteContainer

	//3. Adding a New Note
	//create new note when user clicks the button 
	function addNewNote ()
	{
		const id = noteIdCounter;
		const content = `Note ${id}`;

		const note = document.createElement("textarea");
		note.setAttribute("data-note-id", id.toString()); // Stores the note ID to its data attribute.
		note.value = content; // Sets the note ID as value.
		note.className = "note"; // Sets a CSS class.
		note.style.backgroundColor = noteColor; // Sets the note's background color using the last selected note color.
		noteContainer.appendChild(note); // Appends it to the note container element as its child.

		noteIdCounter++; // Increments the counter since the ID is used for this note.
		
		localStorage.setItem("noteIdCounter", noteIdCounter.toString()); // Save Data

		// TODO: Add new note to the saved notes in the local storage.
		const notes = readNotes();
		notes.push({ id, content });
		saveNotes(notes);
	}

	newNoteButton.addEventListener("click", function (){
		addNewNote();
	});

	//Explanation: - Each note gets unique ID
	//-Notes are added to the page and stored in localStorage
	//- Clicking "New Note" adds new note

//4. Changing Note Color
//User can change the background color of all notes
	colorForm.addEventListener("submit", function (event)
	{
		event.preventDefault(); // Prevents the default event.

		const newColor = colorInput.value.trim();  // Removes whitespaces.

		const notes = document.querySelectorAll(".note");
		for (const note of notes)
		{
			note.style.backgroundColor = newColor;
		}

		colorInput.value = ""; // Clears the color input field after from submission.

		noteColor = newColor; // Updates the stored note color with the new selection.

		 // TODO: Update the note color in the local storage.
		localStorage.setItem("noteColor", noteColor);
		colorInput.value = "";
	});
	//Explanation: - changes all note colors
	//- new color is saved in local storage

//5. Deleting Notes
//user can delete a note by double clicking on it.
	document.addEventListener("dblclick", function (event) //callback runs when event(dblclick) happens
	{ //check if clicked element is note
		if (event.target.classList.contains("note")) //check if element has class "note" to delete
		{
			// Get the note's unique ID from its "data-note-id" attribute
			const id = Number(event.target.getAttribute("data-note-id"));
			// Removes the clicked note.
			event.target.remove(); 

			// TODO: Delete the note from the saved notes in the local storage.
			//Retrieve stored Notes
			let notes = readNotes(); // "notes" has array of all saved notes
			//Remove deleted note from storage
			notes = notes.filter(note => note.id !== id);
			// updates local storage in new note
			saveNotes(notes);
			 //new "notes" array excludes deleted note
			//filter = create new array w/o certain elements
			//Arrow function tht runs each note in array
			//Keep Note- !==id 
			//Remove Note- ===id 
		
		}
	});
//6. Updating Notes
//User can edit a note and changes saved

	noteContainer.addEventListener("blur", function (event) //listen for "blur" event
	//noteContainer = parent div holds all notes
	//"blur" = event type that fires when element loses focus
	//function (event) = callback function when triggered
	{
		//check if element is a note
		if (event.target.classList.contains("note")) 
			//event.target = element that lost focus. ensure 
		{
			// TODO: Update the note from the saved notes in the local storage.
			//fetch Id of the note
			//Number(...) = convert ID from string into Number
			const id = Number(event.target.getAttribute("data-note-id"));
			let notes = readNotes(); //load saved notes from localStorage. "Notes" = array of all notes

			//find correct note & update its content
			//loops thru each note in notes
			for (let note of notes) {
				if (note.id === id) { //finds note ID of the one tht lost focus 
					note.content = event.target.value; //update its content (new text in note)
				}
			}
			saveNotes(notes); //save updated notes back to local storage
		}
	}, true); //ensure it fires using event capturing(if nested)

//Explanation: When note loses focus (blur event) the changes are saved to local storage.


//7. Adding Notes with the "N" key
//user press "N" on keyboard to create a new note
	window.addEventListener("keydown", function (event)
	{
		/* Ignores key presses made for color and note content inputs. */
		if (event.target.id === "color-input" || event.target.type === "textarea")
		{
			return;
		}

		/* Adds a new note when the "n" key is pressed. */
		if (event.key === "n" || event.key === "N")
		{
			addNewNote(); // Adds a new note.
		}
	});
});

//Explanation: if user presses "N" - new note is created
//-doesnt interfere with typing inside notes
