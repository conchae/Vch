import { Component, h } from "preact";

export default class Post extends Component {
  render({ post, matches, preview }, state) {
    let title = post.title;
    if (preview && !title) {
      title = "View Thread";
    }
    let image = "";
    if (post.file) {
      image = <img src={post.file.link} alt={post.file.name} />;
    }
    const body = { __html: post.body };

    return (
      <div class="post">
        <div class="head">
          <h1 class="title">
            <a href={"/" + matches.site + "/" + matches.board + "/" + post.no}>
              {title}
            </a>
          </h1>
          <div class="author">
            <span class="name">{post.author.name}</span>
            <span class="trip">{post.author.trip || ""} </span>
            <span class="id">id:{post.id || ""}</span>
          </div>
          <div class="meta">
            <span class="number">Post #{post.no} </span>
            <span class="time">Created on {post.time.created.toString()}</span>
          </div>
        </div>
        {image}
        <div class="body" dangerouslySetInnerHTML={body} />
      </div>
    );
  }
}
