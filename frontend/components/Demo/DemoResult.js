import { h, Component } from 'preact';
import * as topics from './topics';

type PropsType = {
  next: Function,
  result: number,
  topic: string
}

type StateType = {}

export default class DemoTest extends Component {
  state = {};

  componentWillMount() {}

  getResultMessage = (result, topic) => {
    return topics[topic].getResultPhrase(result);
  };

  getResultDescriptionForShareLink = (result, topic) => {
    return topics[topic].getResultPhraseForShareDescription(result);
  };

  // makeShareUrl = (url, title, description, image, noparse) => {
  //   if (!url) url = "http://online-tournaments.org/";
  //
  //   if (!title) title = "Онлайн турниры";
  //   if (!description) description = "Участвуй в викторинах и выигрывай призы!";
  //   if (!image) image = "http://theartmad.com/wp-content/uploads/2015/08/Football-Stars-Wallpaper-1.jpg";
  //   noparse = true;
  //
  //   return "http://vk.com/share.php?url="+url+"&title="+title+"&description="+description+"&image="+image+"&noparse=true";
  // };

  makeShareUrl = (url, title, description, image) => {
    const shareParameters = `url=${url}&title=${title}&description=${description}&image=${image}&noparse=true`;
    return `http://vk.com/share.php?${shareParameters}`;
  };

  shareResultUrl = (result, topic) => {
    const url = `http://online-tournaments.org/realmadrid`;

    const title = 'Онлайн турниры';

    const description = this.getResultDescriptionForShareLink(result, topic);

    const image = this.getImage(result, topic);

    const shareUrl = this.makeShareUrl(url, title, description, image);

    // console.log('shareResultUrl', shareUrl);

    return shareUrl;
  };


  shareLink = (text, className, obj) => {
    var url = makeShareUrl(obj.url || null, obj.title || null, obj.description || null, obj.image || null);
    return '<a href="'+ url + '" target="_blank" class="'+className+'" >' + text + '</a>';
  };

  getImage = (result, topic) => {
    return topics[topic].image(result);

    return 'http://www.abc.es/Media/201407/08/di-stefano-bernabeu--644x362.jpg';
    return 'http://www2.pictures.gi.zimbio.com/Raul+Gonzalez+Real+Madrid+v+Betis+t5ZDLSaUHRRl.jpg';
    return '/img/CR2.jpg';
  };

  render(props: PropsType, state: StateType) {
    const topic = props.topic || 'realmadrid';
    const result = props.result;

    const resultMessage = this.getResultMessage(result, topic);
    const image = this.getImage(result, topic);

    const share = (
      <a
        onClick={() => { console.log('share'); }}
        className="link"
        href={this.shareResultUrl(result, topic)}
        target="_blank"
      >
        <span class="fa fa-vk" />
        &nbsp;Поделиться
      </a>
    );

    // const skip = (
    //   <button
    //     className="btn btn-success btn-lg"
    //     onClick={props.next}
    //   >Дальше</button>
    // );

    const skip = (
      <div style="box-styling: border-box; height: auto;">
        <a href="/" className="link">Другие турниры</a>
      </div>
    );
    return (
      <div className="demo-container">
        <h2 className="white">{resultMessage}</h2>
        <h3 className="white">{result} из 5</h3>
        <div
          className="img-responsive img-demo relative faded lighter"
          style={`background-image: url(${image});`}
        >
          <div className="center-absolute white" style="color: white">
            <div className="text-big">{result} из 5</div>
          </div>
          <div style="position: absolute; left: 0; bottom: 0; color: white; z-index: 101">{share}</div>
        </div>
        <br />
        <div className="pull-left hide">{share}</div>
        <div className="pull-right">{skip}</div>
      </div>
    );
  }
}
