import React, {Component} from "react";
import {Chart} from "react-chartjs-2";
import GenerateView from "./GenerateView";

class GenerateGraph extends Component {

    constructor(props) {
        super();
        this.state = {
            stockName: props.name,
            date: "",
            isLoading: false,
            apiOutput: {},
        }

        this.showChart = this.showChart.bind(this)
    }


    async componentDidMount() {
        this.setState({
            isLoading: true
        })

        this.setState({
                apiOutput: await require('../data_and_config/TS_Intraday/' + this.state.stockName + '.json'),
                isLoading: false
            }
        )

        Date.prototype.dateTimeFormat = function () {
            let mm = this.getMonth() + 1; // getMonth() is zero-based
            let dd = this.getDate();
            let hh = this.getHours();
            let min = this.getMinutes();

            return [this.getFullYear(), '-',
                (mm > 9 ? '' : '0') + mm, '-',
                (dd > 9 ? '' : '0') + dd, ' ',
                hh, ':', (min > 9 ? '' : '0') + min, ':00'
            ].join('');
        };

        this.showChart();
    }

    showChart() {
        let open = []
        let label = []
        let startTime = Date.parse(this.state.apiOutput["Meta Data"]["3. Last Refreshed"]) - 36000000
        let endTime = Date.parse(this.state.apiOutput["Meta Data"]["3. Last Refreshed"])
        let iterator = startTime;
        this.setState({
            date: new Date(endTime).dateTimeFormat().substr(0, 10)
        })

        while (iterator !== endTime) {
            let curr = new Date(iterator)
            let timeSeries = this.state.apiOutput["Time Series (5min)"]
            if (timeSeries.hasOwnProperty(curr.dateTimeFormat())) {
                open.push(timeSeries[curr.dateTimeFormat()]["1. open"])
                label.push(curr.dateTimeFormat().substr(11, 5))
            }
            iterator += 300000
        }

        let ctx = document.getElementById(this.state.stockName).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: label,
                datasets: [
                    {
                        label: "Stock Price",
                        borderColor: 'rgb(17,135,226)',
                        data: open
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
                    fontSize: 20,
                    text: this.state.date,
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
        })
    }

    render() {
        return (
            <div style={{display: this.state.isLoading ? "none" : "block"}} className="GenerateView">
                <div className="container">
                    <div className="item graph">
                        <canvas
                            id={this.state.stockName}
                            height="180px"
                        />
                    </div>
                    <div className="item">
                        &nbsp;
                        <GenerateView
                            name={this.state.stockName}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default GenerateGraph