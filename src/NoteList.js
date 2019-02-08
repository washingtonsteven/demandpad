import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import noteListStyles from "./styles/NoteList.module.css";

class NoteList extends Component {
  onNoteClick = e => {
    this.props.onNoteClick &&
      this.props.onNoteClick(e.currentTarget.dataset.noteId);
  };
  toggleOpen = () => {
    this.props.toggleList && this.props.toggleList();
  };
  addNote = () => {
    this.props.addNote && this.props.addNote();
  };
  clearNotes = () => {
    this.props.clearNotes && this.props.clearNotes();
  };
  makeExcerpt(str, len = 40) {
    let excerpt = str.substring(0, len).trim();
    if (str.length > len) excerpt += "&hellip;";
    return excerpt;
  }
  render() {
    const { activeNote, open: isOpen } = this.props;
    const noteList = [...this.props.notes].reverse();
    const containerClassName = (() => {
      let className = noteListStyles["note-list-container"];
      if (isOpen) {
        className += ` ${noteListStyles["open"]}`;
      }
      return className;
    })();
    return (
      <div className={containerClassName}>
        <h2 className={noteListStyles["note-list-title"]}>DemandPad</h2>
        <div className={noteListStyles["note-list-scroll-container"]}>
          {noteList.map(n => (
            <div
              key={n.id}
              className={`${noteListStyles["note"]} ${
                n.id === activeNote.id ? noteListStyles["active-note"] : ""
              }`}
              onClick={this.onNoteClick}
              data-note-id={n.id}
            >
              {n.title ? (
                <h3
                  dangerouslySetInnerHTML={{
                    __html: this.makeExcerpt(n.title)
                  }}
                />
              ) : (
                <h3 className={noteListStyles["note-list-new-note-title"]} />
              )}
              <div
                dangerouslySetInnerHTML={{ __html: this.makeExcerpt(n.body) }}
              />
              <div className={noteListStyles["note-list-date"]}>
                {new Date(n.date).toString()}
              </div>
            </div>
          ))}
        </div>
        <div className={noteListStyles["note-list-button-container"]}>
          <button
            onClick={this.addNote}
            className={noteListStyles["note-list-add-button"]}
          >
            <FontAwesomeIcon icon={faPlusCircle} /> Add Note
          </button>
          <button
            onClick={this.clearNotes}
            className={noteListStyles["note-list-clear-button"]}
          >
            <FontAwesomeIcon icon={faTrashAlt} /> Clear All Notes
          </button>
        </div>
        <button
          className={`${noteListStyles["note-list-open-button"]} ${
            isOpen ? noteListStyles["open"] : ""
          }`}
          onClick={this.toggleOpen}
          title={isOpen ? "Close List" : "Open List"}
          aria-label="List toggle"
        >
          <span className={noteListStyles["burger"]} />
          <span className={noteListStyles["burger"]} />
          <span className={noteListStyles["burger"]} />
        </button>
      </div>
    );
  }
}

export default NoteList;
