import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Moment from "moment";
import axiosConfig from '../Config/config';
import headers from '../Config/headers';
import Button from "react-bootstrap/Button";



class EmployeeModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            employeeId: '',
            employeeName: '',
            employeeDoj: '',
            employeeLastDate: '',
            employeeData: [],
            employeeSingleData: {},
        }
        this.saveEmployee = this.saveEmployee.bind(this)
    }

    close() {
        this.props.handleClosebtn();
    }


    errorHandle = (err) => {
        if (err.response.status === 401) {
      this.props.history.push("/");
      window.location.reload();
        }
    };

    componentDidMount() {
        if (this.props.data) {
            let empID = this.props.data.emp_id;
            axiosConfig.get(`/employee/${empID}`, { headers: headers() }).then(response => {
                let dateJoin = response.data[0].employee_doj;
                let joinDate = Moment(dateJoin).format("YYYY-MM-DD");
                let empLastDate = response.data[0].employee_lastdate;
                let lastDate = Moment(empLastDate).format("YYYY-MM-DD");
                this.setState({ employeeSingleData: response.data })
                this.setState({ employeeId: response.data[0].emp_id })
                this.setState({ employeeName: response.data[0].employee_name })
                this.setState({ employeeDoj: joinDate })
                this.setState({ employeeLastDate: lastDate })
            })
            .catch(err => {
                this.errorHandle(err);
            });
        }
    }

    saveEmployee() {
        //let employeeUpdatedId = parseInt(this.state.employeeId);
        let employeeUpdatedName = this.state.employeeName;
        let employeeUpdatedDoj = this.state.employeeDoj;
        if (this.state.employeeLastDate === 'Invalid date' || this.state.employeeLastDate === '' || this.state.employeeLastDate === null) {

        } else {
            this.state.employeeLastDate = this.state.employeeLastDate
        }
        let requestUserData = {
            employee_name: employeeUpdatedName,
            employee_doj: employeeUpdatedDoj,
            employee_lastdate: this.state.employeeLastDate
        }
        if (this.props.data) {
            axiosConfig.post(`/employee/${this.state.employeeId}`, requestUserData, { headers: headers() }).then(response => {
                requestUserData = {};
                this.close();
                this.props.handleClose();
            })
                .catch(err => {
                    this.errorHandle(err);
                });
        }
    }

    changeEmployeeId = (e) => {
        this.setState({ employeeId: e.target.value})
    }

    changeEventName = (e) => {
        this.setState({ employeeName: e.target.value })
    }
    changeEventDoJ = (e) => {
        this.setState({ employeeDoj: e.target.value })
    }
    changeEventLsDt = (e) => {
        this.setState({ employeeLastDate: e.target.value })
    }

    render() {
        return (

            <div className="modalDialog">
                <div>

                    <div onClick={() => this.close()} title="Close" className="close" > X </div>

                    <div> <h5>ADD/EDIT EMPLOYEE LIST</h5>

                    </div>


                    <form className="mt-2">
                        <Row>
                            {
                                this.props.title === "Add" ?
                                    <Col md={6} className="text-left">
                                        <label className="employeModalLabel">Execution Id</label>
                                        <input type="text" className="form-control" value={this.state.employeeId} onChange={this.changeEmployeeId}/>
                                    </Col>
                                    : null
                            }
                            {
                                this.props.title === "Edit" ?
                                    <Col md={6} className="text-left">
                                        <label className="employeModalLabel">Execution Id</label>
                                        <input type="text" readOnly className="form-control" value={this.state.employeeId} />
                                    </Col>
                                    : null
                            }
                            <Col md={6} className="text-left">
                                <label className="employeModalLabel">Employee Name</label>
                                <input type="text" className="form-control" value={this.state.employeeName} onChange={this.changeEventName} />
                            </Col>
                            <Col md={6} className="text-left">
                                <label className="employeModalLabel">Employee Doj</label>
                                <input type="date" className="form-control" value={this.state.employeeDoj} onChange={this.changeEventDoJ} />
                            </Col>
                            <Col md={6} className="text-left">
                                <label className="employeModalLabel">Employee Last Date</label>
                                <input type="date" className="form-control" value={this.state.employeeLastDate} onChange={this.changeEventLsDt} />
                            </Col>
                        </Row>
                        <Button variant="success" className="mr-3" onClick={this.saveEmployee}>Submit</Button>
                        <Button variant="success" onClick={() => this.close()}>Cancel</Button>
                    </form>
                </div>



            </div>
        )
    }


}



export default EmployeeModal;