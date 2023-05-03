import React,{useState,useEffect} from 'react'
import { Link,useNavigate} from 'react-router-dom'
import M from 'materialize-css'
const SignUpPage =()=>{
    const navigate =useNavigate()
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [image,setImage] = useState("")
    const [imageUrl,setImageUrl] = useState(undefined)

    // This useEffect is upladinfg the fields once the image is uploaded successfully
    useEffect(() => {
      if(imageUrl){
        uploadFields()
      }
    }, [imageUrl])
    



    // Function to uplaod the profile pic to the cloudinary
    const uploadPic = ()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","vogueTrends")
        data.append("cloud_name","dxsj0txnx")

        console.log("fetching data...............")
        fetch("https://api.cloudinary.com/v1_1/dxsj0txnx/image/upload",{
            method:"post",
            body:data
        })
        .then(resp => resp.json())
        .then(data => {setImageUrl(data.url)})
        .catch(err => console.log(err))
       
    }



    const uploadFields =()=>{
        // email validation checking
        var mailformat = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        if(!mailformat.test(email))
        {
            M.toast({html: "Invalid email address", classes: 'rounded #b71c1c red darken-4'});
        }
 
 
 
        fetch("/signup",{
            method:"post",
            headers:{
                "content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,
                password:password,
                email:email,
                pic:imageUrl
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes: 'rounded #b71c1c red darken-4'});
            }
            else{
                M.toast({html:data.message, classes:'#00c853 green accent-4'})
                navigate("/signin")
            }
        })
        .catch((err)=>{console.log(err)})
    }




    //function to post data in the data base  
    const PostData = () =>{

        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
       
    }










    return (
       <div className='Login-card'>
            <div className='img-con'></div>
            <div className='login-con'>
                <h3>SignUp</h3>
                <div className='lebel'>Username</div>
                <input  type= "text" placeholder='username' value={name}  onChange={(e)=>setName(e.target.value)}/>
                <div className='lebel'>email</div>
                <input  type= "text" placeholder='ex:samual@gmail.com' value={email} onChange={(e)=>setEmail(e.target.value)} />
                <div className='lebel'>Password</div>
                <input type= "password" placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)} />
               
                
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload ProfilePic</span>
                        <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="Upload one or more files"   />
                    </div>
                    <button className="btn waves-effect waves-light div pink darken-4" onClick={()=>PostData()}>SignUp</button>
                </div>
                <Link style={{color:"black",padding:10}} to= "/Signin">Already have an account?</Link>
            </div>
         </div>
    )
}

export default SignUpPage