import React,{useEffect,createContext,useReducer,useContext} from 'react'
import NavBar from './components/navbar'
import './App.css'
import {BrowserRouter,Routes,Route,useNavigate} from 'react-router-dom';
import Explore from './components/screens/Explore';
import ProfilePage from './components/screens/Profile';
import SignUpPage from './components/screens/Signup';
import LoginPage from './components/screens/Login';
import CreatePost from './components/screens/createPost';
import UserProfile from './components/screens/UserProfile';
import {reducer,initialState} from './reducers/userReducer'
import SubPost from './components/screens/SubPost';
import FashionNews from './components/screens/FashionNews';
import Write from './components/screens/Write';
import Allblogs from './components/screens/Allblogs';
export const UserContext = createContext()


const Routing = ()=>{
  const navigate = useNavigate()
  const {state,dispatch} = useContext(UserContext)
  
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }
    else{
      navigate('/signin')
    }
  },[])
  return (
      <Routes>
          <Route path="/" element = {<SubPost/>} />        
          <Route path="/signin" element = {<LoginPage/>} />        
          <Route path="/signup" element = {<SignUpPage/>} />        
          <Route exact path="/account" element = {<ProfilePage/>} />        
          <Route path="/create" element = {<CreatePost/>} />        
          <Route path="/profile/:userid" element = {<UserProfile/>} />        
          <Route path="/explore" element = {<Explore/>} />        
          <Route path="/news" element = {<FashionNews/>} />        
          <Route path="/write" element = {<Write/>} />        
          <Route path="/blogs" element = {<Allblogs/>} />        
      </Routes>

  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value = {{state:state,dispatch:dispatch}}>
      <BrowserRouter>
        <NavBar/>  
        <Routing/>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
