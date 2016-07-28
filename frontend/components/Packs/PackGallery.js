/**
 * Created by gaginho on 07.06.16.
 */
import { h, Component } from 'preact';
// import PackButtons from './PackButtons';

type PackLayer = {
  src: string,
  name: string,
  packID: ?number,
}

type PropsType = {
  chosePack: Function,

  packs: Array<PackLayer>,
};

function chosePack(id, props: PropsType) {
  return () => {
    props.chosePack(id);
  };
}

export default function (props:PropsType): Component {
  // col-sm-4 white img-wrapper nopadding
  const gallery = props.packs.map((pack: PackLayer) => {
    // console.log('gallery', pack);
    return (
      <div
        className="pack img-wrapper light-blue"
        style={{
          'background-image': `url(${pack.src})`
          // width: '100%',
          // height: '100%',
        }}
        // src={pack.src}
        // alt={pack.name}
        onClick={chosePack(pack.packID, props)}
      ></div>
    );
  });

  return (
    <div>
      <h2 className="page">Выберите пак</h2>
      {gallery}
    </div>
  );
}
