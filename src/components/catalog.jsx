import { Component, h } from "preact";
import { getCatalog, getThread } from "../api";
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
    const catalog = await getCatalog(this.props.board);
    this.setState({
      catalog,
      loadLimit: 10
    });

    addEventListener("scroll", this.scrollListener);
  }

  componentWillUnmount() {
    removeEventListener("scroll", this.scrollListener);
  }

  render({ board, matches }, { catalog = [], loadLimit }) {
    return (
      <div class="catalog">
        <h1 class="title">/{board}</h1>
        {catalog
          .slice(0, loadLimit)
          .map(post => <Post post={post} matches={matches} preview={true}/>)}
      </div>
    );
  }
}
