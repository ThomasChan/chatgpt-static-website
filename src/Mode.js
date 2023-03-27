import React from 'react';

export default class Mode extends React.PureComponent {

  static Chat = 'chat'

  static Image = 'image'

  onToggle = () => {
    const mode = this.props.type === Mode.Chat ? Mode.Image : Mode.Chat;
    this.props.onToggle(mode);
    localStorage.setItem('_mode', mode);
  }

  render() {
    return <button
      onClick={this.onToggle}
      className="fixed top-16 right-4 z-10 text-black dark:text-gray-200">
      {`${this.props.type.toUpperCase()} Mode`}
    </button>;
  }

}
