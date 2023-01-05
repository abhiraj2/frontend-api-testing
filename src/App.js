import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {addAllData, addSingleData } from './features/userData/userDataSlice';
import {ProgressBar} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css';


const base_url = "https://reqres.in/api/"
const all_users = "users?page=2"
const single_user = "users/"

function Card(props){
  let isSelected = props.isSelected
  let singleData = props.singleData
  return(
    <div id='card'>
        <div id='userAvatar'>
          {(isSelected)?(<img alt={"User Avatar"} src={singleData.avatar}></img>):"Placeholder"}
        </div>
        <div id='userName'>
          {(isSelected)?(singleData.first_name + " " + singleData.last_name):"Placeholder"}
        </div>
        <div id='email'>
          {(isSelected)?(singleData.email):"Click on any button below"}
        </div>
      </div>
  )
}


function App() {
  //const allData = useSelector((state)=> state.userData.allData)
  const size = useSelector((state)=>state.userData.size)
  const singleData = useSelector((state)=>state.userData.singleData)
  const dispatch = useDispatch();

  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  let fun = async (url, all_or_single) => {
    let res1 = await fetch(url);
    //const totalLength = res.headers.get("content-length");
    /*Since the header doesn't have a content-length field I had to do a little hack here for calculating the total response size*/
    const reader2 = res1.body.getReader();
    let totalLength = 0;
    while(true){
      const {done, value} = await reader2.read();
      if(done){
        break;
      }
      totalLength += value.length
    }
  
    let res2 = await fetch(url);
    const reader = res2.body.getReader();
  
    let receivedLength = 0;
    let data = []
    let completed = false;
    while(!completed){
      const {done, value} = await reader.read();
      completed = done;
      if(!completed){
        receivedLength += value.length
        console.log(receivedLength,totalLength)
        setProgress(Math.floor((receivedLength/totalLength)*100))
        data.push(value);
      }
  
    }
    let allData = new Uint8Array(receivedLength)
    //console.log(progress)
    let pos = 0;
    for(let chunk of data){
      allData.set(chunk, pos);
      pos+=chunk.length;
    }
    let str = new TextDecoder("utf-8").decode(allData);
    let jso = JSON.parse(str)
    dispatch(all_or_single(jso.data))
  }

  useEffect(()=>{
    fun(base_url+all_users, addAllData)
  }, [])

  useEffect(()=>{
    if(progress===100){
      setTimeout(()=>{
        setProgress(0)
        setLoaded(true)
      }, 500)
    }
  })
  let isSelected = Object.keys(singleData).length!==0

  let handleClick = (ev) => {
    let url = base_url + single_user + ev.target.id
    setLoaded(false)
    fun(url, addSingleData)
  }

  return (
    <div className='App'>
      <Card isSelected={isSelected} singleData={singleData}></Card>
      <div id="buttons">
        {
          [...Array(size).keys()].map(ele=>ele+1).map((ele, idx) => <button id={ele} key={idx} onClick={handleClick}>{ele}</button>)
        }
      </div>
      <div id="progressIndicator">
        {loaded?("Item Loaded"):(<ProgressBar now={progress}></ProgressBar>)}
      </div>
    </div>
  );
}

export default App;
