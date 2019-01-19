import React, { Component } from "react";

class NoteList extends Component {
  onNoteClick = e => {
    this.props.onNoteClick &&
      this.props.onNoteClick(e.currentTarget.dataset.noteId);
  };
  render() {
    return (
      <div>
        <h2>NoteList</h2>
        {this.props.notes.map(n => (
          <div
            key={n.id}
            className="note"
            onClick={this.onNoteClick}
            data-note-id={n.id}
          >
            <h3>{n.title}</h3>
            <div>{n.body}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default NoteList;
