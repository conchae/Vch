import { Component, h } from "preact";
import File from "./file";

function readableColour($bg) {
  const r = parseInt($bg.substr(0, 2), 16);
  const g = parseInt($bg.substr(2, 2), 16);
  const b = parseInt($bg.substr(4, 2), 16);
  const contrast = Math.sqrt(r * r * 0.241 + g * g * 0.691 + b * b * 0.068);
  if (contrast > 130) {
    return "000000";
  } else {
    return "FFFFFF";
  }
}

export default class Post extends Component {
  render({ post }) {
    // Determines the text color and it's background color for Id's
    let idStyle = "";
    if (post.author.id) {
      idStyle = `background-color:#${post.author.id};color:#${readableColour(
        post.author.id
      )}`;
    }

    return (
      <div class="post">
        <div class="mentions">
          {post.mentions.map(post => <Post post={post} />)}
        </div>

        <div class="head">
          <h1 class="title" dangerouslySetInnerHTML={{ __html: post.title }} />
          <div class="author">
            <span class="name">{post.author.name}</span>
            <span class="trip">{post.author.trip || ""} </span>
            <span class="id" style={idStyle}>
              id:{post.author.id || ""}
            </span>
          </div>
          <div class="meta">
            <a
              class="number"
              href={post.meta.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Post #{post.meta.no}
            </a>
            <span class="time">{post.meta.time.toString()}</span>
          </div>
        </div>

        <div class="files">{post.files.map(file => <File file={file} />)}</div>

        <div class="body" dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    );
  }
}
