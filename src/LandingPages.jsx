import react from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

class LandingPages extends react.Component{

    state = {
        dataBackupProducts: null,
        dataProducts: null,
        showModal: false,
    }

    componentDidMount(){
        this.getDataProducts()
    }

    getDataProducts = () => {
        axios.get('http://localhost:5000/products')
        .then((res) => {
            this.setState({dataProducts: res.data, dataBackupProducts: res.data})
        })
        .catch((err) => {
            console.log(err)
        })
    }


    render(){
        return(
            <>
                <div className="container" style={{height: '100%'}}>
                    <div className="row">
                        {
                            this.state.dataProducts?
                                this.state.dataProducts.map((value, index) => {
                                    return(
                                        <>
                                            <div className="col-4 px-3 py-3" key={index}>
                                                <Link to={`/detail-product/${value.id}`}>
                                                    <img src={value.img} className="border border-dark" style={{borderRadius:"20px"}} width='100%' height='150px' />
                                                </Link>
                                                <div style={{textAlign:"center"}}>
                                                    <h5>
                                                        {value.name}
                                                    </h5>
                                                </div>
                                                <div>
                                                    <h5>
                                                        Rp.{value.price.toLocaleString()}
                                                    </h5>
                                                    <p>
                                                        Stock: {value.stock} item
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
                            :
                                null
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default LandingPages