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

const IP = 'localhost:8080'

class Supplier extends Component {
    state = {
        items: [
            { label: 'Data Setup' },
            { label: 'Data Supplier' }
        ],
        home: { icon: 'pi pi-home', url: 'http://localhost:3000/sigma-react#/' },
        displayDialog: false,
        displayDialogAdd: false,
        dataAPI: '',
        selectedSuppliers: {
            nama_supplier: '',
            nomor_telfon: '',
            alamat: '',
            nama_barang: ''
        },
        suppliers: {
            nama_supplier: '',
            nomor_telfon: '',
            alamat: '',
            nama_barang: ''
        },
        dataFromWebsocket: '',
        file: [],
        suppliersValidation: ''
    }

    getSuppliers = () => {
        Axios.get('http://' + IP +'/api/suppliers/')
            .then((result) => {
                this.setState({ dataAPI: result.data })
            })
    }

    addSuppliers = () => {
        Axios.post('http://' + IP + '/api/suppliers/', this.state.suppliers).then((result) => {
            this.getSuppliers();
            this.setState({
                suppliers: {
                        nama_supplier: '',
                        nomor_telfon: '',
                        alamat: '',
                        nama_barang: ''
                },
                displayDialogAdd: false
            })
            alert('Add supplier successful')
        }, (err) => {
            console.log('error when add new : ', err)
            this.setState({
                displayDialogAdd: false
            })
            alert('error : ' + err)
        })
    }

    getSuppliersByName = (nama_supplier) => {
        Axios.get('http://' + IP + '/api/suppliers-byname/' + nama_supplier)
            .then((result) => {
                this.setState({ suppliersValidation: result.data }, 
                    () => {
                        if (this.state.suppliersValidation.includes("Error")) {
                            this.toast.show({ severity: 'error', sticky: true, summary: 'Save failed!', detail: this.state.suppliersValidation });
                            console.log("suppliers name is not empty", this.state.suppliersValidation)
                        } else {
                            this.addSuppliers();
                            this.toast.clear();
                        }
                    })
            })
    }

    formValidation = () => {
        if(this.state.suppliers.nama_supplier == ''){
            this.toast.show({severity: 'error', sticky:true ,summary: 'Save failed!', detail: "suppliers name is empty"});    
        } else if(this.state.suppliers.nama_barang == '') {
            this.toast.show({severity: 'error', sticky:true ,summary: 'Save failed!', detail: "nama barang is empty"});    
        } else {
            this.toast.clear();
            this.addSuppliers();
        }
    }

    updateSupplier = () => {
        let index = this.idSelectedSupplier();
        Axios.put(`http://` + IP + `/api/suppliers/${index}`, this.state.selectedSuppliers).then((result) => {
            this.getSuppliers();
            this.setState({
                selectedSuppliers: {
                    nama_supplier: '',
                    nomor_telfon: '',
                    alamat: '',
                    nama_barang: ''
                },
                displayDialog: false
            })
            alert('update suppliers successful')
        }, (err) => {
            console.log('error : ', err)
        })
    }

    deleteSupplier = () => {
        let index = this.idSelectedSupplier();
        Axios.delete(`http://` + IP + `/suppliers/${index}`).then((result) => {
            this.getSuppliers();
            console.log('delete post with id : ', index)
        })
        this.setState({
            selectedSuppliers: '',
            displayDialog: false
        })
    }

    idSelectedSupplier = () => {
        return this.state.selectedSuppliers.id
    }

    handleFormChange = (event) => {
        let suppliersNew = { ...this.state.suppliers }
        suppliersNew[event.target.name] = event.target.value;
        this.setState({
            suppliers: suppliersNew
        })
    }

    handleFormChangeUpdate = (event) => {
        let suppliersUpdate = { ...this.state.selectedSuppliers }
        suppliersUpdate[event.target.name] = event.target.value;
        this.setState({
            selectedSuppliers: suppliersUpdate
        })
    }

    addNew = () => {
        this.setState({
            displayDialogAdd: true,
            selectedSuppliers: {
                nama_supplier: '',
                nomor_telfon: '',
                alamat: '',
                nama_barang: ''},
            suppliers: {
                nama_supplier: '',
                nomor_telfon: '',
                alamat: '',
                nama_barang: ''
            }
        })
    }

    refresh = () => {
        this.getSuppliers();
        console.log('data from api : ', this.state.dataAPI)
    }

    onSupplierSelect = (e) => {
        this.setState({
            displayDialog: true,
            suppliers: Object.assign({}, e.data)
        })
    }

    componentDidMount() {
        this.getSuppliers();
    }

