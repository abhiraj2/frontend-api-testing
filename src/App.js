import React, {useEffect} from 'react';
import logo from './logo.svg';
import {useSelector, useDispatch} from 'react-redux';
import { setSize, addAllData, addSingleData } from './features/userData/userDataSlice';
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
          {(isSelected)?(<img src={singleData.avatar}></img>):"Placeholder"}
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
  const allData = useSelector((state)=> state.userData.allData)
  const size = useSelector((state)=>state.userData.size)
  const singleData = useSelector((state)=>state.userData.singleData)
  const dispatch = useDispatch();

  useEffect(()=>{
    let fun = async () => {
      let res = await fetch(base_url+all_users);
      const reader = res.body.getReader();
      const totalLength = res.headers.get("Content-Length");
      
      let receivedLength = 0;
      let data = []
      let completed = false;
      while(!completed){
        const {done, value} = await reader.read();
        completed = done;
        if(!completed){
          receivedLength += value.length
          data.push(value);
        }

      }
      let allData = new Uint8Array(receivedLength)
      console.log(data)
      let pos = 0;
      for(let chunk of data){
        allData.set(chunk, pos);
        pos+=chunk.length;
      }
      let str = new TextDecoder("utf-8").decode(allData);
      let jso = JSON.parse(str)
      dispatch(addAllData(jso.data))
    }
    fun()
  }, [])
  let isSelected = Object.keys(singleData).length!=0

  let handleClick = (ev) => {
    let url = base_url + single_user + ev.target.id
    fetch(url)
      .then(res=>res.json())
      .then((jso)=> jso.data)
      .then((data)=>dispatch(addSingleData(data)))
      .catch((err)=>console.error(err))
  }

  return (
    <div className='App'>
      <Card isSelected={isSelected} singleData={singleData}></Card>
      <div id="buttons">
        {
          [...Array(size).keys()].map(ele=>ele+1).map((ele, idx) => <button id={ele} key={idx} onClick={handleClick}>{ele}</button>)
        }
      </div>
      <div className='progressBar'>
        <ProgressBar now={55}/>
      </div>
    </div>
  );
}

export default App;
