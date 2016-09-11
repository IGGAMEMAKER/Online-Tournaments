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
  visits: Array,

  day1: number,
  day2: number,
  month1: number,
  month2: number,
  year1: number,
  year2: number,
}

const options = {
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero:true
      }
    }]
  }
};

export default class AdminStats extends Component {
  state = {
    data: [{}],

    day1: 1,
    day2: new Date().getDate(),
    month1: 8,
    month2: new Date().getMonth(),
    year1: 2016,
    year2: new Date().getFullYear(),
  };

  componentWillMount() {
    this.LoadStats();

    window.onfocus = () => { this.LoadStats(); }
  }

  redraw = (delay) => {
    setTimeout(() => {
      this.draw();
    }, delay || 1000)
  };

  LoadStats = async () => {
    // const response = await request.post('full-stats').send({ date1: new Date(1, 1, 2016) });
    const { day1, day2, month1, month2, year1, year2 } = this.state;

    const date1 = new Date(year1, month1, day1, 0, 0, 0, 0);
    const date2 = new Date(year2, month2, day2, 23, 59, 59, 999);

    // console.log('dates 1..', date1);
    // console.log('dates 2..', date2);

    const query = {
      date1,
      date2
    };

    const response = await request.post('full-stats').send(query);

    console.log('LoadStats', response.body.msg);
    // const obj = Object.assign(this.state, response.body.msg);

    this.setState({ data: response.body.msg });
    // this.setState(obj);

    // rerender plots...
    this.redraw(500);
  };

  drawPlot = (id, data) => {
    const ctx = document.getElementById(id);

    if (!ctx) {
      return
    }

    let chart = new Chart(ctx, data);
  };

  shortDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() - 2000;

