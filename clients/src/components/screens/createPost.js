import React,{useState,useEffect} from 'react'
import { Link,useNavigate} from 'react-router-dom'
import M from 'materialize-css'
const CreatePost =()=>{
    const navigate =useNavigate()
    const[title,setTitle] = useState("")
    const[body,setBody] = useState("")
    const[image,setImage] = useState("")
    const[imgUrl,setImgUrl] = useState("")
    const [data,setData] = useState(true)

    useEffect(()=>{

        if(imgUrl){
            fetch("/createpost",{
                method:"post",
                headers:{
                    "content-Type":"application/json",
                    
                    "Authorization":"Bearer "+localStorage.getItem("token")
                },
                body:JSON.stringify({
                    title:title,
                    body:body,
                    img:imgUrl
                })
                
            }).then((resp)=>
                resp.json()
            ).then((data)=>{
        
                if(data.error){
                    M.toast({html: data.error, classes: 'rounded #b71c1c red darken-4'});
                }
                else{
                    setData(true)
                    M.toast({html:"Created post successfully", classes:'#00c853 green accent-4'})
                    navigate("/")
                }
            }) 
        }
        
    },[imgUrl])

    function isFileImage(file) {
        return file && file['type'].split('/')[0] === 'image';
    }

    const postDetails = ()=>{
        setData(false)
        const data = new FormData()
        // file is image or not checking
        if(isFileImage(image)){
            data.append("file",image)
            data.append("upload_preset","vogueTrends")
            data.append("cloud_name","dxsj0txnx")

            console.log("posting data...............")
            fetch("https://api.cloudinary.com/v1_1/dxsj0txnx/image/upload",{
                method:"post",
                body:data
            })
            .then(resp => resp.json()).then(data => {setImgUrl(data.url)})
            .catch(err =>{
                console.log(err)
            })
        }else{
            setData(false)
            return (M.toast({html: 'File is not an image', classes: 'rounded #b71c1c red darken-4'}))
        }

        
        

       
    }
    
    return(
        <>
        {
            data?<div className='post-card2'>
            <h4>Post Content</h4>
            <input type="text" placeholder='title' value={title} onChange={(e)=>setTitle(e.target.value)} />
            <input type="text" placeholder='body' value={body} onChange={(e)=>setBody(e.target.value)} />
            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload image for post"   />
                </div>
            </div>
            <button className="btn waves-effect waves-light div pink darken-4" onClick={()=>postDetails()} >Post</button>
        </div>
        
        :<h2>
            <div className="progress">
                <div className="indeterminate #880e4f pink darken-4"></div>
            </div>
        </h2>
        }
        </>
        
    )
}

export default CreatePost