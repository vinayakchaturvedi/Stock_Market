import React, {Component} from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom'
import './App.css';
import DashBoard from "./component/Dashboard";
import ExtendedStockView from "./component/ExtendedStockView";
import Error404 from "./component/Error404";
import Contact from "./component/Contact";
import About from "./component/About";

class App extends Component {
    render() {
        return (
            <Router>
                <Route exact path='/' component={DashBoard}>
                </Route>
                <Route exact path="/DashBoard" component={DashBoard}>
                </Route>
                <Route exact path="/ExtendedStockView" component={ExtendedStockView}>
                </Route>
                <Route exact path="/Error404" component={Error404}>
                </Route>
                <Route exact path="/About" component={About}>
                </Route>
                <Route exact path="/Contact" component={Contact}>
                </Route>
            </Router>
        )
    }
}

export default App;
