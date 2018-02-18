import { Component, h } from "preact";

export default class File extends Component {
  render({ file }) {
    switch (file.ext.toLowerCase()) {
      case ".webm":
      case ".mp4":
        return (
          <video class="file" src={file.link} alt={file.name} controls="true" />
        );
        break;
      case ".mp3":
        return (
          <audio class="file" src={file.link} alt={file.name} controls="true" />
        );
        break;
      case ".png":
      case ".jpg":
      case ".jpeg":
      case ".gif":
        const url = new URL(file.link);
        return <img class="file" src={`https://i.scaley.io/https/${url.host}${url.pathname}`} alt={file.name} />;
        break;
      default:
        return (
          <a class="file" href={file.link}>
            {file.name}
          </a>
        );
    }
  }
}
