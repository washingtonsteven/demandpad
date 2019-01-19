import React, { Component } from "react";
import noteListStyles from "./styles/NoteList.module.css";

class NoteList extends Component {
  state = {
    isOpen: false
  };
  onNoteClick = e => {
    this.props.onNoteClick &&
      this.props.onNoteClick(e.currentTarget.dataset.noteId);
  };
  toggleOpen = () => {
    this.setState(state => ({
      ...state,
      isOpen: !state.isOpen
    }));
  };
  render() {
    const { isOpen } = this.state;
    const containerClassName = (() => {
      let className = noteListStyles["note-list-container"];
      if (isOpen) {
        className += ` ${noteListStyles["open"]}`;
      }
      return className;
    })();
    return (
      <div className={containerClassName}>
        <h2>NoteList</h2>
        {this.props.notes.map(n => (
          <div
            key={n.id}
            className={noteListStyles["note"]}
            onClick={this.onNoteClick}
            data-note-id={n.id}
          >
            <h3>{n.title}</h3>
            <div>{n.body}</div>
          </div>
        ))}
        <button
          className={noteListStyles["note-list-button"]}
          onClick={this.toggleOpen}
        >
          {isOpen ? "Close List" : "Open List"}
        </button>
      </div>
    );
  }
}

export default NoteList;
