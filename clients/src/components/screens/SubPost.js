import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import { Link } from 'react-router-dom'
import  '../../css/homeCard.css'


const SubPost =()=>{

    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch("/followedposts",{
            method:"get",
            headers:{
                "Content-Type":"application/json",
                
                "Authorization":"Bearer "+localStorage.getItem("token")
            }
        }).then((resp)=>
        resp.json()
        ).then((data)=>{
            setData(data.posts)
            
        }) 
    },[])

    const likePost = (id)=>{
        const likeBtn = document.querySelector(".like-bttn");
        likeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            likeBtn.classList.add("animate");
            setTimeout(() => {
            likeBtn.classList.remove("animate");
            }, 1000);
        });
        fetch('/like',{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("token")
            },
            body:JSON.stringify({postId:id})
        }).then((resp)=>
        resp.json()
        ).then((result)=>{
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }


    const UnlikePost = (id)=>{
        const likeBtn = document.querySelector(".like-bttn");
        likeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            likeBtn.classList.add("animate");
            setTimeout(() => {
            likeBtn.classList.remove("animate");
            }, 1000);
        });
        fetch('/unlike',{
            method:'put',
            headers:{
                "content-Type":"application/json",
                
                "Authorization":"Bearer "+localStorage.getItem("token")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then((resp)=>
        resp.json()
        ).then((result)=>{
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "content-Type":"application/json",
                
                "Authorization":"Bearer "+localStorage.getItem("token")
            },
            body:JSON.stringify({
                postId:postId,
                text:text
            })

        }).then((resp)=>
        resp.json()
        ).then((result)=>{
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const deletePost = (postid)=>{
        fetch(`/deletePost/${postid}`,{
            method:"delete",
            headers:{
                "content-Type":"application/json",

                "Authorization":"Bearer "+localStorage.getItem("token")
            }
        }).then(res=>res.json())
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
    const deleteComment = (postid)=>{
        fetch(`/deleteComment/${postid}`,{
            method:"delete",
            headers:{
                "content-Type":"application/json",

                "Authorization":"Bearer "+localStorage.getItem("token")
            }
        }).then(res=>res.json())
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
        
        <div className='home'>
            {
                data.map(item=>{
                   return(
                                
                    <div key={item._id} className='card home-card'>
                       
                        <div className='image-card'>
                            <img src={item.photo}/>
                        </div>

                        <div className='sub-card'>
                            <h5 className='user-data'>
                                {/* profile pic */}
                                <img src={item.postedBy.pic} alt=""style={{width:"50px",height:"50px" ,borderRadius:"50%",objectFit:"scale-down",margin:"10px"}} />
                                <Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id: "/account"}>{item.postedBy.name}</Link>
                            </h5>

                            {/* card body */}

                            <div className='desc-card'>
                                <h6 className='card-title'>{item.title}</h6>
                                <p className='card-body'>{item.body}</p>
                            </div>

                            <div className='card-content'>
                                {/* <i className="material-icons"style={{color:"red"}}>favorite</i> */}
                                {item.likes.includes(state._id)
                                ?
                                <i className="material-icons like-bttn" onClick={()=>{UnlikePost(item._id)}} style={{color:"#7d2ae8",border:"2px"}}>favorite</i>
                                :
                                <i className="material-icons like-bttn" onClick={()=>{likePost(item._id)}} style={{color:"white",border:"2px"}}>favorite</i>
                                }
                                
                                <h6>{item.likes.length} likes</h6>
                            </div>
                            
                            <form onSubmit = {(e)=>{
                                e.preventDefault()
                                // console.log(e.target)
                                makeComment(e.target[0].value,item._id)
                            }}>
                            <input className='comment-input' type="text" style={{padding:"10px",width:"80%",marginLeft:"20px"}} placeholder='add comment...'/>
                            </form>
                            {/* comments */}

                            <div className='comment-card'>
                            {
                                item.comments.map(record=>{
                                    return(
                                        <div  key = {record._id} className='user-comment'>
                                                <div><img src={record.postedBy.pic} alt=""style={{width:"30px",height:"30px" ,borderRadius:"50%",objectFit:"scale-down",margin:"10px",background:"black"}} /></div>
                                                <h6><span style = {{fontWeight:"900"}}>{record.postedBy.name}</span>
                                                
                                                    {/* {
                                                        record.postedBy._id == state._id
                                                        &&
                                                        <i className="material-icons"style={{fontSize:"18px",cursor:"pointer"}} onClick={()=>deleteComment(item._id)} >delete</i>
                                                    
                                                    } */}
                                                </h6>
                                                <div className='comment-text'>{record.text}</div>
                                        </div>
                                       
                                        
                                    )
                                })
                            }

                            </div>

                            {/* show delete icon in the user posts */}
                            {
                                    item.postedBy._id == state._id
                                    &&
                                    <i className="material-icons delete-btn"style={{float:"right",cursor:"pointer"}} onClick={()=>deletePost(item._id)} >delete</i>
                                   
                            }
                        </div>

                    </div>
                   )
                })
            }
        </div>
    )
       
}

export default SubPost