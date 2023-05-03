import React,{useEffect,useState,useContext,useRef} from 'react'
import { UserContext } from '../../App'
import M from 'materialize-css'

const ProfilePage =()=>{
    const [mypics,setPics] = useState([])
    const [image,setImage] = useState(undefined)
    
    const updateModal = useRef(null)
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        M.Modal.init(updateModal.current)
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("token")
            }
        }).then(res=>res.json())
        .then(data=>{

            setPics(data.myposts)
        })
    },[])

    useEffect(()=>{
        if(image){
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
            .then(data => {
                localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                dispatch({type:"UPDATEPIC",payload:data.url})
                // updating the url in the database
                fetch("/updatepic",{
                    method:"put",
                    headers:{
                        "Content-type":"application/json",
                        "Authorization":"Bearer "+ localStorage.getItem("token")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                })
                .then(res=>res.json())
                .then(result=>{
                    console.log(result)
                })
            })
            .catch(err => console.log(err))
        }
    },[image])

    const updatePhoto = (file)=>{
        M.Modal.getInstance(updateModal.current).close()
        setImage(file)
        
    }

    const initModal = ()=>{
        const modal = document.querySelector('.modal');
        M.Modal.init(modal)
    }

   
    return (

        <>
        <div style={{maxWidth:"950px",margin:"100px auto 0 auto"}}>
            <div style={{
                    display:"flex",
                    justifyContent:"flex-start",
                    margin:"18px 0px",
                    borderBottom:"1px solid black"
                }}>
                   
                <div>
                    <a data-target="modal1" className='modal-trigger update-modal'><img  className='profile-pic' src={state?state.pic:"Loading...."} /></a>
                    <div className="file-field input-field">
                        
                    </div>
                </div>
                <div id='modal1' className='modal' ref={updateModal}>
                        <div className="modal-content">
                            <h1>Update Pic</h1>
                            <div >
                                <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
                            </div>
                            
                            <div className="modal-footer">
                                <button  className="modal-close waves-effect waves-green btn-flat">close</button>
                            </div>
                        </div>
                    </div>
                <div>
                    <h4>{state?state.name:"Loading...."}</h4>
                    <h5>{state?state.email:"Loading...."}</h5>
                    <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    width: "110%"
                }}>
                   
                        <h6>{mypics.length} posts</h6>
                        <h6>{state? state.followers.length: "Loading...."} followers</h6>
                        <h6>{state? state.following.length : "Loading...."} following</h6>
                    </div>
                </div>
            </div>
            <div className='gallery'>
                {
                    mypics.map(item =>{
                        return(
                           
                            <img key={item._id} className='profile-item' src={item.photo} alt={item.title}/>

                        )
                    })
                }
                
            </div>
        </div>

       
       
        
        </>
    )
}

export default ProfilePage