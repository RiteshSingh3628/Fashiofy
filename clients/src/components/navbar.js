import React,{useContext,useEffect,useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'


const NavBar = ()=>{
    
    const {state,dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    const [search,setSearch] = useState('')
    const [userdetails,setUserDetails] = useState([])

  

    const initModal = ()=>{
        const modal = document.querySelector('.modal');
        M.Modal.init(modal)
    }
    
    useEffect(() => {
        initModal();
        const sidenav = document.querySelector('.sidenav');
        M.Sidenav.init(sidenav);
       
        
    }, []);
    

    const renderList = ()=>{
        if(state){
            
            return [
                
    
                <li key="2"><a href="#searchModal" className="modal-trigger"> <i className="material-icons ">search</i></a></li>,
                <li key="3"><a href="/create"> <i className="material-icons">add_circle_outline</i></a></li>,
                <li key="4"><a href="/news"> <i className="material-icons">import_contacts</i></a></li>,
                <li key="5"><a href="/explore"><i className="material-icons">explore</i></a></li>,
                <li key="6"><a href="/write"><i className="material-icons">description</i></a></li>,
                <li key="7"><a href="/blogs">Blogs</a></li>,
                <li key="8"><a href="/account"><i className="material-icons">person_outline</i></a></li>,
                <li key="1">
                    <button className="btn waves-effect waves-light div #01579b light-blue darken-4" onClick={()=>{
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        navigate('/signin')

                    }}>LogOut</button>
                </li>
            ]
        }else{
            return[
                <>
                <li key="9"><Link to={"/signin"}>SignIn</Link></li>
                <li key="10"><Link  to={"/signup"}>SignUp</Link></li>
                </>
            ]
        }
    }


    // fire this functiopn when user is searching for an user
    const fetchUsers=(query)=>{
        setSearch(query)
        fetch('/serach-users',{
            method:'post',
            headers:{
                "Content-Type":"application/Json"
            },
            body:JSON.stringify({
                query:query
            })
        })
        .then(res=> res.json())
        .then(result=>{
            
            setUserDetails(result.user)
        })
    }
    return(
        <nav>
            <div className="nav-wrapper blue">
                <Link to={state?"/":"/signin"} className="brand-logo "><img src="/Images/Picsart_23-04-28_16-30-33-955.jpg" alt=""  height={65}/></Link>
                <a href="#!" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                <ul  className="right hide-on-med-and-down">
                    {renderList()}
                </ul>
            </div>
            <ul className="sidenav" id="mobile-demo" >
                    {renderList()}
            </ul>
            {/* modal for search bar */}
            <div id="searchModal" className="modal" style={{color:"black"}}>
                <div className="modal-content">
                    <input type="text" placeholder = "serach users" value= {search} onChange={(e)=>fetchUsers(e.target.value)} />
                    <ul className="collection" style={{color:"black",}}>
                        {
                        userdetails.map(item=>{
                            return(
                                <Link to= {item._id !== state._id?"/profile/"+item._id:'/account'} onClick={()=>{
                                    M.Modal.getInstance("searchModel.currernt").close()
                                }}>
                                <li key={item._id} className='collection-item'>
                                    <span><img src={item.pic} alt="user-profile" width={50} height={50} style={{borderRadius:"50%",objectFit:"contain"} }/></span>
                                    <span style={{color:"black"}}>{item.email}</span>
                                    <div style={{color:"black"}}>{item.name}</div>
                                </li>
                                </Link>
                            )

                        })
                        }
                    </ul>
                </div>
                <div className="modal-footer">
                    <button  className="modal-close waves-effect waves-green btn-flat">Search</button>
                </div>
            </div>
        </nav>
    )
}





export default NavBar