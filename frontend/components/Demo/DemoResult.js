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

  getResult = (result, topic, share) => {
    return topics[topic].result(result, share);
    return share ? 'Я - верный Мадридист. А ты? Пройди тест и узнай!' : 'Ты - верный Мадридист';
    return share ? 'Я - легенда! А ты? Пройди тест и узнай!' : 'Ты - легенда!';
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

    const description = this.getResult(result, topic, true);

    const image = this.getImage(result, topic);

    const shareUrl = this.makeShareUrl(url, title, description, image);

    // console.log('shareResultUrl', shareUrl);

    return shareUrl;
    // return this.makeShareUrl(null, null, null, null);
  };


  shareLink = (text, className, obj) => {
    var url = makeShareUrl(obj.url||null, obj.title||null, obj.description||null, obj.image||null);
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

    const resultMessage = this.getResult(result, topic);
    const image = this.getImage(result, topic);

    const share = (
      <a
        onClick={() => { console.log('share'); }}
        className="btn btn-primary btn-lg"
        href={this.shareResultUrl(result, topic)}
        target="_blank"
      >
        <span class="fa fa-vk" />
        &nbsp;Поделиться
      </a>
    );

    const skip = (
      <button
        className="btn btn-success btn-lg"
        onClick={props.next}
      >Дальше</button>
    );
    return (
      <div className="demo-container">
        <h2 className="white">{resultMessage}</h2>
        <div
          className="img-responsive img-demo"
          style={`background-image: url(${image});`}
        ></div>
        <br />
        <div className="pull-left">{share}</div>
        <div className="pull-right">{skip}</div>
      </div>
    );
  }
}
