import { h, Component } from 'preact';
import * as topics from './topics';

import getShareLink from '../../helpers/vk-share-link';
import clipboard from '../../helpers/copy-to-clipboard';

type PropsType = {
  next: Function,
  result: number,
  topic: string,
  id: string,
  link: string,
  description: string
}

type StateType = {
  copied: boolean
}

export default class DemoTest extends Component {
  state = { copied: false };

  getResultMessage = (result, topic) => {
    return topics[topic].getResultPhrase(result);
  };

  getResultDescriptionForShareLink = (result, topic) => {
    return topics[topic].getResultPhraseForShareDescription(result);
  };

  shareResultUrl = (result, topic, id, link, testTitle) => {
    const url = `http://online-tournaments.org/Tests?test=${link}&id=${id}`;

    const title = testTitle || 'Онлайн турниры';

    const description = this.getResultDescriptionForShareLink(result, topic);

    const image = this.getImage(result, topic);

    return getShareLink(url, title, description, image);
  };

  getImage = (result, topic) => {
    return topics[topic].image(result);

    return 'http://www.abc.es/Media/201407/08/di-stefano-bernabeu--644x362.jpg';
    return 'http://www2.pictures.gi.zimbio.com/Raul+Gonzalez+Real+Madrid+v+Betis+t5ZDLSaUHRRl.jpg';
    return '/img/CR2.jpg';
  };

  renderCopyTestUrlButton = (id) => {
    const copyLink = () => {
      clipboard(id);

      this.setState({ copied: true });
    };

    const copyText = this.state.copied ? 'Ссылка скопирована' : 'Отправить друзьям';

    return <a className="link" onClick={copyLink}>{copyText}</a>;
  };

  render(props: PropsType) {
    console.log('render DemoResult.js', props);
    const topic  = props.topic || 'realmadrid';
    const { result, id, description } = props;

    const resultMessage = this.getResultMessage(result, topic);
    const image = this.getImage(result, topic);

    const share = (
      <a
        onClick={() => { console.log('share'); }}
        className="link"
        href={this.shareResultUrl(result, topic, id, props.link, description)}
        target="_blank"
        style="border-radius: 25px"
      >
        <span class="fa fa-vk" />
        &nbsp;Поделиться
      </a>
    );

    // const skip = <button className="btn btn-success btn-lg" onClick={props.next}>Дальше</button>;
    //
    const skip = (
      <a href="/" className="btn btn-success btn-lg" onClick={props.next}>Дальше</a>
    );

    //
    const link = `http://online-tournaments.org/Tests?test=${props.link}&id=${props.id}`;
    return (
      <div className="demo-container">
        <h2 className="test-result-description white">{resultMessage}</h2>
        <div
          className="img-responsive img-demo relative faded lighter"
          style={`background-image: url(${image});`}
        >
          <div className="center-absolute white upper-layer">
            <div className="text-humongous">{result}/6</div>
          </div>
          <div className="white upper-layer" style="left: 20px; bottom: 35px;">{share}</div>
          <div className="white upper-layer" style="right: 20px; bottom: 35px;">
            {this.renderCopyTestUrlButton(props.id)}
          </div>
        </div>
        <br />
        <div>{skip}</div>
        <input id={props.id} style="opacity: 0" value={link} />
      </div>
    );
  }
}
