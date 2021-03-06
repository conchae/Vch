import { Component, h } from "preact";
import { findQPosts, getArchivedQPosts } from "../api";
import Post from "./post";
import settings from "../settings";

export default class Posts extends Component {
  constructor(props) {
    super(props);

    // When the user scrolls to the bottom of the page, this loads more posts
    this.scrollListener = () => {
      if (innerHeight + scrollY >= document.body.offsetHeight - 50) {
        this.setState((prevState, props) => ({
          loadLimit: prevState.loadLimit + 50
        }));
      }
    };

    this.switchOrder = () => {
      settings.orderAsc = !settings.orderAsc;
      this.forceUpdate();
    };

    // Scan the threads for all Q posts,
    // filter out any posts that were already found, and add them
    this.scan = async () => {
      const foundQPosts = await findQPosts(
        this.props.boards,
        this.props.qTripcode
      );

      this.setState((prevState, props) => {
        const alreadyRecievedPostLinks = prevState.qPosts.map(
          post => post.meta.link
        );
        const newQPosts = foundQPosts.filter(
          post => !alreadyRecievedPostLinks.includes(post.meta.link)
        );
        return {
          qPosts: prevState.qPosts.concat(newQPosts)
        };
      });
    };
  }

  async componentDidMount() {
    const qPosts = await getArchivedQPosts();

    this.setState({
      qPosts,
      loadLimit: 50
    });

    addEventListener("scroll", this.scrollListener);

    this.scan();
  }

  componentWillUnmount() {
    removeEventListener("scroll", this.scrollListener);
  }

  render({}, { qPosts = [], loadLimit }) {
    let sortFunction;
    if (settings.orderAsc) {
      sortFunction = (a, b) => a.meta.time - b.meta.time;
    } else {
      sortFunction = (a, b) => b.meta.time - a.meta.time;
    }

    return (
      <div class="posts">
        <a onClick={this.switchOrder}>
          {settings.orderAsc ? "\u2193" : "\u2191"}
        </a>
        {qPosts
          .sort(sortFunction)
          .slice(0, loadLimit)
          .map(post => <Post post={post} />)}
      </div>
    );
  }
}
