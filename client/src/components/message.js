import React,{useState, useEffect} from 'react';


const Message = (props) => {

const [sender, setSender] = useState ('');
const [message, setMessage] = useState ('');

useEffect (() =>{
  setSender(props.sender);
  setMessage(props.message);
},[props]);

return (

<div className={props.align}  style={{padding:'5px', borderRadius:'5px 5px',
 backgroundColor:props.bc, color:'white', width:'30%', height:'auto'}}>
  <h6 style={{textDecoration:'underline', wordBreak: 'break-word'}}> {sender}: </h6>
  <p style={{padding:'2px', wordBreak: 'break-word'}}> {message} </p>
</div>
)

};

export default Message;
