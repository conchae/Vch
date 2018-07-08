import { Component, h } from "preact";


export default class File extends Component {
  render({ file }) {
    switch (file.ext.toLowerCase()) {
      case ".webm":
      case ".mp4":
        return (
          <video
            class="file-constrained"
            onClick={(e) => e.target.classList.toggle("file-constrained")}
            src={file.link}
            alt={file.name}
            controls="true"
          />
        );
        break;
      case ".mp3":
        return (
          <audio
            class="file-constrained"
            onClick={(e) => e.target.classList.toggle("file-constrained")}
            src={file.link}
            alt={file.name}
            controls="true"
          />
        );
        break;
      case ".png":
      case ".jpg":
      case ".jpeg":
      case ".gif":
        return (
          <img
            class="file-constrained"
            onClick={(e) => e.target.classList.toggle("file-constrained")}
            src={file.link}
            alt={file.name}
          />
        );
        break;
      default:
        return (
          <a
            class="file-constrained"
            onClick={(e) => e.target.classList.toggle("file-constrained")}
            href={file.link}
          >
            {file.name}
          </a>
        );
    }
  }
}
