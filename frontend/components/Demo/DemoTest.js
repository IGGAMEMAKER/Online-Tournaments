import { h, Component } from 'preact';
import * as topics from './topics';

type PropsType = {
  next: Function,
  topic: string
}

type StateType = {
  question: number,
  score: number,
  answers: Array<number>
}

export default class DemoTest extends Component {
  state = {
    question: 0,
    answers: [],
    score: 0
  };


  answer = (id, topic, correct, next) => {
    let { answers, question, score } = this.state;
    answers.push(id);
    question++;

    if (id === correct) {
      score++;
    }

    if (question === 5) {
      // this.setState({ question, answers, score });
      next(score);
    } else {
      this.setState({ question, answers, score });
    }
  };

  componentWillMount() {}

  render(props: PropsType, state: StateType) {
    const source = topics[props.topic];
    const index = state.question;

    const question = source.questions[index];
    const correct = source.correct[index] - 1;
    const answers = source.answers[index].map((a, i) => {
      return (
        <div
          className="demo-answer pointer"
          onClick={() => { this.answer(i, props.topic, correct, props.next)}}
        >{a}</div>
      )
    });

    return (
      <div>
        Тест
        <br />
        <div className="white">
          <h3 className="white">Вопрос: {index + 1}/5</h3>
          <h3 className="white demo-question-tab">{question}</h3>
          <h4 className="white">Очки: {state.score}</h4>
          <div>
            {answers}
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={props.next}
        >Дальше</button>
      </div>
    );
  }
}
