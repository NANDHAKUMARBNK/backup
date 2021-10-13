import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import editDelete from './cellRenderer';
import Moment from 'moment';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import axiosConfig from '../Config/config';
import headers from '../Config/headers';
import Modal from './EmployeeModal';
import AddBtn from '../Shared/AddButton';


class EmpList extends Component {
  constructor(props) {
    super(props);
    this.state = {

      columnDefs: [
        {
          headerName: "Employee ID",
          field: "emp_id",

          sortable: true,
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Employee Name",
          field: "employee_name",
          sortable: true,
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Employee DOJ",
          field: "employee_doj",
          sortable: true,
          filter: "agNumberColumnFilter",
          cellRenderer: function (params) {
            return Moment(params.value).format('DD-MM-YYYY')
          },
        },
        {
          headerName: "Employee Last Date",
          field: "employee_lastdate",
          sortable: true,
          filter: "agNumberColumnFilter",
          cellRenderer: function (params) {
            if (params.data.employee_lastdate === null || params.data.employee_lastdate === 'Invalid date' || params.data.employee_lastdate === '' || params.data.employee_lastdate === "0000-00-00") {
              return "<span> - </span>"
            } else {
              return Moment(params.value).format('DD-MM-YYYY')
            }
          },
        },
        {
          headerName: "edit", feild: "edit",
          cellStyle: { 'cursor': 'pointer' },
          maxWidth: 50,
          cellRenderer: function (params) {
            return (
              `<i class="fas fa-edit" ></i>`
            )
          }
        },
        // {
        //   headerName: "delete", feild: "delete",
        //   cellStyle: { 'cursor': 'pointer' },
        //   maxWidth: 50,
        //   cellRenderer: function (params) {
        //     return (
        //       `<i class="fas fa-trash"></i>`
        //     )
        //   }
        // }

      ],
      rowData: [],
      defaultColDef: { resizable: true },
      rowDatafilter: [],
      periodData: [],
      projectData: [],
      showPopup: false,
      passData: {},
      paginationPageSize: 14,
      frameworkComponents: {
        editDelete: editDelete,

      },
      periodValue: '',
      filterRowData: [],
      filterRowTable: false
    }
    this.hideModal = this.hideModal.bind(this);
    this.addItems = this.addItems.bind(this)
  }


  componentDidMount() {
    this.getemplyeList()
  };

  errorHandle = err => {
    if (err.response.status === 401) {
      this.props.history.push("/");
      window.location.reload();
    }
  };
  getemplyeList() {
    axiosConfig.get('/employee', { headers: headers() }).then(response => {
      this.setState({ rowData: response.data });
    })
      .catch(err => {
        this.errorHandle(err);
      });
  }


  onGridReady = params => {
    this.gridApi = params.api;

    window.onresize = () => {
      this.gridApi.sizeColumnsToFit();
    }
  }

  onCellClicked(e) {

    let userData = e.data;
    this.setState({ passData: userData })
    if (e.colDef.headerName === 'edit') {
      this.setState({ showPopup: true, title: "Edit" });
    }
    if (e.colDef.headerName === 'delete') {
      this.setState({ deleted: true })
      this.setState({ passData: e.data })
    }
  }
  addItems() {
    this.setState({ showPopup: true, title: "Add" });
  }
  hideModal = async () => {
    await this.getemplyeList();
    this.setState({ showPopup: false })
    this.setState({ delete: false })
  }

  hideModalClosebtn = () => {
    this.setState({ showPopup: false });
    this.setState({ delete: false })
  }

  render() {
    return (
      <div>
        <h1>Employee List</h1>


        <Row>
          <Col xl={12} lg={12} md={12} sm={12} className="text-right">
            {/* <div className="addicon"  >
              <i className="fas fa-plus" onClick={this.addItems}></i>

            </div> */}

            <AddBtn btnClass={"customVioletBtn mb-2"} click={this.addItems} iTagClassName={"fas fa-plus"}/>
          </Col>
        </Row>
        <div
          className="ag-theme-balham" style={{ height: '500px', width: '100%'}}>
          <AgGridReact
            columnDefs={this.state.columnDefs}
            onGridReady={this.onGridReady}
            pagination={true}
            frameworkComponents={this.state.frameworkComponents}
            paginationPageSize={this.state.paginationPageSize}
            onCellClicked={this.onCellClicked.bind(this)}
            floatingFilter={true}
            rowData={this.state.rowData}>
          </AgGridReact>



          {this.state.showPopup && this.state.title === "Edit" ?
            <Modal history={this.props.history} showPopup={this.state.showPopup} title={this.state.title} data={this.state.passData} handleClose={this.hideModal} handleClosebtn={this.hideModalClosebtn}>

            </Modal>
            : null}

          {this.state.showPopup && this.state.title === "Add" ?
            <Modal history={this.props.history} showPopup={this.state.showPopup} title={this.state.title} handleClose={this.hideModal} handleClosebtn={this.hideModalClosebtn}>
              
            </Modal>
            : null}
        </div>
      </div>
    )
  }

}

export default EmpList;