    render() {
        var header = <Fragment>
            <div style={{ textAlign: 'right' }} className="inline-block">
                <label style={{ marginRight: '20em' }}>Data Supplier</label>
                <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search" size="25" />
            </div>
        </Fragment>

        let footer = <Fragment>
            <div className="p-clearfix" style={{ width: '100%' }}>
                <div className="inline-block" style={{ textAlign: 'left' }}>
                    <Button style={{ float: 'left', marginRight: '1em' }} icon="fas fa-download" className="p-button-warning" tooltip="Download company code" />                </div>
            </div>
        </Fragment>;

        let dialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Delete" icon="pi pi-times" onClick={this.deleteSupplier} className="p-button-danger" />
            <Button label="Save" icon="pi pi-check" onClick={this.updateSupplier} className="p-button-success" />
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
                    <MDBCardTitle style={{ marginTop: "1rem", marginLeft: "1rem" }}>Data Supplier</MDBCardTitle>
                    <MDBCardBody>
                        <MDBRow>
                            
                            <MDBCol style={{ textAlign: 'right', marginBottom: '1em' }}>
                                <Button style={{ float: 'right', marginLeft: '1em' }} icon="fas fa-sync-alt" onClick={this.refresh} className="p-button-warning" />
                                <Button style={{ float: 'right', marginLeft: '1em' }} label="Add" icon="fas fa-plus-circle" onClick={this.addNew} className="p-button-success" />
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol>
                                <DataTable value={this.state.dataAPI} selection={this.state.selectedSuppliers}
                                    onSelectionChange={e => this.setState({ selectedSuppliers: e.value })}
                                    paginator={true} rows={10} header={header} footer={footer} globalFilter={this.state.globalFilter} emptyMessage="No records found"
                                    onRowSelect={this.onSupplierSelect} selectionMode="single">
                                    <Column field="nama_supplier" header="Nama Supplier" />
                                    <Column field="nomor_telfon" header="Nomor Telfon" />
                                    <Column field="alamat" header="Alamat" />
                                    <Column field="nama_barang" header="Nama Barang" />
                                </DataTable>
                            </MDBCol>
                        </MDBRow>
                        {/*modal code*/}
                        <Dialog visible={this.state.displayDialogAdd} header="Tambah Supplier"
                            modal={true} footer={dialogFooterAddNew} onHide={() => this.setState({ displayDialogAdd: false })}
                            style={{ width: '40em' }}>
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol size="0">
                                        <label style={{color:'red',  marginTop:'2.5em'}}>*</label>
                                    </MDBCol>
                                    <MDBCol>
                                        <MDBInput
                                            name="nama_supplier"
                                            label="Nama Supplier"
                                            icon="user"
                                            hint="Nama Supplier"
                                            group
                                            type="text"
                                            size="sm"
                                            value={this.state.suppliers.nama_supplier}
                                            onChange={this.handleFormChange}/>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol size="0">
                                        <label style={{color:'red',  marginTop:'2.5em'}}>*</label>
                                    </MDBCol>
                                    <MDBCol>
                                        <MDBInput
                                            name="nomor_telfon"
                                            label="Nomor Telfon"
                                            icon="phone"
                                            hint="Nomor Telfon"
                                            group
                                            type="text"
                                            size="sm"
                                            value={this.state.suppliers.nomor_telfon}
                                            onChange={this.handleFormChange} />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                <MDBCol size="0">
                                        <label style={{color:'red',  marginTop:'2.5em'}}>*</label>
                                    </MDBCol>
                                    <MDBCol>
                                        <MDBInput
                                            name="alamat"
                                            label="Alamat"
                                            icon="info"
                                            hint="Alamat"
                                            group
                                            type="text"
                                            size="sm"
                                            value={this.state.suppliers.alamat}
                                            onChange={this.handleFormChange} />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                <MDBCol size="0">
                                        <label style={{color:'red',  marginTop:'2.5em'}}>*</label>
                                    </MDBCol>
                                    <MDBCol>
                                        <MDBInput
                                            name="nama_barang"
                                            label="Nama Barang"
                                            icon="shopping-bag"
                                            hint="Nama Barang"
                                            group
                                            type="text"
                                            size="sm"
                                            value={this.state.suppliers.nama_barang}
                                            onChange={this.handleFormChange} />
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </Dialog>
                        <Dialog visible={this.state.displayDialog} header="Suppliers Code Details"
                            modal={true} footer={dialogFooter} onHide={() => this.setState({ displayDialog: false })}
                            style={{ width: '40em' }}>
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol>
                                        <MDBInput
                                            name="nama_supplier"
                                            label="Nama Supplier"
                                            icon="user"
                                            hint="Nama Supplier"
                                            group
                                            type="text"
                                            size="sm"
                                            value={this.state.selectedSuppliers.nama_supplier}
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
                                            value={this.state.selectedSuppliers.nomor_telfon}
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
                                            value={this.state.selectedSuppliers.alamat}
                                            onChange={this.handleFormChangeUpdate} />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        <MDBInput
                                            name="nama_barang"
                                            label="Nama Barang"
                                            icon="shopping-bag"
                                            hint="Nama Barang"
                                            group
                                            type="text"
                                            size="sm"
                                            value={this.state.selectedSuppliers.nama_barang}
                                            onChange={this.handleFormChangeUpdate} />
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

export default Supplier;