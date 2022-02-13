import React, {Component} from "react";
import {Chart} from "react-chartjs-2";
import {Link} from "react-router-dom";

class ExtendedStockView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stockName: this.props.location.stockName,
            isLoading: false,
            numberOfDays: 30,
            companyReportQueryType: "netIncome",
            companyOverview: {},
            currentStockPrice: 0,
            prevStockPrice: 0,
            priceDiff: 0,
            stockTrendChart: undefined,
            companyReportChart: undefined
        }
        this.handleClickStockTrend = this.handleClickStockTrend.bind(this)
        this.handleClickCompanyReport = this.handleClickCompanyReport.bind(this)
        this.showChart = this.showChart.bind(this)
        this.showStockChart = this.showStockChart.bind(this)
        this.showComparyReportChart = this.showComparyReportChart.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    async componentDidMount() {
        this.setState({
            isLoading: true
        })

        if (localStorage.getItem('prevStockPrice') === null) {
            this.setState({
                prevStockPrice: this.state.currentStockPrice
            })
        } else {
            this.setState({
                prevStockPrice: JSON.parse(localStorage.getItem('prevStockPrice'))
            })
        }

        if (this.state.stockName === undefined) {
            this.setState({
                stockName: JSON.parse(localStorage.getItem('stockName'))
            }, () => this.showChart())
        } else {
            localStorage.setItem('stockName', JSON.stringify(this.state.stockName));
            this.showChart()
        }

    }

    async showChart() {

        this.setState({
            companyOverview: await require('../data_and_config/Company_Overview/' + this.state.stockName + '.json'),
            isLoading: false
        })

        this.setState({
            currentStockPrice: await require('../data_and_config/CurrentDay/' + this.state.stockName + '.json').c,
            isLoading: false
        })

        this.showStockChart();
        this.showComparyReportChart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.currentStockPrice !== this.state.prevStockPrice) {
            localStorage.setItem('prevStockPrice', JSON.stringify(this.state.currentStockPrice));
        }
    }

    async showComparyReportChart() {
        this.setState({
                companyReportApiOutput: await require('../data_and_config/Income_Statement/' + this.state.stockName + '.json'),
                isLoading: false
            }
        )

        console.log(this.state.companyReportApiOutput)
        let annualReports = this.state.companyReportApiOutput.annualReports;
        let label = []
        let yAxisData = []
        for (let index in annualReports) {
            label.push(annualReports[index].fiscalDateEnding)
            yAxisData.push(annualReports[index][this.state.companyReportQueryType])
        }
        yAxisData.reverse();

        let ctx = document.getElementById(this.state.stockName + "company_report").getContext('2d');
        let oldChart = this.state.companyReportChart;
        if (oldChart !== undefined) {
            oldChart.destroy()
        }

        let currChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: label,
                datasets: [
                    {
                        label: this.state.companyReportQueryType,
                        borderColor: 'rgb(226,122,17)',
                        data: yAxisData
                    }
                ],
            },
            options: {
                legend: {
                    labels: {
                        fontColor: 'rgb(255,255,255)',
                    }
                },
                title: {
                    display: true,
                    fontColor: 'rgb(255,255,255)',
                    fontSize: 26,
                    text: this.state.companyOverview.Name + " Company Report",
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            fontColor: 'rgb(255,255,255)',
                            fontSize: 16,
                        },
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: 'rgb(255,255,255)',
                            fontSize: 16,
                        },
                    }]
                }

            }
        });

        this.setState({
            companyReportChart: currChart
        })

    }

    async showStockChart() {
        this.setState({
                stockPriceApiOutput: await require('../data_and_config/TS_Daily/' + this.state.stockName + '.json'),
                isLoading: false
            }
        )

        Date.prototype.yyyymmdd = function () {
            let mm = this.getMonth() + 1; // getMonth() is zero-based
            let dd = this.getDate();

            return [this.getFullYear(), '-',
                (mm > 9 ? '' : '0') + mm, '-',
                (dd > 9 ? '' : '0') + dd
            ].join('');
        };

        let numberOfDays = this.state.numberOfDays
        let open = []
        let close = []
        let label = []
        let startDate = Date.parse(this.state.stockPriceApiOutput["Meta Data"]["3. Last Refreshed"]) - numberOfDays * 86400000

        for (let i = 0; i <= numberOfDays; i++) {
            let curr = new Date(startDate + (i * 86400000))
            let timeSeries = this.state.stockPriceApiOutput["Time Series (Daily)"]
            if (timeSeries.hasOwnProperty(curr.yyyymmdd())) {
                open.push(timeSeries[curr.yyyymmdd()]["1. open"])
                close.push(timeSeries[curr.yyyymmdd()]["4. close"])
                label.push(curr.yyyymmdd())
            }
        }

        let ctx = document.getElementById(this.state.stockName + "stock_trend").getContext('2d');
        let oldChart = this.state.stockTrendChart;
        if (oldChart !== undefined) {
            oldChart.destroy()
        }

        let currChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: label,
                datasets: [
                    {
                        label: "OPEN",
                        borderColor: 'rgb(226,122,17)',
                        data: open
                    },
                    {
                        label: "CLOSE",
                        borderColor: 'rgb(237,9,59)',
                        data: close
                    }
                ],
            },
            options: {
                legend: {
                    labels: {
                        fontColor: 'rgb(255,255,255)',
                    }
                },
                title: {
                    display: true,
                    fontColor: 'rgb(255,255,255)',
                    fontSize: 26,
                    text: this.state.companyOverview.Name + " Stock Trend",
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            fontColor: 'rgb(255,255,255)',
                            fontSize: 16,
                        },
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: 'rgb(255,255,255)',
                            fontSize: 16,
                        },
                    }]
                }

            }
        });


        this.setState({
            stockTrendChart: currChart
        })
    }

    handleClick(event) {
        console.log("Clicked")
    }

    handleClickStockTrend(event) {
        const id = event.target.id
        this.setState({
            numberOfDays: id
        }, () => this.showStockChart())
    }

    handleClickCompanyReport(event) {
        const id = event.target.id
        this.setState({
            companyReportQueryType: id
        }, () => this.showComparyReportChart())
    }

    render() {
        return (
            <div>
                <div className="NAV">
                    <nav>
                        <input type="checkbox" id="check"/>
                        <label htmlFor="check" className="checkBtn">
                            <i className="fas fa-bars"/>
                        </label>
                        <label className="logo">EStock</label>
                        <ul>
                            <li><Link to="/Dashboard">Home</Link></li>
                            <li><Link to="/About">About</Link></li>
                            <li><Link to="/Contact">Contact</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="ExtendedStockView">
                    <div className="container">
                        <div className="item">
                            <div className="daysQuery">
                                <div className="queryType" onClick={this.handleClickStockTrend} id="5">5 Days</div>
                                <div className="queryType" onClick={this.handleClickStockTrend} id="10">10 Days</div>
                                <div className="queryType" onClick={this.handleClickStockTrend} id="30">1 Month</div>
                                <div className="queryType" onClick={this.handleClickStockTrend} id="180">6 Months</div>
                                <div className="queryType" onClick={this.handleClickStockTrend} id="365">1 Year</div>
                                <div className="queryType" onClick={this.handleClickStockTrend} id="1825">5 Years</div>
                            </div>
                            <div style={{display: this.state.isLoading ? "none" : "block"}}>
                                <canvas
                                    id={this.state.stockName + "stock_trend"}
                                />
                            </div>
                        </div>
                        <div className="item">
                            <div className="daysQuery">
                                <div className="queryType" onClick={this.handleClickCompanyReport}
                                     id="totalRevenue">Total
                                    Revenue
                                </div>
                                <div className="queryType" onClick={this.handleClickCompanyReport}
                                     id="grossProfit">Gross
                                    Profit
                                </div>
                                <div className="queryType" onClick={this.handleClickCompanyReport} id="netIncome">Net
                                    Income
                                </div>
                            </div>
                            <div style={{display: this.state.isLoading ? "none" : "block"}}>
                                <canvas
                                    id={this.state.stockName + "company_report"}
                                />
                            </div>
                        </div>
                        <div className="item">
                            <div>
                                <h5 className="companyDetails">Name: </h5>
                                <p className="companyDetails">{this.state.companyOverview.Name}</p>
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
                                    style={{color: this.state.prevStockPrice === 0 || this.state.currentStockPrice - this.state.prevStockPrice > 0 ? "green" : "red"}}
                                >
                                    {this.state.currentStockPrice}
                                </p>
                                <p
                                    className="companyDetails"
                                    style={{
                                        display: this.state.currentStockPrice - this.state.prevStockPrice > 0 ? "inline-block" : "none",
                                        fontSize: "45px",
                                        color: "green"
                                    }}
                                >
                                    &nbsp; &nbsp; &uarr;
                                </p>
                                <p
                                    className="companyDetails"
                                    style={{
                                        display: this.state.currentStockPrice - this.state.prevStockPrice < 0 ? "inline-block" : "none",
                                        fontSize: "45px",
                                        color: "red"
                                    }}
                                >
                                    &nbsp; &nbsp; &darr;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ExtendedStockView
