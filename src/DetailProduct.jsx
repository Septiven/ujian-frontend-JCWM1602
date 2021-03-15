import axios from 'axios';
import React from 'react';
import swal from 'sweetalert'

export default class DetailProduct extends React.Component{

    state = {
        dataDetailProduct: null,
        isUserLogin: null,
        mainImage: null
    }

    componentDidMount(){
        this.onCheckUserLogin()
        this.getDataProduct()
    }

    getDataProduct = () => {
        let idProduct = this.props.location.pathname.split('/')[2]

        axios.get(`http://localhost:5000/products/${idProduct}`)
        .then((res) => {
            this.setState({dataDetailProduct: res.data})
            this.setState({mainImage: res.data.img})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    onCheckUserLogin = () => {
        let id = localStorage.getItem('id')

        function checkUserLogin(id){
            if(id){
                return true
            }else{
                return false
            }
        }

        if(id){
            this.setState({isUserLogin: true})
        }else{
            this.setState({isUserLogin: false})
        }
    }


    addToCart = () => {
        let idProduct = this.props.location.pathname.split('/')[2]
        let idUser = localStorage.getItem('id')

        let dataToSend = {
            idProduct: idProduct,
            idUser: idUser,
            quantity: 1
        }

        // Saya cek terlebih dahulu apakah product ini ada didalam data carts
        axios.get(`http://localhost:5000/carts?idProduct=${idProduct}`)
        .then((res) => {
            if(res.data.length === 0){ // Apabila datanya belum ada didalam data carts
                axios.post('http://localhost:5000/carts', dataToSend)
                .then((res) => {
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
            }else{ // Apabila datanya udah ada didalam data carts
                let quantityOnDB = res.data[0].quantity
                let idCart = res.data[0].id
                
                axios.patch(`http://localhost:5000/carts/${idCart}`, {quantity: quantityOnDB + 1})
                .then((res) => {
                    console.log(res)

                     let urlAddress = this.props.location.pathname
                     window.location = urlAddress
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        })
        .catch((err) => {
            console.log(err)
        })       
    }

    alert = () => {
        swal({
            title: "Anda Belum Login!",
            icon: "warning",
            button: "Ok",
        })
    }

    render(){
        if(this.state.dataDetailProduct === null){
            return(
                <div>
                    Loading
                </div>
            )
        }
        return(
            <div className= "container">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="row my-3">
                            <div className='col-12'>
                                <img src={this.state.mainImage} className="img-fluid" alt=""/>
                            </div>
                        </div>
                        

                    </div>

                    <div className="col-12 col-md-6">
                        <div className="mt-5">
                            <h1>
                                {this.state.dataDetailProduct.name}
                            </h1>
                            <h5>
                                Rp.{(this.state.dataDetailProduct.price.toLocaleString())}
                            </h5>
                            <hr/>
                        </div>

                        <div>
                            <p>
                                Stock: {this.state.dataDetailProduct.stock} item
                            </p>
                            <hr/>
                        </div>

                        <div>
                            <h5>Description</h5>
                            <p>
                            {this.state.dataDetailProduct.description}
                            </p>
                        </div>

                        <div className="mt-5 mb-3 d-flex justify-content-center">
                        {
                                this.state.isUserLogin?
                                    <button type="button" class="w-100 btn btn-primary" onClick={this.addToCart}>Add To Cart</button>
                                :
                                    <div>
                                        <button type="button" class="w-100 btn btn-warning" onClick={this.alert}>Add To Cart</button>
                                    </div>
                            }
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}