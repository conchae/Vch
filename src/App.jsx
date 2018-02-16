import "./style";
import { Component, h } from "preact";
import Router from "preact-router";
import Redirect from "./components/redirect";

import Home from "./components/home";
import Site from "./components/site";
import Catalog from "./components/catalog";
import Thread from "./components/thread";

export default class App extends Component {
  render(props, state) {
    return (
      <Router>
        <Home path="/" />
        <Site path="/:site" />
        <Catalog path="/:site/:board" />
        <Thread path="/:site/:board/:number" />
      </Router>
    );
  }
}
