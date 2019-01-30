import React, { Component } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markdown";
import noteEditorStyles from "./styles/NoteEditor.module.css";

class NoteEditor extends Component {
  onNoteChange = e => {
    this.props.onNoteChange &&
      this.props.onNoteChange({
        ...this.props.activeNote,
        [e.target.name]: e.target.value
      });
  };
  onNoteBodyChange = value => {
    this.onNoteChange({ target: { name: "body", value } });
  };
  onClick = () => {
    this.props.onClick && this.props.onClick();
  };
  render() {
    const { activeNote } = this.props;

    return (
      <div
        className={noteEditorStyles["note-editor-container"]}
        onClick={this.onClick}
      >
        <input
          type="text"
          name="title"
          value={activeNote.title}
          onChange={this.onNoteChange}
          className={noteEditorStyles["note-editor-title"]}
          placeholder="title."
        />
        <Editor
          name="body"
          value={activeNote.body}
          onValueChange={this.onNoteBodyChange}
          highlight={value => highlight(value, languages.markdown)}
          className={`${
            noteEditorStyles["note-editor-body"]
          } language-markdown`}
          placeholder="body."
          padding={25}
        />
        <input
          type="text"
          name="date"
          value={new Date(activeNote.date).toString()}
          className={noteEditorStyles["note-editor-date"]}
          placeholder="date."
          readOnly
          disabled
        />
      </div>
    );
  }
}

export default NoteEditor;
