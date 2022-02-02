import React, { Component, Fragment } from 'react';
import { MDBContainer, MDBCard, MDBCardTitle, MDBCardBody } from 'mdbreact';
import { BreadCrumb } from 'primereact/breadcrumb';
import { TabView, TabPanel } from 'primereact/tabview';
import Transaksi from './transaksi';
import FormTransaksi from './form_transaksi';

class TransaksiTab extends Component{
    state = {
        home : {icon: 'pi pi-home', url: 'http://localhost:3000/sigma-react#/'},
        items : [
            {label:'Transaksi'}
        ]
    }
    render(){
        return(
            <Fragment>
                <MDBContainer>
                    <BreadCrumb model={this.state.items} home={this.state.home} style={{marginBottom:"1em"}}/>
                    <MDBCard>
                        <MDBCardTitle style={{marginTop:'1em', marginLeft:'1em'}}>Transaksi</MDBCardTitle>
                        <MDBCardBody>
                            <TabView>
                                <TabPanel header="Form Transaksi">
                                    <FormTransaksi/>
                                </TabPanel>
                                <TabPanel header="Data Transaksi">
                                    <Transaksi/>
                                </TabPanel>
                            </TabView>
                        </MDBCardBody>
                    </MDBCard>
                </MDBContainer>
            </Fragment>
        )
    }
}

export default TransaksiTab;