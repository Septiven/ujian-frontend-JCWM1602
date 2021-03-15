import React from "react"
import Axios from 'axios'
import swal from 'sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


export default class Checkout extends React.Component{

    state = {
        dataTransaction: null
    }

    componentDidMount(){
        this.getDataTransaction()
    }

    getDataTransaction = () => {
        let idTransaction = this.props.location.pathname.split('/')[2]

        Axios.get(`http://localhost:5000/transactions/${idTransaction}`)
        .then((res) => {
            this.setState({dataTransaction: res.data})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    payment = () => {
        let idTransaction = this.props.location.pathname.split('/')[2]

         let date = new Date()
         date = date.toString()
 
         let newDate = date.split(' ')[2] + '-' + date.split(' ')[1] + '-' + date.split(' ')[3] + ' ' + date.split(' ')[4]

        Axios.patch(`http://localhost:5000/transactions/${idTransaction}`, {status: 'sudah dibayar', createdAt: newDate})
        .then((res) => {
            swal({
                title: "Payment Success!",
                icon: "success",
                button: "Ok",
            });

            setTimeout(function(){ window.location = '/history-transaction' }, 3000);
            
        })
        .catch((err) => {
            console.log(err)
        })
    }

    render(){
        if(this.state.dataTransaction === null){
            return(
                null
            )
        }

        return(
            <div className="container" style={{marginTop: '50px'}}>
                <h4>Checkout</h4>
                <div className="row mt-4">
                    <div className="row col-7">
                        <div className="col-12 border border-light">
                            <h3>Alamat Pengiriman</h3>
                            <hr/>
                            <p className="bg-warning">
                                Penerima :
                            </p>
                            <p>
                                SEPTIVEN LUKAS
                            </p>
                            <p>
                                Alamat :
                            </p>
                            <p>
                                Jl. BSD Green Office Park, GOP 9 - G Floor BSD City, Sampora, Kec. Cisauk, Tangerang, Banten 15p5
                            </p>
                            <p>
                                No Telepon :
                            </p>
                            <p>
                                0812 - 1231 - 8695
                            </p>
                        </div>
                    </div>
                    <div className="col-4 ml-5">
                        <div className="card shadow px-4 py-3">
                            <div className="my-2 py-3 border-bottom">
                                <h5>
                                    Your Items :
                                </h5>
                                {
                                    this.state.dataTransaction.detail.map((value, index) => {
                                        return(
                                            <div key={index} className="d-flex justify-content-between">
                                                <span className="card-text">{value.productName}({value.productQuantity}x)</span>
                                                <span className="card-text">Rp.{value.productPrice.toLocaleString()}</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="mt-1 d-flex justify-content-between align-items-end">
                                    <div>
                                        <p className="mb-1">Total Bayar</p>
                                        <h6 className="my-0 font-weight-bold">Rp.{this.state.dataTransaction.total.toLocaleString()}</h6>
                                    </div>
                            </div>
                            <div className="my-5">
                                <button type="button" className="btn btn-success h-50" onClick={this.payment}>Bayar Sekarang</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}