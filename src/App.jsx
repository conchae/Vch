import "./style";
import { Component, h } from "preact";
import Router from "preact-router";

import Posts from "./components/posts";
import settings from "./settings";

export default class App extends Component {
  render(props, state) {
    return (
      <Router>
        <Posts
          path="/"
          boards={settings.boards}
          qTripcode={settings.qTripcode}
        />
      </Router>
    );
  }
}
