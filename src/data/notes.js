const notes = {
  notes: [
    {
      id: "0",
      title: "Note 1 title",
      body: "Note 1 body"
    },
    {
      id: "1",
      title: "Note 2 title",
      body: "Note 2 body"
    },
    {
      id: "2",
      title: "Note 3 title",
      body: "Note 3 body"
    }
  ]
};

export default notes;

export const loadNotes = () => {
  const notesString = window.localStorage.getItem("notes");
  if (notesString) {
    try {
      const notesJSON = JSON.parse(notesString);
      return notesJSON;
    } catch (e) {
      console.warn(`notes JSON isn't actually JSON`);
    }
  }
  return {
    notes: []
  };
};

export const localStorageNotes = loadNotes();

export const saveNotes = notes => {
  const notesJSON = {
    notes
  };
  window.localStorage.setItem("notes", JSON.stringify(notesJSON));
};

export const clearNotes = cb => {
  window.localStorage.removeItem("notes");
  typeof cb === "function" && cb(loadNotes());
};

export const deleteNote = (noteId, cb) => {
  const loadedNotes = loadNotes();
  const newNotes = loadedNotes.notes.filter(n => n.id !== noteId);
  saveNotes(newNotes);
  typeof cb === "function" && cb(loadNotes());
};

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
}

export const BLANK_NOTE = () => {
  return {
    id: guid(),
    title: "",
    body: "",
    date: new Date().toJSON()
  };
};

export const isEmptyNote = note => {
  if (note) {
    if (
      (!note.title || note.title.trim() === "") &&
      (!note.body || note.body.trim() === "")
    ) {
      return true;
    } else {
      return false;
    }
  }
  return false; // null is not an empty note
};
