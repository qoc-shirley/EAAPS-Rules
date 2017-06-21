import React, { Component } from 'react';

class InputField extends Component {
  render() {
    return (
      <div className="field">
        <input type="textfield" value={this.props.value} onChange={this.props.onChange} />
      </div>
    );
  }
}

export default InputField;