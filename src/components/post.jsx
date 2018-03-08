import { Component, h } from "preact";
import File from "./file";

export default class Post extends Component {
  constructor(props) {
    super(props);

    this.toggleReplies = () => {
      this.setState((prevState, props) => ({
        repliesVisible: !prevState.repliesVisible
      }));
    };
  }

  componentDidMount() {
    this.setState({
      repliesVisible: false
    });
  }

  render({ post, matches, preview }, { repliesVisible }) {
    let title = { __html: post.title };
    if (preview && !post.title) {
      title = { __html: "View Thread" };
    }
    let idStyle = "";
    if (post.id) {
      function readableColour($bg) {
        const r = parseInt($bg.substr(0, 2), 16);
        const g = parseInt($bg.substr(2, 2), 16);
        const b = parseInt($bg.substr(4, 2), 16);
        const contrast = Math.sqrt(
          r * r * 0.241 + g * g * 0.691 + b * b * 0.068
        );
        if (contrast > 130) {
          return "000000";
        } else {
          return "FFFFFF";
        }
      }
      idStyle = `background-color:#${post.id};color:#${readableColour(
        post.id
      )}`;
    }
    const body = { __html: post.body };

    let replyText = `${post.replies.length} Replies`;
    if (!post.replies.length) {
      replyText = "No Replies";
    } else if (post.replies.length === 1) {
      replyText = "1 Reply";
    }

    let replies = <div />;
    if (repliesVisible) {
      replies = post.replies.map(post => (
        <Post post={post} matches={matches} />
      ));
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
        <div class="replies">{replies}</div>
      </div>
    );
  }
}
