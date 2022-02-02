import React, { Component, Fragment } from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';
import { MDBCard, MDBRow, MDBCol, MDBInput, MDBCardBody, MDBCardTitle } from 'mdbreact';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import Axios, {post} from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

const ws = new WebSocket('ws://localhost:8000/ws')
const IP = 'localhost:8080'

class Transaksi extends Component {
    state = {
        items: [
            { label: 'Data Transaksi' }
        ],
        home: { icon: 'pi pi-home', url: 'http://localhost:3000/sigma-react#/' },
        displayDialog: false,
        displayDialogAdd: false,
        dataAPI: '',
        dataAPIdetail:'',
        selectedDetailTransaksi:{
            nomor_transaksi:'',
            nama_barang:'',
            qty:'',
            harga_beli:'',
            harga_jual:''
        },
        selectedTransaksi: {
            nama: '',
            nomor_telfon: '',
            alamat: '',
            nomor_transaksi: '',
            total_transaksi: ''
        },
        transaksi: {
            nama: '',
            nomor_telfon: '',
            alamat: '',
            nomor_transaksi: '',
            total_transaksi: ''
        },
        dataFromWebsocket: '',
        file: [],
        transaksiValidation: '',
        globalFilter: ''
    }

    getTransaksi = () => {
        Axios.get('http://' + IP + '/api/transaksi/')
            .then((result) => {
                this.setState({ dataAPI: result.data })
            })
    }

    addTransaksi = () => {
        Axios.post('http://' + IP + '/api/transaksi/', this.state.transaksi).then((result) => {
            this.getTransaksi();
            this.setState({
                transaksi: {
                    nama: '',
                    nomor_telfon: '',
                    alamat: '',
                    nomor_transaksi: '',
                    total_transaksi: ''
                },
                displayDialogAdd: false
            })
            alert('Add transaction successful')
        }, (err) => {
            console.log('error when add new : ', err)
            this.setState({
                displayDialogAdd: false
            })
            alert('error : ' + err)
        })
    }

    getDetailTransaksiByNo = (nomor_transaksi) => {
        Axios.get(`http://` + IP + `/api/detail_transaksi?nomor_transaksi=${nomor_transaksi}`)
            .then((result) => {
                this.setState({ dataAPIdetail: result.data })
            })
    }

    formValidation = () => {
        if(this.state.transaksi.nomor_transaksi == ''){
            this.toast.show({severity: 'error', sticky:true ,summary: 'Save failed!', detail: "transaction number is empty"});    
        } else if(this.state.transaksi.nama == '') {
            this.toast.show({severity: 'error', sticky:true ,summary: 'Save failed!', detail: "transaction is empty"});    
        } else if(this.state.transaksi.nomor_transaksi != null) {
            this.getTransaksiByNo(this.state.transaksi.nomor_transaksi)
        } else {
            this.toast.clear();
            this.addTransaksi();
        }
    }

    updateTransaksi = () => {
        let index = this.idSelectedTransaksi();
        Axios.put(`http://` + IP + `/api/transaksi/${index}`, this.state.selectedTransaksi).then((result) => {
            this.getTransaksi();
            this.setState({
                selectedTransaksi: {
                    nama: '',
                    nomor_telfon: '',
                    alamat: '',
                    nomor_transaksi: '',
                    total_transaksi: ''
                },
                displayDialog: false
            })
            alert('update transaction successful')
        }, (err) => {
            console.log('error : ', err)
        })
    }

    deleteTransaksi = () => {
        let index = this.idSelectedTransaksi();
        Axios.delete(`http://` + IP + `/api/transaksi/${index}`).then((result) => {
            this.getTransaksi();
            console.log('delete post with id : ', index)
        })
        this.setState({
            selectedTransaksi: '',
            displayDialog: false
        })
    }

    idSelectedTransaksi = () => {
        return this.state.selectedTransaksi.id
    }
    SelectedNomorTransaksi = () => {
        return this.state.selectedTransaksi.nomor_transaksi
    }

    handleFormChange = (event) => {
        let transaksiNew = { ...this.state.transaksi }
        transaksiNew[event.target.name] = event.target.value;
        this.setState({
            transaksi: transaksiNew
        })
    }

    handleFormChangeUpdate = (event) => {
        let transaksiUpdate = { ...this.state.selectedTransaksi }
        transaksiUpdate[event.target.name] = event.target.value;
        this.setState({
            selectedTransaksi: transaksiUpdate
        })
    }

    addNew = () => {
        this.setState({
            displayDialogAdd: true,
            selectedTransaksi: {nama: '', nomor_telfon: '', alamat: '', nomor_transaksi: '', total_transaksi: ''},
            transaksi: {nama: '', nomor_telfon: '', alamat: '', nomor_transaksi: '', total_transaksi: ''}
        })
    }

    refresh = () => {
        this.getTransaksi();
    }

    onTransaksiSelect = (e) => {
        this.setState({
            displayDialog: true,
            transaksi: Object.assign({}, e.data)
        }, () => {
            console.log('no_transaksi : ', this.state.selectedTransaksi.nomor_transaksi)
            this.getDetailTransaksiByNo(this.state.selectedTransaksi.nomor_transaksi);
        })
    }

    componentDidMount() {
        this.getTransaksi();
        // this.getDetailTransaksiByNo();
    }

