import React, { Component, Fragment } from 'react';
import { MDBBadge, MDBIcon, MDBInput, MDBRow, MDBCol, MDBBtn } from 'mdbreact';

class Event extends Component{
    state = {
        operation: ""
    }

    handleOperator = (e) => {
        this.setState({
            operation: e.target.value
        })
        console.log();
    }

    render(){
        return(
            <Fragment>
                {/* <div className="d-inline-block">
                    <h4>No. <MDBBadge pill color="primary">{this.props.no}</MDBBadge></h4>                    
                </div> */}
                <div className="d-inline-block" style={{paddingLeft:"10px", width:"20"}}>
                    <MDBInput 
                        name="time"
                        label="Nama Supplier"
                        group
                        type="text"
                        outline
                        value={this.props.value}
                    />
                </div>
                <div className="d-inline-block" style={{paddingLeft:"10px", width:"20%"}}>
                    <MDBInput 
                        name="time"
                        label="Nama Barang"
                        group
                        type="text"
                        outline
                        value={this.props.value}
                    />
                </div>
                <div className="d-inline-block" style={{paddingLeft:"10px", width:"10%"}}>
                    <MDBInput 
                        name="time"
                        label="qty"
                        group
                        type="text"
                        outline
                        value={this.props.value}
                    />
                </div>
                <div className="d-inline-block" style={{paddingLeft:"10px", width:"15%"}}>
                    <MDBInput 
                        name="time"
                        label="Harga Pokok"
                        group
                        type="text"
                        outline
                        value={this.props.value}
                    />
                </div>
                <div className="d-inline-block" style={{paddingLeft:"10px", width:"15%"}}>
                    <MDBInput 
                        name="time"
                        label="Harga Jual"
                        group
                        type="text"
                        outline
                        value={this.props.value}
                    />
                </div>
                <div className="d-inline-block">
                    <MDBBtn color="danger" size="sm" onClick={() => this.props.onDelete(this.props.id)}>
                    <MDBIcon icon="trash-alt"/>
                    </MDBBtn>
                </div>
            </Fragment>
        )
    }
}

export default Event;