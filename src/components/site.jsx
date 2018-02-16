import { Component, h } from "preact";

export default class Site extends Component {
  render({ matches }, state) {
    return (
      <div>
        <h1>{matches.site}</h1>
      </div>
    );
  }
}
