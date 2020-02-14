import * as React from "react";
import * as ReactDOM from "react-dom";
import {FileSelectArea} from "./components/FileSelectArea";

class App extends React.Component<any, any> {
    render() {
        return <div>
            <h1>DMARC analysis</h1>
            <FileSelectArea/>
        </div>
    }
}

window.onload = function () {
    const appRoot = document.querySelector("#app-root");
    ReactDOM.render(<App/>, appRoot)
};
