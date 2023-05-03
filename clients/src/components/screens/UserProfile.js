import React,{useEffect,useState,useContext} from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
const ProfilePage =()=>{
    const [userProfile,setProfile] = useState(null)
    
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setshowfollow]= useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("token")
            }
        }).then(res=>res.json())
        .then(data=>{
           setProfile(data)
        })
    },[])

    const followUser = ()=>{
        fetch('/follow',{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer '+ localStorage.getItem('token')
            },
            body:JSON.stringify({
                followId:userid
            })
        })
        .then(res=>res.json())
        .then(data=>{
           dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
           localStorage.setItem("user",JSON.stringify(data))
           setProfile((prevState)=>{
            return{
                ...prevState,
                user:{
                    ...prevState.user,
                    followers:[...prevState.user.followers,data._id]
                }
            }
           })
           setshowfollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer '+ localStorage.getItem('token')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        })
        .then(res=>res.json())
        .then(data=>{
            
           dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
           localStorage.setItem("user",JSON.stringify(data))
           setProfile((prevState)=>{
            const newfollower = prevState.user.followers.filter(item=>item != data._id)
            return{
                ...prevState,
                user:{
                    ...prevState.user,
                    followers: newfollower
                }
            }
           })
           setshowfollow(true)
        })
    }

    return (
        <>
        {userProfile ? 
        <div style={{maxWidth:"950px",margin:"100px auto 0 auto"}}>
            <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    borderBottom:"1px solid black"
                }}>
                <div>
                    <img style= {{width:"200px",height:"200px",borderRadius:"50%"}}src={userProfile.user.pic} />
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    width: "110%"
                }}>
                        <h6>{userProfile.posts.length} posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        
                        <h6>{userProfile.user.following.length} following</h6>
                    </div>
                    {showfollow?<button className="btn waves-effect waves-light div pink darken-4" onClick={()=>followUser()}>follow</button>:<button className="btn waves-effect waves-light div pink darken-4" onClick={()=>unfollowUser()}>unfollow</button>}
                    
                    
                </div>
            </div>
            <div className='gallery'>
                {
                    userProfile.posts.map(item =>{
                        return(
                           
                            <img key={item._id} className='profile-item' src={item.photo} alt={item.title}/>

                        )
                    })
                }
                
            </div>
        </div>
        
        
        :<h2>
            <div className="progress">
                <div className="indeterminate #880e4f pink darken-4"></div>
            </div>
        </h2>}
        
        </>
    )
}

export default ProfilePage