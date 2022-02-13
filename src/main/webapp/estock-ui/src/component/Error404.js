import React, {Component} from "react"
import {Link} from "react-router-dom";

class Error404 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: this.props.location.message
        }
    }

    render() {
        return (
            <div className="Error404">
                <div className="mainBox">
                    <div className="err">4</div>
                    <i className="far fa-question-circle fa-spin"></i>
                    <div className="err2">4</div>
                    <div className="msg">Maybe this page moved? Got deleted? Is hiding out in quarantine? Never existed
                        in the first place?<p>Let's go <Link to="/">Home</Link> and try from there.</p></div>
                </div>
            </div>
        )
    }
}

export default Error404