    return `${day}.${month}.${year}`;
  };

  getColour = (i, opacity) => {
    const c = [
      [255, 99, 132],
      [54, 162, 235],
      [255, 206, 86],
      [75, 192, 192],
      [153, 102, 255],
      [255, 159, 64]
    ];

    return `rgba(${c[i].join()}, ${opacity || 1})`;
  };

  makeDataset = (data, label, colour) => {
    // bright = (r, g, b) => {
    //   return `rgba(${r}, ${g}, ${b}, 1)`;
    // };
    //
    // blend = (r, g, b) => {
    //   return `rgba(${r}, ${g}, ${b}, 1)`;
    // };

    let backgroundColor = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)'
    ];

    let borderColor = [
      'rgba(255,99,132,1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)'
    ];

    if (colour) {
      backgroundColor = [this.getColour(colour, 0.2)];
      borderColor = [this.getColour(colour)];
    }

    return {
      label: label || '# of Votes',
      // data: [12, 19, 3, 5, 2, 3],
      data,
      backgroundColor,
      borderColor,
      borderWidth: 1
    };
  };

  pickDataFromDataArray = (key, array) => {
    return array.map(info => info[key]);
  };

  getPeriodArrayFromDataArray = (array) => {
    return array.map(info => this.shortDate(info.d1));
  };

  draw = () => {
    // labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    // {
    // label: '# of Votes',
    // data: [12, 19, 3, 5, 2, 3],
    // backgroundColor: [
    //   'rgba(255, 99, 132, 0.2)',
    //   'rgba(54, 162, 235, 0.2)',
    //   'rgba(255, 206, 86, 0.2)',
    //   'rgba(75, 192, 192, 0.2)',
    //   'rgba(153, 102, 255, 0.2)',
    //   'rgba(255, 159, 64, 0.2)'
    // ],
    // borderColor: [
    //   'rgba(255,99,132,1)',
    //   'rgba(54, 162, 235, 1)',
    //   'rgba(255, 206, 86, 1)',
    //   'rgba(75, 192, 192, 1)',
    //   'rgba(153, 102, 255, 1)',
    //   'rgba(255, 159, 64, 1)'
    // ],
    // borderWidth: 3
    // }

    const aggregated = this.state.data;

    const data = {
      type: 'line',
      data: {
        labels: this.getPeriodArrayFromDataArray(aggregated),

        datasets: [this.makeDataset(this.pickDataFromDataArray('copiedShareLink', aggregated))
        ]
      },
      options
    };

    this.drawPlot("myChart", data);
    this.drawViralityGraph();
    // this.drawPlot("myChart2", data);
    // this.drawPlot("myChart3", data);

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

  drawViralityGraph = () => {
    const aggregated = this.state.data;

    const dataset = this.makeConversionDataset(aggregated, 'copiedShareLink', 'registerByInvite');
    // const dataset = this.makeConversionDataset(aggregated, 'copiedShareLink', 'selfPayments');

    console.log('drawViralityGraph', dataset);

    const copiedShareLinkList = this.pickDataFromDataArray('copiedShareLink', aggregated);
    // console.log('drawViralityGraph copiedShareLink', copiedShareLinkList);
    const registerByInviteList = this.pickDataFromDataArray('registerByInvite', aggregated);
    const data = {
      type: 'bar',
      data: {
        labels: this.getPeriodArrayFromDataArray(aggregated),
        datasets: [this.makeDataset(dataset, 'CTR: registeredByInvite / copiedShareLink', 0)],
        // datasets: [
        //   this.makeDataset(copiedShareLinkList, 'copiedShareLink', 0),
        //   this.makeDataset(registerByInviteList, 'registerByInvite', 1)
        // ]
      },
      options
    };

    this.drawPlot("myChart2", data);
  };

  drawPaymentPageEfficiencyGraph = () => {
    this.makeConversionDataset(array)
  };

  makeConversionDataset = (array, field1, field2) => {
    const round100 = (value) => {
      return Math.ceil(value * 100) / 100
    };
    // to get correct results, you need to have s[f1] > s[f2]
    return array.map(stat => {
      const s1 = stat[field1];
      const s2 = stat[field2];

      if (!s1) return 0;

      // return { ctr: round100(s2 / s1) };
      return round100(s2 / s1);
    })
  };

  drawEmailSocialGraph = () => {
    const aggregated = this.state.data;

    const data = {
      type: 'line',
      data: {
        labels: this.getPeriodArrayFromDataArray(aggregated),

        datasets: [
          this.makeDataset(this.pickDataFromDataArray('copiedShareLink', aggregated),
            'copiedShareLink', 0),
          this.makeDataset(this.pickDataFromDataArray('registerByInvite', aggregated),
            'registerByInvite', 1),
          this.makeDataset(this.pickDataFromDataArray('registered', aggregated),
            'registeredByEmail', 2),
          this.makeDataset(this.pickDataFromDataArray('registeredSocial', aggregated),
            'registeredSocial', 3)
        ]
      },
      options
    };

    this.drawPlot("myChart3", data);
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
    console.log('render data', state.data);

    const drawField = (key, name) => {
      // <td>{this.state.data[0][k]}</td>
      return (
        <tr>
          <td>{name ? name : key}</td>
          {this.state.data.map(info => <td>{info[key]}</td>)}
        </tr>
      )
    };
    // <br />
    // {drawField('loyalUsers', 'loyalUsers')}
    // {drawField('newUsers', 'newUsers')}
    const stats = (
      <table className="table-striped" width="600px">
        {drawField('copiedShareLink')}
        {drawField('registerByInvite')}

        <br />
        {drawField('registered')}
        {drawField('registeredSocial')}


        <br />
        {drawField('shownPaymentModals')}
        {drawField('forcedPayments')}
        {drawField('menuDeposit', 'pressed-deposit-menu')}
        <br />
        {drawField('shownPaymentPage')}
        {drawField('pressedPaymentButtonQiwi')}
        {drawField('pressedPaymentButtonYandex')}
        {drawField('pressedPaymentButtonMobiles')}
        {drawField('pressedPaymentButtonBankCard')}

        <br />
        {drawField('menuCashout', 'pressed-cashout-menu')}
        {drawField('cashoutRequests', 'requested-money')}

        <br />
        {drawField('registeredToday')}
        {drawField('registeredYesterday')}
        {drawField('registeredTwoDaysAgo')}
        {drawField('registeredThreeDaysAgo')}
        {drawField('registeredSevenDaysAgo', 'registered6-7 days Ago')}
        {drawField('registered14DaysAgo', 'registered8-14 days Ago')}
        {drawField('registered21DaysAgo', 'registered14-21 days Ago')}
        {drawField('registeredMonthAgo', 'registered22-31 days Ago')}
        {drawField('registeredMoreThanMonthAgo', 'loyal for month+')}

        <br />
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

    // {
    //   state.data.map(s => {
    //     if (!s.visits) return '';
    //     const visits = s.visits.map(v => <div>{v.login} {v.date}</div>);
    //     return <div>{visits}</div>
    //   })
    // }

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
