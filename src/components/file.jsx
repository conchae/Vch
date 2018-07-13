import { Component, h } from "preact";

export default class File extends Component {
  render({ file }) {
    return (
      <a
        class="file"
        href={file.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="file-name">{file.name}</span>
        <img class="file-preview" src={file.preview} alt={file.name} />
      </a>
    );
  }
}
