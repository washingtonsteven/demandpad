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
import netlifyIdentity from "netlify-identity-widget";

const netlifyAuth = {
  isAuthenticated: false,
  user: null,
  authenticate(callback) {
    this.isAuthenticated = true;
    netlifyIdentity.open();
    netlifyIdentity.on("login", user => {
      this.user = user;
      callback(user);
    });
  },
  signout(callback) {
    this.isAuthenticated = false;
    netlifyIdentity.logout();
    netlifyIdentity.on("logout", () => {
      this.user = null;
      callback();
    });
  }
};

const SignoutForm = () => {
  return (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          netlifyAuth.signout(() => {
            console.log("signout completed");
          });
        }}
      >
        Sign out
      </button>
    </p>
  );
};

const LoginForm = () => {
  return (
    <div>
      <button
        onClick={() => {
          netlifyAuth.authenticate(user => {
            console.log("logged in", user);
          });
        }}
      >
        Log in
      </button>
    </div>
  );
};

const ProtectedApp = () => {
  return netlifyAuth.isAuthenticated ? <App /> : <LoginForm />;
};

export default ProtectedApp;

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
    const { activeNote, notes, listOpen } = this.state;
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
        </main>
        <SignoutForm />
      </div>
    );
  }
}
