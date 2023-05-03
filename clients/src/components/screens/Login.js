
import React,{useState,useContext} from 'react'
import { Link,useNavigate} from 'react-router-dom'
import {UserContext} from "../../App"
import M from 'materialize-css'


const LoginPage =()=>{
    const {state,dispatch} = useContext(UserContext)
    const navigate =useNavigate()
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")

    const PostData = () =>{
        fetch("/signin",{
            method:"post",
            headers:{
                "content-Type":"application/json"
            },
            body:JSON.stringify({
                password:password,
                email:email
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes: 'rounded #b71c1c red darken-4'});
            }
            else{
                localStorage.setItem("token",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"signIn Successful", classes:'#00c853 green accent-4'})
                navigate("/")
            }
        })
        .catch((err)=>{console.log(err)})

    }

    return (
       <div className='Login-card'>
            <div className='img-con'></div>
            <div className='login-con'>
                <h3>SignIn</h3>
                <div className='lebel'>email</div>
                <input  type= "text" placeholder='ex:samual@gmail.com' value={email} onChange={(e)=>setEmail(e.target.value)} />
                <div className='lebel'>Password</div>
                <input type= "password" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)} />
                <button className="btn waves-effect waves-light div pink darken-4" onClick={()=>PostData()}>LogIn</button>
                <Link style={{color:"black",padding:10}} to= "/Signup">Create an account?</Link>
            </div>
         </div>
    )
}

export default LoginPage