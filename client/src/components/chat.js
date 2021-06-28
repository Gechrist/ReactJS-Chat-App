import React, {useState,useEffect,useCallback} from 'react';
import socket from '../context/socket.js';
import {Link} from 'react-router-dom';
import { VscAccount } from "react-icons/vsc";
import emoji_icon from '../img/emoji-icon.png';
import { IoIosCloseCircleOutline } from "react-icons/io";
import {debounce} from 'lodash';
import { IconContext } from "react-icons";
import { useAlert } from 'react-alert'
import Container from 'react-bootstrap/Container';
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from '@emotion/css';
import OutsideClickHandler from 'react-outside-click-handler';
import Picker from 'emoji-picker-react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import TypingIndicator from './typingIndicator.js';
import Message from './message.js';


const Chat = () => {
    const [groupUsers, setGroupUsers] = useState([]);
    const [group, setGroup] = useState('');
    // this socket's user
    const [socketUser, setSocketUser] = useState('');
    //user state used for notification when someone enters and exits the group chat
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([{}]);
    // typing users for the typing indicator
    const [typingUsers, setTypingUsers] = useState([]);
    // typing indicator
    const [typingState, setTypingState] = useState(false);
    // signal user typing
    const signalTyping = useCallback(debounce(() => socket.emit('typing',{socketUser, group}),700),[socketUser, group]);
    // reduce typingUsers array
    const removeTypingUsers = useCallback(debounce(() => {setTypingState(false);setTypingUsers([])},5000),[typingUsers]);
    const [emojipicker,setEmojiPicker] = useState(false);
    const alert = useAlert();
    const exit = () => socket.disconnect();
    //display/hide emoji picker
    const emoji = () => {setEmojiPicker(true)};
    const messageTyping = (event) => setMessage(event.target.value);
    // send message
    const send = () => {if(message){socket.emit('newMessage', {socketUser, message, group});setMessage('')}};
    const onEmojiClick = (event, emojiObject) => {setMessage(message + emojiObject.emoji)};

    const ROOT_CSS = css({
        height:'80vh',
        width: '100%'
        });

    useEffect(() => {

          // typing listener
          socket.on('typingEvent', (socketUser) => {if(!typingUsers.includes(socketUser)){setTypingState(typingState => true);
            setTypingUsers([...typingUsers,socketUser]);removeTypingUsers()}});

          return ()=>{

            socket.off('typingEvent');
            }

        },[typingUsers, removeTypingUsers]);

    useEffect(() => {

        // get messages for new user
        socket.on('groupMessages', (messages) => {setMessages([...messages])});

        return ()=>{

          socket.off('groupMessages');
        }

    },[])

    useEffect(() => {

          // get this socket's user
          socket.on('socketUser', (username) => {setSocketUser((socketUser) => username)});

          return () => {
            socket.off('socketUser');
          }

        },[socketUser]);

    useEffect(() => {

       // get group name and users
      socket.on('users',(users) => {setGroup(users[0].group);setGroupUsers([...users])});

      return () => {
        socket.off('users');
     }
   },[groupUsers]);

    useEffect(()=> {

      // new group user notification
      socket.on('newUser',(user) => {setUser(user); alert.show(`${user} has joined the group`)});
      // user has left the group notification
      socket.on('userLeft',(user) => {setUser(user); alert.show(`${user} has left the group`)});

      return () => {
        socket.off('newUser');
        socket.off('userLeft');

      }
    },[user, alert]);


    useEffect(()=> {

      //get new message and add them to the messages array
      socket.on('newMessageEvent',(messages) => {setTypingState(typingState => typingState = false);setMessages([...messages])});

      return () => {
        socket.off('newMessageEvent');
     }
   },[]);

      return(
            <div className="d-flex align-items-center min-vh-100 col-sm-12 col-md-6 offset-md-3" style={{backgroundColor:"lightGrey"}}>
              <Container fluid>
                <Row className='justify-content-between' style={{backgroundColor:"black", color:"white", borderRadius:"3px 3px"}}>
                  <h2 className='pl-2'>{group}</h2>
                  <Link onClick={exit} to='/'>
                    <IconContext.Provider value={{ size:'2em'}}>
                      <button style={{backgroundColor:'black', color:'white', borderColor:'black'}}><IoIosCloseCircleOutline/></button>
                    </IconContext.Provider>
                  </Link>
                </Row>
                <Row style={{height:"80vh"}} className="justify-content-center">
                  <div className='w-25'  style={{backgroundColor:"white", borderRight:"solid 1px lightGrey"}}>
                    <ListGroup style={{backgroundColor:"white"}}>
                        {groupUsers.map((user,i) => (user.id === socket.id?<div className='pl-2 pt-2 pr-2'
                        style={{overflowWrap: 'break-word', color:'blue'}} key={i}> {user.username}
                        &nbsp;<VscAccount style={{ color:'blue'}}/></div>:
                        <div className='pl-2 pt-2 pr-2'
                        style={{overflowWrap: 'break-word'}} key={i}> {user.username}
                        &nbsp;<VscAccount/></div>))}
                    </ListGroup>
                    </div>
                  <div className='w-75' style={{backgroundColor:"white"}}>
                    <ScrollToBottom className={ROOT_CSS} debug={false}>
                      {messages.length !== 0 && messages.map((message, i)=> (message.sender === socketUser?
                        <Message key={i} align='my-2 ml-auto mr-2' bc='blue' sender='You' message={message.message}/>:
                        <Message key={i} align='my-2 ml-2' bc='grey' sender={message.sender} message={message.message}/>))}
                        {typingState && <TypingIndicator typists={typingUsers}/>}
                    </ScrollToBottom>
                  </div>
                </Row>
                <Row className="justify-content3center mb-1">
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Type your message"
                    aria-label="User message"
                    aria-describedby="basic-addon2"
                    value= {message}
                    onChange ={event => {messageTyping(event);signalTyping()}}
                    onKeyPress = {event => event.key === 'Enter'? send():null}
                  />
                  <InputGroup.Append>
                    <Button className='bg-white' style={{borderColor:"lightGrey white"}} onClick={emoji}
                    type="button"><img src={emoji_icon} alt="emoji-icon" /></Button>
                    {emojipicker &&
                    <OutsideClickHandler onOutsideClick={() => {setEmojiPicker(false)}}>
                      <Picker native pickerStyle={{position:'absolute', bottom:'2.5em', right:'0', maxWidth:'50%'}}
                      onEmojiClick={onEmojiClick}/>
                    </OutsideClickHandler>}
                    <Button id="basic-addon2" type="button" onClick={send}>Send</Button>
                  </InputGroup.Append>
                  </InputGroup>
                </Row>
              </Container>
            </div>
)}

export default Chat;
