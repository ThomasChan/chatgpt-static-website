import React from 'react';
import { Switch } from 'antd';

export default class Mode extends React.PureComponent {

  static Chat = 'chat'

  static Image = 'image'

  onToggle = () => {
    const mode = this.props.type === Mode.Chat ? Mode.Image : Mode.Chat;
    this.props.onToggle(mode);
    localStorage.setItem('_mode', mode);
  }

  render() {
    return <div>
      <Switch
        checked={this.props.type === Mode.Chat}
        onClick={this.onToggle} />
      <div className="text-black dark:text-gray-200">
        {this.props.type}
      </div>
    </div>;
  }

}
