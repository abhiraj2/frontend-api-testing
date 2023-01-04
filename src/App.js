import React, {useEffect} from 'react';
import logo from './logo.svg';
import {useSelector, useDispatch} from 'react-redux';
import { setSize, addAllData, addSingleData } from './features/userData/userDataSlice';
import './App.css';


const base_url = "https://reqres.in/api/"
const all_users = "users?page=2"
const single_user = "users/"

function Card(props){
  let isSelected = props.isSelected
  let singleData = props.singleData
  return(
    <div id='display_area'>
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
    fetch(base_url+all_users)
      .then((res)=> res.json())
      .then((jso)=> jso.data)
      .then((data)=> dispatch(addAllData(data)))
      .catch((err)=>console.error(err))
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
    </div>
  );
}

export default App;
