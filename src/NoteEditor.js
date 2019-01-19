import React, { Component } from "react";

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
      <div>
        <h2>NoteEditor</h2>
        <input
          type="text"
          name="title"
          value={activeNote.title}
          onChange={this.onNoteChange}
        />
        <textarea
          name="body"
          value={activeNote.body}
          onChange={this.onNoteChange}
        />
      </div>
    );
  }
}

export default NoteEditor;
