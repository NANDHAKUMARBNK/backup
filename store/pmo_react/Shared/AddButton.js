import React from "react";
import Button from "react-bootstrap/Button";

class AddBtn extends React.Component {
  

  render() {
    return (
      <Button className={this.props.btnClass} onClick={this.props.click}>
        <i className={this.props.iTagClassName} aria-hidden="true" />
        {this.props.btnText}
      </Button>
    );
  }
}

export default AddBtn;
