import { Component, h } from "preact";
import { findNewQPosts, getArchivedQPosts } from "../api";
import Post from "./post";

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
      this.setState((prevState, props) => ({
        orderDesc: !prevState.orderDesc
      }));
    };

    this.scan = async () => {
      const newQPosts = await findNewQPosts(
        this.props.boards,
        this.props.qTripcode
      );
      this.setState((prevState, props) => ({
        qPosts: prevState.qPosts.concat(newQPosts)
      }));
    };
  }

  async componentDidMount() {
    const qPosts = await getArchivedQPosts();

    this.setState({
      qPosts,
      loadLimit: 50,
      orderDesc: true
    });

    addEventListener("scroll", this.scrollListener);

    this.scan();
  }

  componentWillUnmount() {
    removeEventListener("scroll", this.scrollListener);
  }

  render({}, { qPosts = [], loadLimit, orderDesc }) {
    let sortFunction;
    if (orderDesc) {
      sortFunction = (a, b) => b.meta.time - a.meta.time;
    } else {
      sortFunction = (a, b) => a.meta.time - b.meta.time;
    }

    return (
      <div class="posts">
        <a onClick={this.switchOrder}>{orderDesc ? "\u2191" : "\u2193"}</a>
        {qPosts
          .sort(sortFunction)
          .slice(0, loadLimit)
          .map(post => <Post post={post} />)}
      </div>
    );
  }
}
