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
    let title = post.title;
    if (preview && !title) {
      title = "View Thread";
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
        <div class="files">{post.files.map(file => <File file={file} />)}</div>
        <div class="body" dangerouslySetInnerHTML={body} />

        <a onClick={this.toggleReplies}>{post.replies.length} Replies</a>
        <div class="replies" style={`display:${visibile ? "block" : "none"}`}>
          {post.replies.map(post => <Post post={post} matches={matches} />)}
        </div>
      </div>
    );
  }
}
