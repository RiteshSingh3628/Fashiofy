import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from 'react-router-dom'
import '../../css/write.css'
import M from 'materialize-css'


function Write() {
  const navigate =useNavigate()
  const [value,setValue] = useState('')
  const [title,setTitle] = useState('')
  const [image,setImage] = useState('')
  const [body,setBody] = useState('')
  const[imgUrl,setImgUrl] = useState("")

  function isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
  }



  useEffect(()=>{
    if(imgUrl){
      fetch("/addblog",{
        method:"post",
        headers:{
          "content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body:JSON.stringify({
          title:title,
          body:value,
          img:imgUrl
        })
      })
      .then((resp)=>resp.json())
      .then((data)=>{
        if(data.error){
          M.toast({html: data.error, classes: 'rounded #b71c1c red darken-4'});
        }
        else{
  
            M.toast({html:"Created post successfully", classes:'#00c853 green accent-4'})
            navigate("/")
        }
      })

    }
  })

  const postDetails =()=>{
    const data = new FormData()
    if(isFileImage(image)){
      data.append("file",image)
      data.append("upload_preset","vogueTrends")
      data.append("cloud_name","dxsj0txnx")

      console.log("posting data...............")
      console.log(value)
      fetch("https://api.cloudinary.com/v1_1/dxsj0txnx/image/upload",{
          method:"post",
          body:data
      })
      .then(resp => resp.json()).then(data => {setImgUrl(data.url)})
      .catch(err =>{
          console.log(err)
      })
  }else{
      return (M.toast({html: 'File is not an image', classes: 'rounded #b71c1c red darken-4'}))
  }

  }
  
  return (
    <div className='add card'>
      <div className="content">
        <input  type="text" placeholder='Title of blog' value = {title} onChange={(e)=> setTitle(e.target.value)} />
        <div className="editorContainer">
          <ReactQuill className='editor' theme='snow' value={value} onChange={setValue}></ReactQuill>
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h3>Publish</h3>
          <span><b>Status:</b>Draft</span>
          <span><b>Visibility:</b>Public</span>
          <input style={{display:"none"}} type="file" id='file' onChange={(e)=>setImage(e.target.files[0])} />
          <label htmlFor="file" >Upload File</label>
          <div className="buttons">
            <button>Save as draft</button>
            <button onClick={()=>postDetails()} >Update</button>
          </div>
        </div>
        <div className="item">
          <h3>Category</h3>
          <input type="radio" name='cat' value = "art"/>
          <label htmlFor="art">Art</label>
          <input type="radio"  name='cat' value = "Food"/>
          <label htmlFor="Food">Food</label>
          <input type="radio"  name='cat' value = "fashion"/>
          <label htmlFor="cashion">Fashion</label>
          <input type="radio"  name='cat' value = "clothes"/>
          <label htmlFor="clothes">Clothes</label>
          <input type="radio"  name='cat' value = "technology"/>
          <label htmlFor="technology">Technology</label>
        </div>
      </div>

    </div>
  )
}

export default Write