import React,{useEffect,useState} from 'react'
import '../../css/news.css'

function FashionNews() {
    const [data,setData] = useState([])
    useEffect(()=>{
        const url = 'https://bing-news-search1.p.rapidapi.com/news?safeSearch=Off&textFormat=Raw'
        fetch(url,{
            method: 'GET',
            headers: {
                'content-type': 'application/octet-stream',
		'X-BingApis-SDK': 'true',
		'X-RapidAPI-Key': '7b795728f8msh7631e808afa8f3ap19c2b1jsn07218e9f35dc',
		'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
            }

        })
        .then(res=> res.json())
        .then(data =>{
           
            setData(data.value)
        })
        .catch(err=>{
            console.log(err)
        })
    },[])

    return (
        <>
            {data?data.map((e,index)=>{
            
                return(
                    <div key ={index} className="card container">
                        <div className="img-card"><img src={e.image.thumbnail.contentUrl} alt="" className="myImg"></img></div>
                        <div className="section2">
                            <div className="title-card"><a href={e.url} target='_blank' className="link-card">{e.name}</a></div>
                            <div className="source-card">
                                <span className="date-card">{e.datePublished}</span>
                                <span className="author-card">{e.author}</span>
                                <span className="author-card"> <b>Source:</b>{e.provider.name}</span>
                                <span className="author-card"> <b>Site:</b>{e.provider._type}</span>
                               
                            </div>
                            <div className="content-card">{e.description}</div>

                        </div>
                    </div>
                )
            })
            :<h1>Wait....</h1>}
        </>
        
        
    )
}

export default FashionNews