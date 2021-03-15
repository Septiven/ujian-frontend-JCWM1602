import react from 'react'
import Navbar from './Navbar'
import Register from './Register'
import LandingPages from './LandingPages'
import DetailProduct from './DetailProduct'
import Cart from './Cart'
import Checkout from './Checkout'
import TransactionHistory from './HistoryTransaction'
import { BrowserRouter, Switch ,Route } from 'react-router-dom'

class App extends react.Component{
  render(){
    return(
      <div>
        <BrowserRouter>
          <Navbar/>
            <Switch>
              <Route exact path='/' component={LandingPages} />
              <Route path='/register' component={Register}/>
              <Route path='/detail-product/:idProduct' component={DetailProduct} />
              <Route path='/cart' component={Cart} />
              <Route path='/checkout' component={Checkout} />
              <Route path='/history-transaction' component={TransactionHistory}/>
            </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;
