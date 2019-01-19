import React, { Component } from "react";
import NoteList from "./NoteList";
import NoteEditor from "./NoteEditor";
import {
  localStorageNotes as loadedNotes,
  saveNotes,
  BLANK_NOTE,
  clearNotes,
  isEmptyNote
} from "./data/notes.js";

class App extends Component {
  constructor(props) {
    super(props);

    const notes = loadedNotes.notes.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return aDate.getTime() - bDate.getTime();
    });

    const activeNote = (() => {
      const latestNote = notes.length > 0 ? notes[notes.length - 1] : null;
      if (isEmptyNote(latestNote)) return latestNote;
      notes.push({
        ...BLANK_NOTE(),
        date: new Date().toJSON()
      });
      return notes[notes.length - 1];
    })();

    this.state = {
      notes,
      activeNote
    };
  }
  onNoteClick = targetNoteId => {
    this.setState(state => ({
      ...state,
      activeNote: state.notes.find(n => n.id === targetNoteId)
    }));
  };
  onNoteChange = newNote => {
    this.setState(
      state => {
        const noteIndex = state.notes.findIndex(n => n.id === newNote.id);
        const newNotes = [...state.notes];
        newNotes[noteIndex] = newNote;
        const activeNote =
          newNote.id === state.activeNote.id ? newNote : state.activeNote;
        return {
          ...state,
          notes: newNotes,
          activeNote
        };
      },
      () => {
        saveNotes(this.state.notes);
      }
    );
  };
  addNote = e => {
    this.setState(state => {
      const notes = [...state.notes];
      const activeNote = BLANK_NOTE();
      activeNote.date = new Date().toJSON();
      notes.push(activeNote);
      return {
        ...state,
        notes,
        activeNote
      };
    });
  };
  clearNotes = e => {
    clearNotes(newNotes => {
      this.setState(state => ({
        ...state,
        notes: newNotes.notes,
        activeNote: null
      }));
    });
  };
  render() {
    const { activeNote, notes } = this.state;
    return (
      <div className="App">
        <main>
          {activeNote && (
            <NoteEditor
              activeNote={activeNote}
              onNoteChange={this.onNoteChange}
            />
          )}
          <NoteList notes={notes} onNoteClick={this.onNoteClick} />
          <button onClick={this.addNote}>Add Note</button>
          <button onClick={this.clearNotes}>Clear All Notes</button>
        </main>
        <div>
          <code>
            <pre>{JSON.stringify(notes, null, 1)}</pre>
          </code>
        </div>
      </div>
    );
  }
}

export default App;
