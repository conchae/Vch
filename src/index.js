import { render, h } from "preact";
import "preact/devtools";
import App from "./App";
export default App;

/*if ("serviceWorker" in navigator) {
  addEventListener("load", () =>
    navigator.serviceWorker.register("/service-worker.js")
  );
}*/

if (typeof window !== "undefined") {
  render(<App />, document.querySelector("#app"));
}
