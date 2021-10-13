import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import axiosConfig from "../Config/config";
import headers from "../Config/headers";

class Delete extends Component {
 
  close() {
    this.props.handleClosebtn();
  }
  errorHandle = err => {
    if (err.response.status === 401) {
      this.props.history.push("/");
      window.location.reload();
    }
  };
  handleSubmit() {
    axiosConfig
      .delete(`/resourceUtilization/${this.props.data.pa_id}`, { headers: headers() })
      .then(response => {
        this.props.handleClose();
      })
      .catch(err => {
        this.errorHandle(err);
      });
  }
  render() {
    return (
      <div id="openModal-about" className="modalDialog">
        <div>
          <div onClick={() => this.close()} title="Close" className="close">
            {" "}
            X{" "}
          </div>

          <p>Are you want to delete </p>
          <Button
            variant="success"
            className="mr-3"
            onClick={() => this.handleSubmit()}
          >
            Confirm
          </Button>
          <Button
            variant="success"
            className="mr-3"
            onClick={() => this.close()}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}
export default Delete;
