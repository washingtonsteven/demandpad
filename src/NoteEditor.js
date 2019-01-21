import React, { Component } from "react";
import noteEditorStyles from "./styles/NoteEditor.module.css";

class NoteEditor extends Component {
  onNoteChange = e => {
    this.props.onNoteChange &&
      this.props.onNoteChange({
        ...this.props.activeNote,
        [e.target.name]: e.target.value
      });
  };
  render() {
    const { activeNote } = this.props;

    return (
      <div className={noteEditorStyles["note-editor-container"]}>
        <h2>NoteEditor</h2>
        <input
          type="text"
          name="title"
          value={activeNote.title}
          onChange={this.onNoteChange}
          className={noteEditorStyles["note-editor-title"]}
          placeholder="title."
        />
        <textarea
          name="body"
          value={activeNote.body}
          onChange={this.onNoteChange}
          className={noteEditorStyles["note-editor-body"]}
          placeholder="body."
        />
        <input type="text" name="date" value={new Date(activeNote.date).toString()} className={noteEditorStyles['note-editor-date']} placeholder="date." readOnly disabled />
      </div>
    );
  }
}

export default NoteEditor;
