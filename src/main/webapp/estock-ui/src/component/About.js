import React, {Component} from "react";
import {Link} from "react-router-dom";

class About extends Component {

    render() {
        return (
            <div className="AboutContact">
                <body>
                <nav>
                    <input type="checkbox" id="check"/>
                    <label htmlFor="check" className="checkBtn">
                        <i className="fas fa-bars"/>
                    </label>
                    <label className="logo">EStock</label>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/About">About</Link></li>
                        <li><Link to="/Contact">Contact</Link></li>
                    </ul>
                </nav>
                <div className="About">
                    <h2>################### Company Details ###################</h2>
                    <div className="container">
                        <div className="item">
                            <h1>Name 1</h1>
                            <br/>
                            <p>
                                Details 1
                            </p>
                            <br/>
                        </div>
                        <div className="item">
                            <h1>Name 2</h1>
                            <br/>
                            <p>
                                Details 2
                            </p>
                        </div>
                        <div className="item">
                            <h1>Name 3</h1>
                            <br/>
                            <p>
                                Details 3
                            </p>
                            <br/>
                        </div>
                    </div>
                </div>
                </body>
            </div>
        )
    }
}

export default About