    render() {
        var header = <Fragment>
            <div style={{ textAlign: 'right' }} className="inline-block">
                <label style={{ marginRight: '20em' }}>Data Transaksi</label>
                <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search" size="25" />
            </div>
        </Fragment>
        var headerDetail = <Fragment>
        <div style={{ textAlign: 'right' }} className="inline-block">
            <label style={{ marginRight: '20em' }}>Detail Transaksi</label>
        </div>
    </Fragment>

        let footer = <Fragment>
            <div className="p-clearfix" style={{ width: '100%' }}>
                <div className="inline-block" style={{ textAlign: 'left' }}>
                    <Button style={{ float: 'left', marginRight: '1em' }} icon="fas fa-download" className="p-button-warning" tooltip="Download transaction" />                </div>
            </div>
        </Fragment>;

        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Delete" icon="pi pi-times" onClick={this.deleteTransaksi} className="p-button-danger" />
            <Button label="Save" icon="pi pi-check" onClick={this.updateTransaksi} className="p-button-success" />
        </div>;

        let dialogFooterAddNew = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Cancel" icon="pi pi-times" className="p-button-danger" />
            <Button label="Save" icon="pi pi-check" onClick={this.formValidation} className="p-button-success" />
        </div>;
        return (
            <Fragment>
                <Toast ref={(el) => this.toast = el}/>
                <BreadCrumb model={this.state.items} home={this.state.home} style={{ marginBottom: "1em" }} />
                <MDBCard>
                    <MDBCardTitle style={{ marginTop: "1rem", marginLeft: "1rem" }}>Data Transaksi</MDBCardTitle>
                    <MDBCardBody>
                        <MDBRow>
                            
                            <MDBCol style={{ textAlign: 'right', marginBottom: '1em' }}>
                                <Button style={{ float: 'right', marginLeft: '1em' }} icon="fas fa-sync-alt" onClick={this.refresh} className="p-button-warning" />
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol>
                                <DataTable value={this.state.dataAPI} selection={this.state.selectedTransaksi}
                                    onSelectionChange={e => this.setState({ selectedTransaksi: e.value })}
                                    paginator={true} rows={10} header={header} footer={footer} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                                    onRowSelect={this.onTransaksiSelect} selectionMode="single">
                                    <Column field="nomor_transaksi" header="Nomor Transaksi" />
                                    <Column field="nama" header="Nama Customer" />
                                    <Column field="alamat" header="Alamat" />
                                    <Column field="nomor_telfon" header="Nomor Telfon" />
                                    <Column field="total_transaksi" header="Total Transaksi" /> 
                                </DataTable>
                            </MDBCol>
                        </MDBRow>
                        {/* Modal */}
                        <Dialog visible={this.state.displayDialog} header="Transaction Details"
                            modal={true} footer={dialogFooter} onHide={() => this.setState({ displayDialog: false })}
                            style={{ width: '60em' }}>
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol>
                                        <MDBInput
                                            name="nomor_transaksi"
                                            label="Nomor Transaksi"
                                            icon="info"
                                            hint="Nomor Transaksi"
                                            group
                                            type="text"
                                            size="sm"
                                            disabled
                                            value={this.state.selectedTransaksi.nomor_transaksi}
                                            onChange={this.handleFormChangeUpdate} disabled/>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        <MDBInput
                                            name="nama"
                                            label="Nama Customer"
                                            icon="user"
                                            hint="Nama Customer"
                                            group
                                            type="text"
                                            size="sm"
                                            value={this.state.selectedTransaksi.nama}
                                            onChange={this.handleFormChangeUpdate} />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        <MDBInput
                                            name="nomor_telfon"
                                            label="Nomor Telfon"
                                            icon="phone"
                                            hint="Nomor Telfon"
                                            group
                                            type="text"
                                            size="sm"
                                            value={this.state.selectedTransaksi.nomor_telfon}
                                            onChange={this.handleFormChangeUpdate} />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        <MDBInput
                                            name="alamat"
                                            label="Alamat"
                                            icon="info"
                                            hint="Alamat"
                                            group
                                            type="text"
                                            size="sm"
                                            value={this.state.selectedTransaksi.alamat}
                                            onChange={this.handleFormChangeUpdate}/>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        <MDBInput
                                            name="total_transaksi"
                                            label="Total Transaksi"
                                            icon="yen-sign"
                                            hint="Total Transaksi"
                                            group
                                            type="text"
                                            size="sm"
                                            value={this.state.selectedTransaksi.total_transaksi}
                                            onChange={this.handleFormChangeUpdate}
                                        />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        <DataTable value={this.state.dataAPIdetail} selection={this.state.selectedDetailTransaksi}
                                        onSelectionChange={e => this.setState({ selectedDetailTransaksi: e.value })}
                                        paginator={true} rows={10} header={headerDetail} emptyMessage="No records found"
                                        onRowSelect={this.onDetailTransaksiSelect} selectionMode="single">
                                            <Column field="nama_supplier" header="Nama Supplier" />
                                            <Column field="nama_barang" header="Nama Barang" />
                                            <Column field="qty" header="QTY" />
                                            <Column field="harga_beli" header="Harga Pokok" />
                                            <Column field="harga_jual" header="Harga Jual" /> 
                                        </DataTable>                                        
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </Dialog>
                    </MDBCardBody>
                </MDBCard>
            </Fragment>
        )
    }
}

export default Transaksi;