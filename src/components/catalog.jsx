import { Component, h } from "preact";
import { getCatalog } from "../api";
import Post from "./post";

export default class Catalog extends Component {
  constructor(props) {
    super(props);

    this.scrollListener = () => {
      if (innerHeight + scrollY >= document.body.offsetHeight) {
        this.setState((prevState, props) => ({
          loadLimit: prevState.loadLimit + 10
        }));
      }
    };
  }

  async componentDidMount() {
    if (this.props.site === "4" || this.props.site === "8") {
      const catalog = await getCatalog(this.props.site, this.props.board);
      this.setState({
        catalog,
        loadLimit: 10
      });

      addEventListener("scroll", this.scrollListener);
    }
  }

  componentWillUnmount() {
    removeEventListener("scroll", this.scrollListener);
  }

  render({ site, board, matches }, { catalog = [], loadLimit }) {
    if (site !== "4" && site !== "8") {
      return <h1>Site "{site}" is not supported</h1>;
    }

    return (
      <div class="catalog">
        <h1 class="title">
          {site}/{board}
        </h1>
        {catalog
          .slice(0, loadLimit)
          .map(post => <Post post={post} matches={matches} preview={true} />)}
      </div>
    );
  }
}
