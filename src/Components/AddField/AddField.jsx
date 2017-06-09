import React, { Component } from 'react';

class AddField extends Component {
  render() {
    return (
      <div className={this.props.fieldName}>
        <input type="textfield" value={this.props.value} onChange={this.props.onChange} />
      </div>
    );
  }
}

export default AddField;