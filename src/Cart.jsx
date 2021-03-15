import React from 'react'
import axios from 'axios'

import swal from 'sweetalert';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default class Cart extends React.Component{

    state = {
        dataCarts: null,
        dataProducts: null,
        totalItem: 0,
        totalPrice: 0
    }

    componentDidMount(){
        this.getDataCarts()
    }

    getDataCarts = () => {
        let id = localStorage.getItem('id')

        axios.get(`http://localhost:5000/carts?idUser=${id}`)
        .then((res) => {
            let linkURLToGetDataProduct = ''
            
            res.data.forEach((value, index) => {
                linkURLToGetDataProduct += `id=${value.idProduct}&`
            })
            res.data.sort((a, b) => {
                return a.idProduct - b.idProduct
            })

            this.setState({dataCarts: res.data})
            console.log(this.state.dataCarts)

            axios.get(`http://localhost:5000/products?${linkURLToGetDataProduct}`)
            .then((res) => {
                this.setState({dataProducts: res.data})
                
                this.getOrderSummary()
            })
            .catch((err) => {
                console.log(err)
            })
        })

        .catch((err) => {
            console.log(err)
        })
    }

    getOrderSummary = () => {
        let totalItem = 0
        let totalPrice = 0

        this.state.dataCarts.forEach((value, index) => {
            totalItem += value.quantity
            totalPrice += this.state.dataProducts[index].price * value.quantity
        })

        this.setState({totalItem: totalItem, totalPrice: totalPrice})
    }

    updateQuantityProduct = (button, idCart, quantity) => {
        let quantitySebelumnya = quantity
        let quantityTerbaru = 0

        if(button === 'Plus'){
            quantityTerbaru = quantitySebelumnya + 1
        }else{
            quantityTerbaru = quantitySebelumnya - 1
        }
        
        axios.patch(`http://localhost:5000/carts/${idCart}`, {quantity: quantityTerbaru})
        .then((res) => {
            if(res.status === 200){
                this.getDataCarts()
            }
        })  
        .catch((err) => {
            console.log(err)
        })
    }

    deleteProduct = (idCart) => {
        swal({
            title: "Are you sure want to delete this product?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if(willDelete){
                axios.delete(`http://localhost:5000/carts/${idCart}`)
                .then((res) => {
                    swal({
                        title: "Product delete succesfull!",
                        icon: "success",
                        button: "Ok",
                    });

                    window.location='/'
                })
                .catch((err) => {
                    swal({
                        title: {err},
                        icon: "cancel",
                        button: "Ok",
                    });
                })
            } else {
              
            }
          });
    }

    BackToHome = () => {
        window.location="/"
    }

    createTransaction = () => {

        let idUSer = localStorage.getItem('id')

        let date = new Date()
        date = date.toString()

        let newDate = date.split(' ')[2] + '-' + date.split(' ')[1] + '-' + date.split(' ')[3] + ' ' + date.split(' ')[4]
        
        let totalPrice = this.state.totalPrice

        let detailItems = this.state.dataCarts.map((value, index) => {
            return{
                    productName: this.state.dataProducts[index].name,
                    productPrice: this.state.dataProducts[index].price,
                    productQuantity: value.quantity,
                    productImage: this.state.dataProducts[index].img
            }
        })

        const dataToSend = {
            idUser: idUSer,
            status: 'belum di bayar',
            cretedAt: newDate,
            total: totalPrice,
            detail: detailItems
        }

        // Nge-create Transaction
        axios.post('http://localhost:5000/transactions', dataToSend)
        .then((res) => {
            // Setelah Berhasil Nge-create Transaction > Update Stock Productnya
            let idTransaction = res.data.id // Id Untuk Redirect ke Halaman Checkout

            this.state.dataCarts.forEach((value, index) => {
                let stockSebelumnya = this.state.dataProducts[index].stock
                let stockTerbaru = stockSebelumnya - value.quantity

                axios.patch(`http://localhost:5000/products/${value.idProduct}`, {stock: stockTerbaru})
                .then((res) => {
                    // Setelah Berhasil Update Stock > Delete Data Carts User

                    axios.delete(`http://localhost:5000/carts/${value.id}`)
                    .then((res) => {
                        
                        swal({
                            title: "Anda ingin checkout?",
                            icon: "warning",
                            button: "Confirm",
                        });
                        setTimeout(function(){ window.location = '/checkout/' + idTransaction }, 2000);
                        
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    render(){
        if(this.state.dataCarts === null || this.state.dataProducts === null){
            return(
                null
            )
        }

        return(
            <>
                <div className = 'bg-light'>
                    <div className ='container'>
                        <div className = 'row d-flex'>

                            {/* row kiri */}
                            <div className='col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8'>
                                <div className='p-2 bg-white my-5'>
                                    <div className='col-12 mt-3'>
                                        <h3>
                                            Shopping Cart
                                        </h3>
                                        <hr/>
                                    </div>
                                    {
                                        this.state.dataCarts.map((value, index) => {
                                            return(
                                                <div className='row my-5'>
                                                    <div className ='col-4 '>
                                                        <img src={this.state.dataProducts[index].img} className='ml-3' style={{height:'100%', width:'100%'}} />
                                                    </div>
                                                    <div className ='col-8'>
                                                        <div className='ml-3'>
                                                            <h4>{this.state.dataProducts[index].name}</h4>
                                                            <h5>Rp.{this.state.dataProducts[index].price.toLocaleString()}</h5>
                                                        </div>
                                                        <div>
                                                            <button disabled={value.quantity === 1? true : false} className='btn btn-warning px-1' onClick={() => this.updateQuantityProduct('Minus', value.id, value.quantity)}>
                                                                -
                                                            </button>
                                                            <span className='mx-4'>
                                                                {value.quantity}
                                                            </span>
                                                            <button disabled={value.quantity === this.state.dataProducts[index].stock? true : false} className='btn btn-warning px-1' onClick={() => this.updateQuantityProduct('Plus', value.id, value.quantity)}>
                                                                +
                                                            </button>
                                                        </div>
                                                        <div className='mt-3'>
                                                            <button className='btn btn-danger px-1' onClick={() => this.deleteProduct(value.id)}>
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            {/* row kanan */}
                            <div className='col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 ' style={{height: '400px'}}>
                                <div className='p-2 bg-white mt-5'>
                                    <div className='col-12 mt-3'>
                                            <h3>
                                                Order Summary
                                            </h3>
                                            <hr/>
                                            <div className ='d-flex justify-content-between my-2'>
                                                <div>
                                                    Items Total
                                                </div>
                                                <div>
                                                    {this.state.totalItem} Item
                                                </div>
                                            </div>
                                            
                                            <hr/>
                                    </div>
                                    <div className='col-12'>
                                        <div className='d-flex justify-content-between'>
                                            <div>
                                                <h5>Order Total</h5>
                                            </div>
                                            <div>
                                            <h5>Rp{this.state.totalPrice.toLocaleString()}</h5>
                                            </div>
                                        </div> 
                                    </div> 
                                    
                                    {/* Button here */}
                                    
                                </div>
                                <div className ='d-flex justify-content-center mt-4'>
                                        <div>
                                            <input type='button' value='Back to Home' className ='btn btn-outline-dark mx-2' onClick={this.BackToHome} />
                                        </div>
                                        <div className = 'ml-3'>
                                            {
                                                this.state.totalItem?
                                                <input type='button' value='Checkout' className ='btn btn-primary mx-2' onClick={this.createTransaction}/>
                                                :
                                                <div class="alert alert-warning py-2" role="alert" style={{height:"40px"}}>
                                                     Cart Masih Kosong
                                                </div>
                                            }                                           
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}