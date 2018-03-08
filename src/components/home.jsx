import { Component, h } from "preact";

const bookmarklet = `javascript:(function() {
  if (
    "boards.4chan.org" === location.host &&
    location.pathname.match(/\\/.+\\/thread\\/\\d+/i)
  ) {
    var a = location.pathname.match(/^\\/(.+)\\/thread/)[1],
      t = location.pathname.match(/\\/(\\d+)$/)[1],
      h = location.hash.match(/#.(\\d+)/i)
        ? location.hash.match(/#.(\\d+)/i)[1]
        : "";
    open("https://vch.netlify.com/4/" + a + "/" + t + "/" + h);
  } else if (
    "8ch.net" === location.host &&
    location.pathname.match(/\\/.+\\/res\\/\\d+.html/i)
  ) {
    var a = location.pathname.match(/^\\/(.+)\\/res/)[1],
      t = location.pathname.match(/\\/(\\d+).html$/)[1],
      h = location.hash.match(/#(\\d+)/) ? location.hash.match(/#(\\d+)/)[1] : "";
    open("https://vch.netlify.com/8/" + a + "/" + t + "/" + h);
  }
})()`;

export default class Home extends Component {
  render(props, state) {
    return (
      <div>
        <h1>ViewChan</h1>

        <p>
          Drag
          <span>
            <a href={bookmarklet}> this link </a>
          </span>
          onto your bookmarks bar. Then, once you are on a 4/8ch thread, click
          on the bookmarklet. It will let you view that thread here, in Vch.
        </p>
      </div>
    );
  }
}
