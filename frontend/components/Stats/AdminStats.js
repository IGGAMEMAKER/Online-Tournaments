import { h, Component } from 'preact';

import Chart from 'chart.js';

import request from 'superagent';
// import { Line } from 'react-chartjs';
// import { Chart } from 'react-google-charts';

// import { Chart } from 'react-d3-core';
// import { LineChart } from 'react-d3-basic';

type StateType = {
  copiedShareLink: number,
  registered: number,
  registeredSocial: number,
  registerByInvite: number,

  selfPayments: number,
  shownPaymentModals: number,
  forcedPayments: number,

  errors: number,

  day1: number,
  day2: number,
  month1: number,
  month2: number,
  year1: number,
  year2: number,
}

export default class AdminStats extends Component {
  state = {
    copiedShareLink: 0,
    registered: 0,
    registeredSocial: 0,
    registerByInvite: 0,

    selfPayments: 0,
    shownPaymentModals: 0,
    forcedPayments: 0,

    errors: 0,

    day1: new Date().getDate(),
    day2: 1,
    month1: new Date().getMonth(),
    month2: 1,
    year1: new Date().getFullYear(),
    year2: 2016
  };
  componentWillMount() {
    this.LoadStats();

    window.onfocus = () => {
      setTimeout(() => {
        this.LoadStats();
      }, 5000);
    }
  }

  redraw = (delay) => {
    setTimeout(() => {
      this.draw();
    }, delay || 1000)
  };

  LoadStats = async () => {
    // const response = await request.post('full-stats').send({ date1: new Date(1, 1, 2016) });
    const response = await request.post('full-stats').send({ });

    // console.log('LoadStats', response.body);
    const obj = Object.assign(this.state, response.body.msg);

    this.setState(obj);

    // rerender plots...
    this.redraw(1000);
  };

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
    this.redraw(1);
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

    const drawField = (k) => {
      return (
        <tr>
          <td>{k}</td>
          <td>{this.state[k]}</td>
        </tr>
      )
    };
    const stats = (
      <table>
        {drawField('copiedShareLink')}
        {drawField('registered')}
        {drawField('registeredSocial')}
        {drawField('registerByInvite')}
        {drawField('selfPayments')}
        {drawField('shownPaymentModals')}
        {drawField('forcedPayments')}
        {drawField('errors')}
      </table>
    );

    const onDateFieldChange = (field) => {
      return (e: KeyboardEvent) => {
        let obj= {};
        obj[field] = e.target.value;
        this.setState(obj);
      }
    };

    const dateField = (field) => {
      return <input
        type="number"
        value={this.state[field]}
        onInput={onDateFieldChange(field)}
      />
    };

    return (
      <div>
        <h1> HEEEEEEEEEEEEEEEEEEERE</h1>
        <p>Today</p>
        <div>date1</div>
        {dateField('day1')}
        {dateField('month1')}
        {dateField('year1')}
        <br />
        <div>date2</div>
        {dateField('day2')}
        {dateField('month2')}
        {dateField('year2')}
        <br />
        <button onClick={this.LoadStats}>update stats</button>
        {stats}
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
