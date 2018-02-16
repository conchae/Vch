import { Component, h } from "preact";
import File from "./file";

export default class Post extends Component {
  constructor(props) {
    super(props);

    this.toggleReplies = () => {
      this.setState((prevState, props) => ({
        visibile: !prevState.visibile
      }));
    };
  }

  componentDidMount() {
    this.setState({
      visibile: false
    });
  }

  render({ post, matches, preview }, { visibile }) {
    let title = { __html: post.title };
    if (preview && !post.title) {
      title = { __html: "View Thread" };
    }
    let idStyle = "";
    if (post.id) {
      idStyle = `background-color:#${post.id};color:#${post.id
        .match(/../g)
        .map(hex => (255 - parseInt(hex, 16)).toString(16))
        .join("")}`;
    }
    const body = { __html: post.body };
    let replyText = `${post.replies.length} Replies`;
    if (!post.replies.length) {
      replyText = "No Replies";
    } else if (post.replies.length === 1) {
      replyText = "1 Reply";
    }

    return (
      <div class="post">
        <div class="head">
          <h1 class="title">
            <a
              href={"/" + matches.site + "/" + matches.board + "/" + post.no}
              dangerouslySetInnerHTML={title}
            />
          </h1>
          <div class="author">
            <span class="name">{post.author.name}</span>
            <span class="trip">{post.author.trip || ""} </span>
            <span class="id" style={idStyle}>
              id:{post.id || ""}
            </span>
          </div>
          <div class="meta">
            <span class="number">Post #{post.no} </span>
            <span class="time">Created on {post.time.created.toString()}</span>
          </div>
        </div>
        <div class="files">{post.files.map(file => <File file={file} />)}</div>
        <div class="body" dangerouslySetInnerHTML={body} />

        <a class="replies-toggle" onClick={this.toggleReplies}>
          {replyText}
        </a>
        <div class="replies" style={`display:${visibile ? "block" : "none"}`}>
          {post.replies.map(post => <Post post={post} matches={matches} />)}
        </div>
      </div>
    );
  }
}
