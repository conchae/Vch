import "./style";
import { Component, h } from "preact";
import Router from "preact-router";

import Posts from "./components/posts";

export default class App extends Component {
  render(props, state) {
    return (
      <Router>
        <Posts
          path="/"
          boards={["qresearch", "patriotsfight"]}
          qTripcode="!CbboFOtcZs"
        />
      </Router>
    );
  }
}
