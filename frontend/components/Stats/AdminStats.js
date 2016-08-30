import { h, Component } from 'preact';

import Chart from 'chart.js';

// import { Line } from 'react-chartjs';
// import { Chart } from 'react-google-charts';

// import { Chart } from 'react-d3-core';
// import { LineChart } from 'react-d3-basic';

type PropsType = {}

type StateType = {}

export default class AdminStats extends Component {
  componentWillMount() {
  }

  drawPlot = (id, data) => {
    const ctx = document.getElementById(id);

    if (!ctx) {
      return
    }

    let chart = new Chart(ctx, data);
  };

  draw = () => {
    const data = {
      type: 'bar',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],

        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 3
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    };
    this.drawPlot("myChart", data);
    this.drawPlot("myChart2", data);
    this.drawPlot("myChart3", data);

    // const ctx = document.getElementById("myChart");
    //
    // if (!ctx) {
    //   return
    // }
    // const data = {
    //   type: 'bar',
    //   data: {
    //     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //     datasets: [{
    //       label: '# of Votes',
    //       data: [12, 19, 3, 5, 2, 3],
    //       backgroundColor: [
    //         'rgba(255, 99, 132, 0.2)',
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 206, 86, 0.2)',
    //         'rgba(75, 192, 192, 0.2)',
    //         'rgba(153, 102, 255, 0.2)',
    //         'rgba(255, 159, 64, 0.2)'
    //       ],
    //       borderColor: [
    //         'rgba(255,99,132,1)',
    //         'rgba(54, 162, 235, 1)',
    //         'rgba(255, 206, 86, 1)',
    //         'rgba(75, 192, 192, 1)',
    //         'rgba(153, 102, 255, 1)',
    //         'rgba(255, 159, 64, 1)'
    //       ],
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       yAxes: [{
    //         ticks: {
    //           beginAtZero:true
    //         }
    //       }]
    //     }
    //   }
    // };
    //
    // let chart = new Chart(ctx, data);
  };

  componentDidMount() {
    setTimeout(() => {
      this.draw();
    }, 1000);
  }

  render(props: PropsType, state: StateType) {
    // const data = {
    //   labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //   datasets: [{
    //     label: '# of Votes',
    //     data: [12, 19, 3, 5, 2, 3],
    //     backgroundColor: [
    //       'rgba(255, 99, 132, 0.2)',
    //       'rgba(54, 162, 235, 0.2)',
    //       'rgba(255, 206, 86, 0.2)',
    //       'rgba(75, 192, 192, 0.2)',
    //       'rgba(153, 102, 255, 0.2)',
    //       'rgba(255, 159, 64, 0.2)'
    //     ],
    //     borderColor: [
    //       'rgba(255,99,132,1)',
    //       'rgba(54, 162, 235, 1)',
    //       'rgba(255, 206, 86, 1)',
    //       'rgba(75, 192, 192, 1)',
    //       'rgba(153, 102, 255, 1)',
    //       'rgba(255, 159, 64, 1)'
    //     ],
    //     borderWidth: 1
    //   }]
    // };
    // const options = {
    //   scales: {
    //     yAxes: [{
    //       ticks: {
    //         beginAtZero:true
    //       }
    //     }]
    //   }
    // };

    // <Line data={data} options={options} width="600" height="250"/>
    //     <canvas id="myChart" width="400" height="400"></canvas>
    //     {}
          // const myChart = new Chart(ctx, data);

    return (
      <div>
        <h1> HEEEEEEEEEEEEEEEEEEERE</h1>
        <div style="width: 300px; height: 300px; display: inline-block;">
          <canvas id="myChart" width="400" height="400" />
        </div>
        <div style="width: 300px; height: 300px; display: inline-block;">
          <canvas id="myChart2" width="400" height="400" />
        </div>
        <div style="width: 300px; height: 300px; display: inline-block;">
          <canvas id="myChart3" width="400" height="400" />
        </div>
      </div>
    );
    // <Line data={data} options={options} width="600" height="250"/>
    // <Chart chartType = "ScatterChart" data = {[     ['Age', 'Weight'], [ 8,      12], [ 4,      5.5]]} options = {{}} graph_id = "ScatterChart"  width={"100%"} height={"400px"}  legend_toggle={true} />
  }
}
