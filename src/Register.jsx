import React from 'react';
import Axios from 'axios';

export default class Register extends React.Component{ 

    state = {
        error: null,
        email: null,
        password: null,
        buttonDisabled: true
    }

    componentDidMount(){
        this.onCheckUserLogin()
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

        let result = checkUserLogin(id)

        this.setState({isUserLogin: result})

        if(result === true){
            window.location = '/'
        }
    }

    submitRegister = () => {
        let inputEmail = this.refs.inputUser.value
        let inputPassword = this.refs.inputpassword.value

        // FUNCTION EMAIL VALIDATOR
        function EmailValidator(inputEmail){

            let emailSplit = inputEmail.split('@')
        
            if(emailSplit.length !== 2) return 'email tidak sesuai'
            let emailName = emailSplit[0]
            if(emailName.length<6){
                return 'Nama user email minimal 6 karakter'
            }

            let hostingEmail = emailSplit[1]
        
            let hostingEmailSplit = hostingEmail.split('.')
            console.log(hostingEmailSplit)
        
            if(hostingEmailSplit.length <= 1) return 'email tidak sesuai'
            for(let i = 0; i < hostingEmailSplit.length; i++){
                if(hostingEmailSplit[i] === '' || hostingEmailSplit[i] === ' '){
                    return 'email tidak sesuai'
                }
            }
        
            return true
        }

        // FUNCTION PASSWORD VALIDATION
        function PasswordValidation(inputPassword){
            if(inputPassword.length<6){
                return 'Password minimal 6 Karakter'
            }
            return true
        }

        if(inputEmail){ 
            if(inputEmail){
                let resultEmailValidator = EmailValidator(inputEmail)
                let resultPasswordValidator = PasswordValidation(inputPassword)
    
                if(resultEmailValidator !== true){
                    this.setState({error: resultEmailValidator})
                }else if(resultPasswordValidator !== true){
                    this.setState({error: resultPasswordValidator})
                }else{
                    this.setState({error: null, email: inputEmail, password: inputPassword})
                }
            }
        }else{
            this.setState({error: 'Isi Semua Data'})
        }
    }

    sendDataToAPI = () => {
        if(this.state.email !== null){
             // Apabila state email ada
             Axios.get(`http://localhost:5000/users` + '?email=' + this.state.email)
             .then((res) => {
                 if(res.data.length === 1){
                     this.setState({error: 'Email Sudah Terdaftar'})
                 }else{
                    Axios.post(`http://localhost:5000/users`, {email: this.state.email,password: this.state.password})
                    .then((res) => {
                        console.log(res)
                    
                        let id = res.data.id
                        localStorage.setItem('id', res.data.id)
                        window.location='/'
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
    }

    render(){
        return(
            <div className='container'>
                <div className='row justify-content-center align-items-center' style={{height: '500px'}}>
                    <div className="col-10 px-5 pt-5 pb-5 border">
                        <h1>
                            Register
                        </h1>
                        <input type='text' ref='inputUser' placeholder='Enter your email' className='form form-control' onChange={this.submitRegister} />
                        <input type='password' ref='inputpassword' placeholder='Enter your password' className='form form-control my-2' onChange={this.submitRegister} />
                        <p className='text-warning'>
                            {
                                this.state.error?
                                    this.state.error
                                :
                                    null
                            }
                        </p>
                        <input type='button' value='Register Account' className='btn btn-primary w-100 mt-3' onClick={this.sendDataToAPI} />
                    </div>
                </div>
            </div>
        )
    }
}