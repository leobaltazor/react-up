import React, { Component } from "react";
import "./App.css";
import Excell from "./Components/Excell";
import { headers, data } from "./data/data";

class App extends Component {
    render() {
        return (
            <div className="App">
                <Excell headers={headers} initialData={data} />
            </div>
        );
    }
}

export default App;
