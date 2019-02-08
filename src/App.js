import React, { Component } from "react";
import NoteList from "./NoteList";
import NoteEditor from "./NoteEditor";
import appStyles from "./styles/App.module.css";
import {
  localStorageNotes as loadedNotes,
  saveNotes,
  BLANK_NOTE,
  clearNotes,
  isEmptyNote
} from "./data/notes.js";

console.log(appStyles);

class App extends Component {
  constructor(props) {
    super(props);

    const notes = loadedNotes.notes.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return aDate.getTime() - bDate.getTime();
    });

    const activeNote = this.getLatestActiveNote(notes);

    this.state = {
      notes,
      activeNote,
      listOpen: false
    };
  }
  componentDidMount() {
    window.addEventListener("keydown", event => {
      if (event.ctrlKey || event.metaKey) {
        if (event.which === 83 || event.key === "s") {
          this.setState(
            state => ({
              ...state,
              saveMessage: true
            }),
            () => {
              setTimeout(() => {
                this.setState(state => ({
                  ...state,
                  saveMessage: false
                }));
              }, 2500);
            }
          );
          event.preventDefault();
          return false;
        }
      }
    });
  }
  getLatestActiveNote = notes => {
    const latestNote = notes.length > 0 ? notes[notes.length - 1] : null;
    if (isEmptyNote(latestNote)) return latestNote;
    notes.push({
      ...BLANK_NOTE(),
      date: new Date().toJSON()
    });
    return notes[notes.length - 1];
  };
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
  addNote = () => {
    this.setState(state => {
      const notes = [...state.notes];
      let activeNote = notes[notes.length - 1];
      if (!isEmptyNote(notes[notes.length - 1])) {
        activeNote = BLANK_NOTE();
        notes.push(activeNote);
      }
      activeNote.date = new Date().toJSON();
      return {
        ...state,
        notes,
        activeNote
      };
    });
  };
  clearNotes = () => {
    clearNotes(newNotes => {
      this.setState(state => ({
        ...state,
        notes: newNotes.notes,
        activeNote: this.getLatestActiveNote(newNotes.notes)
      }));
    });
  };
  onEditorClick = () => {
    this.setState(state => ({
      ...state,
      listOpen: false
    }));
  };
  toggleList = () => {
    this.setState(state => ({
      ...state,
      listOpen: !state.listOpen
    }));
  };
  render() {
    const { activeNote, notes, listOpen, saveMessage } = this.state;
    return (
      <div className="App">
        <main>
          {activeNote && (
            <NoteEditor
              activeNote={activeNote}
              onNoteChange={this.onNoteChange}
              onClick={this.onEditorClick}
            />
          )}
          <NoteList
            notes={notes}
            activeNote={activeNote}
            onNoteClick={this.onNoteClick}
            addNote={this.addNote}
            clearNotes={this.clearNotes}
            open={listOpen}
            toggleList={this.toggleList}
          />
          <div
            className={`${appStyles["saveMessage"]} ${saveMessage &&
              appStyles["active"]}`}
          >
            Saved!
          </div>
        </main>
      </div>
    );
  }
}

export default App;
