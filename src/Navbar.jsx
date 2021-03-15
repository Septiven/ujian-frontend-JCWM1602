import react from 'react'
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faEye} from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom'

class Navbar extends react.Component{

    state={
        email: null,
        showModal: false,
        showPassword: false,
        totalCarts: 0
    }

    componentDidMount(){
        this.getEmail()
        this.getTotalCarts()
    }

    getEmail = () => {
        let id = localStorage.getItem('id')

        if(id){
            Axios.get(`http://localhost:5000/users` + `/${id}`)
            .then((res) => {
                console.log(res.data)
                this.setState({email: res.data.email})

                // KALO USERNAME MAU DIBATAS SEBANYAK 3 KARAKTER SAJA
                // let panggilan = ''
                // for(let i=0;i<3;i++){
                //     panggilan += res.data.username[i]
                //     this.setState({username: panggilan})
                // }

            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    getTotalCarts = () => {
        let id = localStorage.getItem('id')

        Axios.get(`http://localhost:5000/carts?idUSer=${id}`)
        .then((res) => {
            this.setState({totalCarts: res.data.length})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    onLogin = () => {
        let inputLogin = this.refs.inputLogin.value
        let inputPasswordLogin = this.refs.inputPasswordLogin.value

        Axios.get(`http://localhost:5000/users` + `?email=${inputLogin}&password=${inputPasswordLogin}`)
        .then((res) => {
            if(res.data.length === 1){
                alert('Login Berhasil')
                localStorage.setItem('id', res.data[0].id)
                
                this.setState({showModal: false})
                window.location = '/'
            }else if(res.data.length !== 1){
                alert('User & Password Tidak Ditemukan')
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

    onLogout = () => {
        let confirm = window.confirm('Anda Yakin Mau Logout?')

        if(confirm){
            localStorage.removeItem('id')
            window.location = '/'
        }
    }

    render(){
        return(
            <div className="bg bg-info" style={{height:"60px",textAlign:"center"}}>
                <div className="container">
                    <div className="d-flex" style={{height:"60px"}}>
                        <div className="col-3 align-self-center" style={{textAlign:"left"}}>
                            <Link to='/'>
                            <h3>Toko Sepatu</h3>
                            </Link>
                        </div>
                            <div className="col-3 align-self-center">
                                {this.state.email?
                                `Hello, ${this.state.email}`
                                :
                                null
                                }
                            </div>
                            <div className="col-1 align-self-center">
                                {this.state.email?
                                <input type="button" value="Logout" className="btn btn-danger" onClick={this.onLogout}/>
                                :
                                null
                                }
                            </div>
                            <div className="col-2 align-self-center">
                                <span className="d-none d-md-block position-relative">
                                    {this.state.email?
                                    // <Link to='/'>    
                                        <span className='d-none d-md-block'>
                                            <FontAwesomeIcon icon={faUser}/>
                                        </span>
                                    // </Link>
                                    :
                                        <span className='d-none d-md-block' onClick={() => this.setState({showModal: true})}>
                                            <FontAwesomeIcon icon={faUser}/>
                                        </span>
                                    }
                                </span>
                            </div>
                            <div className="col-1 align-self-center">
                                <span className="d-none d-md-block position-relative">
                                    <Link to='/cart'>                                                   
                                            <FontAwesomeIcon icon={faShoppingCart} />
                                            <div className='text-center' style={{position: 'absolute', top: '-10px', left: '20px', width: '25px', borderRadius: '100%'}}>                                           
                                            {
                                                this.state.email?
                                                    this.state.totalCarts
                                                    :
                                                    0
                                            }
                                            </div>
                                    </Link>
                                </span>
                            </div>
                            <div className="col-2 align-self-center" style={{textAlign:"right"}}>
                                <Link to='/history-transaction'>
                                    History Transaction
                                </Link>
                            </div>
                    </div>
                </div>

                                    {/* MODAL LOGIN */}
                <Modal toggle={() => this.setState({showModal: false})} isOpen={this.state.showModal}>
                    <ModalBody className='px-5 py-5'>
                        <div className='text-center'>
                            <h3>
                                Login Account
                            </h3>
                        </div>
                        <div className='mt-5'>
                            <input type='text' ref='inputLogin' placeholder='Email' className='form form-control' />
                        </div>
                        <div className='my-4'>
                            <span>
                            <input type={this.state.showPassword === false? 'password' : 'text'} ref='inputPasswordLogin' placeholder='Password' className='form form-control'/>
                            </span>
                            <span>
                                <FontAwesomeIcon icon={faEye} onClick={() => this.setState({showPassword: !this.state.showPassword})} />
                            </span>
                        </div>
                        <div>
                            <input type='button' value='Login' className='btn btn-primary w-100' onClick={this.onLogin} />
                        </div>
                        <div className='mt-5 text-center'>
                            <p>
                                Don't have account? <Link to='/register' onClick={() => this.setState({showModal: false})}><span className='font-weight-bold'>Register here.</span></Link>
                            </p>
                        </div>
                    </ModalBody>
                </Modal>


            </div>
        )
    }
}

export default Navbar