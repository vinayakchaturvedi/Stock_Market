import React, {Component} from "react";
import {Link} from "react-router-dom";


class GenerateView extends Component {

    constructor(props) {
        super();
        this.state = {
            stockName: props.name,
            isLoading: false,
            companyOverview: {},
            currentStockPrice: 0,
            prevStockPrice: 0
        }
    }


    async componentDidMount() {
        this.setState({
            isLoading: true
        })

        this.setState({
                companyOverview: await require('../data_and_config/Company_Overview/' + this.state.stockName + '.json'),
                isLoading: true
            }
        )
        if (localStorage.getItem('prevStockPrice') === null) {
            this.setState({
                prevStockPrice: this.state.currentStockPrice
            })
        } else {
            this.setState({
                prevStockPrice: JSON.parse(localStorage.getItem('prevStockPrice'))
            })
        }

        this.setState({
            currentStockPrice: await require('../data_and_config/CurrentDay/' + this.state.stockName + '.json').c,
            isLoading: true
        })

    }

    // 4Z8RED01YJW9L47F
    render() {
        const {isLoading} = this.state
        if (!isLoading) {
            return (
                <div>Loading...</div>
            )
        } else
            return (
                <div className="stock-view-card">


                <div>
                    <h5 className="companyDetails">Name: </h5>
                    <Link to={{
                        pathname: "/ExtendedStockView",
                        stockName: this.state.stockName
                    }}><h5 style={{color: "#df9d23"}} className="companyDetails">{this.state.companyOverview.Name}</h5></Link>
                </div>
                <div>
                    <h5 className="companyDetails">Asset Type: </h5>
                    <p className="companyDetails">{this.state.companyOverview.AssetType}</p>
                </div>
                <div>
                    <h5 className="companyDetails">Stock Exchange: </h5>
                    <p className="companyDetails">{this.state.companyOverview.Exchange}</p>
                </div>
                <div>
                    <h5 className="companyDetails">Currency: </h5>
                    <p className="companyDetails">{this.state.companyOverview.Currency}</p>
                </div>
                <div>
                    <h5 className="companyDetails">Industry: </h5>
                    <p className="companyDetails">{this.state.companyOverview.Industry}</p>
                </div>
                <div>
                    <h5 className="companyDetails">Country: </h5>
                    <p className="companyDetails">{this.state.companyOverview.Country}</p>
                </div>
                <div>
                    <h5 className="companyDetails">Current Stock Price: </h5>
                    <p
                        className="companyDetails"
                        style={
                            {display:"inline", color: this.state.prevStockPrice === 0 || this.state.currentStockPrice - this.state.prevStockPrice > 0 ? "green" : "red"}}
                    >
                        {this.state.currentStockPrice}
                    </p>
                    <div
                        className="companyDetails"
                        style={{display: this.state.currentStockPrice - this.state.prevStockPrice > 0 ? "inline-block" : "none",
                            fontSize:"20px",
                            color: "green"
                        }}
                    >
                        &nbsp; &nbsp; &uarr;
                    </div>
                    <div
                        className="companyDetails"
                        style={{display: this.state.currentStockPrice - this.state.prevStockPrice < 0 ? "inline-block" : "none",
                            fontSize:"20px",
                            color: "red"
                        }}
                    >
                        &nbsp; &nbsp; &darr;
                    </div>
                </div>
                </div>
            )
    }
}

export default GenerateView
