import "./App.css";
import { useEffect, useState } from "react";
import { Button } from "./components/Button/Button";
import { Note } from "./components/Note/Note";
import { Loading } from "./components/Loading/Loading";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Supprimer } from "./components/Supprimer/Supprimer";
import { faMoon as solidMoon } from "@fortawesome/free-solid-svg-icons";
import { faSun as regularSun } from "@fortawesome/free-regular-svg-icons";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";

// Cycle de vie du composant App :
// Initialement : `notes` vaut `null`, donc pas d'affichage dans le header
// Après le rendu initial : lancement de la requête au serveur (GET /notes)
// À la réponse du serveur : `notes` devient la réponse du serveur, rafraîchissement de l'affichage

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [showSaveLabel, setShowSaveLabel] = useState(false);

  
  const togglePinNote = (id) => {
    if (pinnedNotes.includes(id)) {
      setPinnedNotes(pinnedNotes.filter((noteId) => noteId !== id));
    } else {
      setPinnedNotes([id, ...pinnedNotes]);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const fetchNotes = async () => {
    const response = await fetch("/notes");
    const data = await response.json();

    setNotes(data);
    setIsLoading(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredNotes = notes?.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createNote = async () => {
    const response = await fetch("/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Nouvelle note",
        content: "",
        lastUpdatedAt: new Date(),
      }),
    });
    const newNote = await response.json();
    setNotes([newNote, ...notes]);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const refreshNote = (id, { title, content, lastUpdatedAt }) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { id, title, content, lastUpdatedAt } : note
    );
    const updatedNote = updatedNotes.find((note) => note.id === id);
    setNotes([updatedNote, ...updatedNotes.filter((note) => note.id !== id)]);
    
    setShowSaveLabel(true);
    setTimeout(() => {
      setShowSaveLabel(false);
    }, 2000);
  };

  const sortedAndFilteredNotes = filteredNotes?.sort((a, b) => {
    if (pinnedNotes.includes(b.id) && !pinnedNotes.includes(a.id)) {
      return 1;
    }
    if (!pinnedNotes.includes(b.id) && pinnedNotes.includes(a.id)) {
      return -1;
    }
    return 0;
  });

  const selectedNote =
    notes && notes.find((note) => note.id === selectedNoteId);

  const deleteNote = async (id) => {
    await fetch(`/notes/${id}`, {
      method: "DELETE",
    });
    setNotes(notes.filter((note) => note.id !== id));
  };

  const openDialog = (id) => {
    setNoteToDelete(id);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const confirmDelete = async () => {
    await deleteNote(noteToDelete);
    closeDialog();
  };

  return (
    <>
      <div
        className={`App ${isDarkMode ? "dark-mode" : "light-mode"} ${
          isDialogOpen ? "App-blur" : ""
        }`}
        onClick={isDialogOpen ? closeDialog : undefined}
      >
        <aside className="Side">
          <div className="Create-note-wrapper">
            <div className="note-and-mode">
              <Button onClick={createNote}>+ Create new note</Button>
              <button className="toggle-dark-mode" onClick={toggleDarkMode}>
                {isDarkMode ? (
                  <FontAwesomeIcon icon={regularSun} size="2x" />
                ) : (
                  <FontAwesomeIcon icon={solidMoon} size="2x" />
                )}
              </button>
            </div>
            <input
              type="search"
              placeholder="Rechercher..."
              onChange={handleSearch}
            />
          </div>
          {isLoading ? (
            <div className="Loading-wrapper">
              <Loading />
            </div>
          ) : (
            sortedAndFilteredNotes?.map((note) => (
              <div className="Note-button-wrapper" key={note.id}>
                <button
                  className={`Note-button ${
                    selectedNoteId === note.id ? "Note-button-selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                  }}
                >
                  {note.title}
                  <FontAwesomeIcon
                    icon={faThumbtack}
                    className={`pin-icon ${
                      pinnedNotes.includes(note.id) ? "visible" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePinNote(note.id);
                    }}
                  />
                </button>
                <button
                  className="Delete-button"
                  onClick={() => openDialog(note.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))
          )}
        </aside>
        <main className="Main">
          {selectedNote ? (
            <>
            <Note
              id={selectedNote.id}
              title={selectedNote.title}
              content={selectedNote.content}
              onSubmit={refreshNote}
            />
          {showSaveLabel && <div>Enregistrer</div>}
          </>
          ) : null}
        </main>
      </div>
      <Supprimer
        isOpen={isDialogOpen}
        onConfirm={confirmDelete}
        onCancel={closeDialog}
      />
    </>
  );
}

export default App;
