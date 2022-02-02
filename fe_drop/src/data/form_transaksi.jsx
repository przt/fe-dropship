import React, { Component, Fragment } from 'react';
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter, MDBInput, MDBBadge, MDBIcon, MDBFormInline, MDBTable, MDBTableHead, MDBTableBody, MDBDataTable, MDBCard, MDBView, MDBCardBody, MDBBox, MDBCardHeader, MDBCardTitle, MDBCardFooter } from 'mdbreact';
import Event from '../components/Event';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { BreadCrumb } from 'primereact/breadcrumb';
import { MultiSelect } from 'primereact/multiselect';
import Axios from 'axios';
import { type } from 'os';
import { stat } from 'fs';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const IP = 'localhost:8080'


class FormTransaksi extends Component {
    state = {
        style: {
            color: "red",
            fontSize: 10,
            border: "1px solid green"
        },
        events: [
            { id: 0 }
        ],
        modal: false,
        modalAccount: false,
        dataAPI: '',
        selectedTransaksi: {
            nama: '',
            nomor_telfon: '',
            alamat: '',
            nomor_transaksi: '',
            total_transaksi: ''
        },
        formula: [],
        supplierDropdown: [],
        transaksi: {
            nama: '',
            nomor_telfon: '',
            alamat: '',
            nomor_transaksi: '',
            total_transaksi: ''
        },
        detailTransaksi: {
            nomor_transaksi: '',
            nama_supplier: '',
            nama_barang: '',
            qty: '',
            harga_beli: '',
            harga_jual: ''
        },
        globalFilter: '',
        operator: '',
        items: [
            { label: 'Transaksi' }
        ],
        home: { icon: 'pi pi-home', url: 'http://localhost:3000/sigma-react#/' }
    }

    getTransaksi = () => {
        Axios.get('http://' + IP + '/api/transaksi/')
            .then((result) => {
                this.setState({ dataAPI: result.data })
            })
    }

    getTransaksiByNo = (nomor_transaksi) => {
        Axios.get('http://' + IP + '/api/transaksi-byno/' + nomor_transaksi)
            .then((result) => {
                this.setState({ transaksiValidation: result.data },
                    () => {
                        if (this.state.transaksiValidation.includes("Error")) {
                            this.toast.show({ severity: 'error', sticky: true, summary: 'Save failed!', detail: this.state.transaksiValidation });
                            console.log("transaction is not empty", this.state.transaksiValidation)
                        } else {
                            this.addTransaksi();
                            this.toast.clear();
                        }
                    })
            })
    }

    formValidation = () => {
        if (this.state.transaksi.nomor_transaksi == '') {
            this.toast.show({ severity: 'error', sticky: true, summary: 'Save failed!', detail: "transaction number is empty" });
        } else if (this.state.transaksi.nama == '') {
            this.toast.show({ severity: 'error', sticky: true, summary: 'Save failed!', detail: "transaction is empty" });
        } else if (this.state.transaksi.nomor_transaksi != null) {
            this.getTransaksiByNo(this.state.transaksi.nomor_transaksi)
        } else {
            this.toast.clear();
            this.addTransaksi();
        }
    }
    addTransaksi = () => {
        Axios.post('http://' + IP + '/api/transaksi/', this.state.transaksi).then((result) => {
            this.setState({
                transaksi: {
                    nama: '',
                    nomor_telfon: '',
                    alamat: '',
                    nomor_transaksi: '',
                    total_transaksi: ''
                }
            }, () => {
                this.addDetailTransaksi()
            })
            alert('Add transaksi successful')
        }, (err) => {
            console.log('error when add new : ', err)
            this.setState({
                displayDialogAdd: false
            })
            alert('error : ' + err)
        })
    }
    addDetailTransaksi = () => {
        Axios.post('http://' + IP + '/api/detail_transaksi/', this.state.detailTransaksi).then((result) => {
            this.setState({
                detailTransaksi: {
                    nomor_transaksi: '',
                    nama_supplier: '',
                    nama_barang: '',
                    qty: '',
                    harga_beli: '',
                    harga_jual: ''
                }
            })
            alert('Add detail transaksi successful')
        }, (err) => {
            console.log('error when add new : ', err)
            alert('error : ' + err)
        })
    }
    handleFormChange = (event) => {
        let transaksiNew = { ...this.state.transaksi }
        transaksiNew[event.target.name] = event.target.value;
        this.setState({
            transaksi: transaksiNew
        })
    }

    handleFormChangeDetail = (event) => {
        let detailTransaksiNew = { ...this.state.detailTransaksi }
        detailTransaksiNew[event.target.name] = event.target.value;
        this.setState({
            detailTransaksi: {
                nomor_transaksi: this.state.transaksi.nomor_transaksi,
                nama_supplier: detailTransaksiNew.nama_supplier,
                nama_barang: detailTransaksiNew.nama_barang,
                qty: detailTransaksiNew.qty,
                harga_beli: detailTransaksiNew.harga_beli,
                harga_jual: detailTransaksiNew.harga_jual
            }
        })
    }

    handleDeleteEvent = (eventId) => {
        const events = this.state.events.filter(e => e.id !== eventId);
        this.setState({ events })
    }

    handleInputChange = (inputName) => value => {
        const nextValue = value;
        this.setState({
            [inputName]: nextValue
        })
    }

