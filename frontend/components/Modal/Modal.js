import { h, Component } from 'preact';
import request from 'superagent';

type PropsType = {
  data: {
    header: ?Component,
    body: ?Component,
    footer: ?Component,
    count: number,
    messageID: number,
  },

  buttons: Array<Component>,
  onClick: Function,
  onClose: Function,
}

export default class Modal extends Component {
  componentWillMount() {}

  markAsRead = id => {
    request
      .post('/message/shown')
      .send({ id });
  };

  render(props: PropsType) {
    let title = props.data.header;
    if (props.data.count > 1) title += ` (${props.data.count})`;
    this.markAsRead(props.data.messageID);


    return (
      <div id="modal-standard" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"> &times;</button>
              <h4 className="modal-title"> {title} </h4>
            </div>
            <div className="modal-body" id="cBody">{props.data.body}</div>
            <div className="modal-footer" id="cFooter">{props.data.footer}</div>
          </div>
        </div>
        {$("#modal-standard").modal('show')}

      </div>
    );
  }
}
