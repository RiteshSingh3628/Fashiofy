import React,{useEffect,useState,useContext} from 'react'
import DOMPurify from "dompurify";
import { Link } from 'react-router-dom'
import '../../css/allblogs.css'
import {UserContext} from '../../App'
import M from 'materialize-css';

function Allblogs() {
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [showPopup, setShowPopup] = useState(false);

    const getText = (htmlText)=>{
        const doc = new DOMParser().parseFromString(htmlText,"text/html")
        return doc.body.textContent
    }
    useEffect(()=>{
        
        fetch("/allblogs",{
            method:"get",
            headers:{
                "Content-Type":"application/json",
                
                "Authorization":"Bearer "+localStorage.getItem("token")
            }
        }).then((resp)=>
        resp.json()
        ).then((data)=>{
            setData(data.post)
            
        }) 
    },[])

    const togglePopup = () => {
          setShowPopup(!showPopup);
    }
      
    const deleteBlog =(blogid)=>{
        fetch(`/deleteBlog/${blogid}`,{
            method:'delete',
            headers:{
                "content-Type":"application/json",

                "Authorization":"Bearer "+localStorage.getItem("token")
            }
        })
        .then(res=>res.json())
            .then(result=>{
                const newData = data.filter(item=>{
                    return item._id !== result._id
                })
                setData(newData)
            })
            .catch(err=>{
                console.log(err)
            })
    }
    return (
        <div className='content-body'>
            {
                
                data.map(item=>{
                    return(
                        
                       <div className='each-element' key={item._id}>
                            <div className='user-data' style={{position:'relative'}}>
                                <img src={item.postedBy.pic} alt="" />
                                
                                <Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id: "/account"}>{item.postedBy.name}</Link>
                                <span>
                                {
                                    item.postedBy._id == state._id
                                    &&
                                    <div>
                                        <i className="material-icons" style={{cursor:"pointer",position:'absolute', right:'0px', top:'0px'}}  onClick={togglePopup}>expand_more</i>
                                        {showPopup && (
                                        <div className="popup">
                                            <i className="material-icons"style={{cursor:"pointer", position:'absolute',right:'0px'}} onClick={()=>deleteBlog(item._id)} >delete</i>
                                        </div>
                                        )}
                                    </div>
                                }
                                </span>
                                
                            </div>
                            {/* delete button */}
                            
                            <div className="content">
                                <h1 className="blog-title">{item.title}</h1>
                                
                            </div>
                            <div className="img-cont"><img src={item.photo} alt="" /></div>
                            
                            <p  className="blog-body" dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(item.body)}}>                            
                            </p>
                            <hr />
                       </div>
                       
                        
                    )
                })
            }
        </div>
    )
}

export default Allblogs