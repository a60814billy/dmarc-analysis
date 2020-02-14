import * as React from "react";
import * as ReactDOM from "react-dom";

window.onload = function () {
    const appRoot = document.querySelector("#app-root");
    ReactDOM.render(<div>
        <h1>DMARC analysis.</h1>
    </div>, appRoot)
};