    handleAddEvent = () => {
        var newEvents = [...this.state.events];
        newEvents.push({
            id: newEvents.length,
        });

        this.setState({ events: newEvents });
        this.setState({
            time: "",
            title: "",
            location: "",
            description: ""
        });
        console.log("id from component : ", this.state.events)
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    toggleModalAccount = () => {
        this.setState({
            modalAccount: !this.state.modalAccount
        })
    }

    handleSelectChange = (value) => {
        this.setState({
            company: value.target.value
        })
        this.getTransaksi(value.target.value);
    }

    alert = () => {
        this.alert('Data Saved')
    }

    handleInputOperator = (e) => {
        this.setState({ operator: e.target.value })
    }

    componentDidMount() {
        this.getTransaksi(this.state.company);
    }

    render() {
        var header = <Fragment>
            <div style={{ textAlign: 'right' }} className="inline-block">
                <label style={{ marginRight: '20em' }}>Consolidation Account Code</label>
                <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search" size="25" />
            </div>
        </Fragment>

        return (
            <Fragment>
                <MDBContainer>
                    <BreadCrumb model={this.state.items} home={this.state.home} style={{ marginBottom: "1em" }} />
                    <MDBCard>
                        <MDBCardTitle style={{ marginTop: "1rem", marginLeft: "1rem" }}>Form Transaksi</MDBCardTitle>
                        <MDBCardBody>
                            <MDBRow>
                                <MDBCol>
                                    <MDBInput
                                        name="nomor_transaksi"
                                        label="Nomor Transaksi"
                                        icon="address-card"
                                        hint="Nomor Transaksi"
                                        group
                                        type="text"
                                        value={this.state.transaksi.nomor_transaksi}
                                        onChange={this.handleFormChange}
                                    />
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol>
                                    <MDBInput
                                        name="nama"
                                        label="Nama Pelanggan"
                                        icon="user"
                                        hint="Nama Pelanggan"
                                        group
                                        type="text"
                                        value={this.state.transaksi.nama}
                                        onChange={this.handleFormChange}
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <MDBInput
                                        name="nomor_telfon"
                                        label="Nomor Telfon"
                                        icon="phone"
                                        hint="Nomor Telfon"
                                        group
                                        type="text"
                                        value={this.state.transaksi.nomor_telfon}
                                        onChange={this.handleFormChange}
                                    />
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol>
                                    <MDBInput
                                        name="alamat"
                                        label="Alamat Pelanggan"
                                        icon="info"
                                        hint="Alamat Pelanggan"
                                        group
                                        type="text"
                                        value={this.state.transaksi.alamat}
                                        onChange={this.handleFormChange}
                                    />
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol>
                                <Dropdown name="nama_barang" 
                                            value={this.state.supplierDropdown} 
                                            options={this.state.dataSupplierDropdown} 
                                            optionLabel="codename"
                                            placeholder="Journal Type" 
                                            onChange={this.onJournalTypeDropdownChange}  style={{ marginRight: '0.5em', marginBottom: '0.3em' }} />
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol>
                                    <MDBInput
                                        name="nama_barang"
                                        label="Nama Barang"
                                        icon="info"
                                        hint="Nama Barang"
                                        group
                                        type="text"
                                        value={this.state.detailTransaksi.nama_barang}
                                        onChange={this.handleFormChangeDetail}
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <MDBInput
                                        name="qty"
                                        label="QTY"
                                        icon="balance-scale"
                                        hint="QTY"
                                        group
                                        type="text"
                                        value={this.state.detailTransaksi.qty}
                                        onChange={this.handleFormChangeDetail}
                                    />
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol>
                                    <MDBInput
                                        name="harga_beli"
                                        label="Harga Pokok"
                                        icon="coins"
                                        hint="harga pokok"
                                        group
                                        type="text"
                                        value={this.state.detailTransaksi.harga_beli}
                                        onChange={this.handleFormChangeDetail}
                                    />
                                </MDBCol>
                                <MDBCol>
                                    <MDBInput
                                        name="harga_jual"
                                        label="Harga Jual"
                                        icon="coins"
                                        hint="harga jual"
                                        group
                                        type="text"
                                        value={this.state.detailTransaksi.harga_jual}
                                        onChange={this.handleFormChangeDetail}
                                    />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow>
                                <MDBCol>
                                    <MDBInput
                                        name="total_transaksi"
                                        label="Total Transaksi"
                                        icon="info"
                                        hint="Total Transaksi"
                                        group
                                        type="text"
                                        value={this.state.transaksi.total_transaksi}
                                        onChange={this.handleFormChange}
                                    />
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol style={{ textAlign: 'right' }}>
                                    <MDBBtn color="success" size="sm" onClick={this.addTransaksi}>
                                        <MDBIcon icon="check" />
                                    </MDBBtn>
                                </MDBCol>
                            </MDBRow>
                            <hr className="hr-bold my-3" />
                            <MDBRow>
                                <MDBCol>

                                    <MDBBtn color="success" onClick={this.handleAddEvent}>
                                        Add data <MDBIcon className="mrl-1" icon="plus" />
                                    </MDBBtn>


                                    {/* <input type="file" id="inputGroupFile01"
                                aria-describedby="inputGroupFileAddon01"/> */}
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol>
                                    {
                                        this.state.events.map(event => (
                                            <Event
                                                key={event.id}
                                                id={event.id}
                                                no={event.no}
                                                onDelete={this.handleDeleteEvent}
                                                onDetails={this.toggleModal}
                                            />
                                        ))
                                    }
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol style={{ textAlign: 'right' }}>
                                    <MDBBtn color="success" size="sm" onClick={this.addDetailTransaksi}>
                                        <MDBIcon icon="check" />
                                    </MDBBtn>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>
                </MDBContainer>
            </Fragment>
        )
    }
}

export default FormTransaksi;