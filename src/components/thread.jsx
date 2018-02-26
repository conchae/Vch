import { Component, h } from "preact";
import { getCatalog, getThread } from "../api";
import Post from "./post";

export default class Thread extends Component {
  constructor(props) {
    super(props);

    this.scrollListener = () => {
      if (innerHeight + scrollY >= document.body.offsetHeight) {
        this.setState((prevState, props) => ({
          loadLimit: prevState.loadLimit + 100
        }));
      }
    };
  }

  async componentDidMount() {
    if (this.props.site === "4" || this.props.site === "8") {
      const thread = await getThread(this.props.site, this.props.board, this.props.number);
      this.setState({
        thread,
        loadLimit: 100
      });

      addEventListener("scroll", this.scrollListener);
    }
  }

  componentWillUnmount() {
    removeEventListener("scroll", this.scrollListener);
  }

  render({ site, matches }, { thread = [], loadLimit }) {
    if (site !== "4" && site !== "8") {
      return <h1>Site "{site}" is not supported</h1>;
    }

    return (
      <div class="thread">
        {thread
          .slice(0, loadLimit)
          .map(post => <Post post={post} matches={matches} />)}
      </div>
    );
  }
}
