import { Component, h } from "preact";
import { getThread } from "../api";
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

    this.toggleView = () => {
      this.setState((prevState, props) => ({
        viewChrono: !prevState.viewChrono
      }));
    };
  }

  async componentDidMount() {
    if (this.props.site === "4" || this.props.site === "8") {
      const { chronological, hierarchical } = await getThread(
        this.props.site,
        this.props.board,
        this.props.number
      );
      this.setState({
        chronological,
        hierarchical,
        loadLimit: 100
      });

      addEventListener("scroll", this.scrollListener);
    }
  }

  componentWillUnmount() {
    removeEventListener("scroll", this.scrollListener);
  }

  render(
    { site, matches },
    { chronological = [], hierarchical = [], viewChrono = true, loadLimit }
  ) {
    if (site !== "4" && site !== "8") {
      return <h1>Site "{site}" is not supported</h1>;
    }

    return (
      <div class="thread">
        <div style="position:fixed;right:1em;background-color:#171717">
          <a onClick={this.toggleView}>
            {viewChrono ? "View Hierarchically" : "View Chronologically"}
          </a>
        </div>

        {(viewChrono ? chronological : hierarchical)
          .slice(0, loadLimit)
          .map(post => <Post post={post} matches={matches} />)}
      </div>
    );
  }
}
