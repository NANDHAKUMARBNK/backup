import React, {Component} from "react";
import Modal from './AddModal'

class editDelete extends Component {

    constructor(props) {
        super(props)
        this.state={
            data:props,
            showPopup:false,
            title:'',
            passData:{}
        }
    }

    agInit(params){
        this.setState({data:params})
       
    };

    editIcon(){
    this.setState({ passData: this.state.data.data })
      this.setState({ showPopup: true, title: "Edit" });
    };
    hideModal = () => {
        this.setState({ showPopup: false });
    };
    render() {
        let modal=null;
        modal=<Modal showPopup={this.state.showPopup} title={this.state.title} data={this.state.passData} handleClose={this.hideModal}>
        </Modal>
        return (

        <div>
         
          <i className="fas fa-edit mt-3" onClick={()=>this.editIcon()} ></i>
             <i class="fas fa-trash"></i>
         
 
                

{this.state.showPopup && this.state.title === "Edit"
?
modal
: null
}
</div>
         




        );
    } 
}


export default editDelete;