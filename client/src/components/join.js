import React, {useState} from 'react';
import socket from '../context/socket.js';
import {useHistory} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Join  = () => {
    const [name, setName] = useState('');
    const [group, setGroup] = useState('');
    const [errorName, setErrorName] = useState (null);
    const [errorUserName, setErrorUserName] = useState ('');
    const [errorGroup, setErrorGroup] = useState (false);
    let history = useHistory();
    const announceUser = (event) => {    socket.connect();
socket.emit('connected', {name, group},
    (error) => {if (error){setErrorUserName(error)}else{
    setErrorUserName(''); history.push('/chat')}}
    )};
    const abort = (event) => {setErrorName(true); setErrorGroup(true)}


    return(
      <div className="d-flex align-items-center min-vh-100" style={{backgroundColor:"lightGrey"}}>
       <Container>
          <Row className="justify-content-center mt-3">
            <Form>
            <Row style={{backgroundColor:"black", color:"white", borderRadius:"3px 3px"}} className="justify-content-center mb-1">
              <h2> React Chat </h2>
            </Row>
              <Form.Group controlId="formGroupName">
                <Form.Label>User Name</Form.Label>
                <Form.Control type="text" placeholder="Enter user name" onChange ={(e) => {setName(e.target.value); setErrorName(false)}}/>
                {errorName?<span style={{color:'red'}}>User name is required</span>:null }
                {errorUserName?<span style={{color:'red'}}>{errorUserName}</span>:null }
              </Form.Group>
              <Form.Group controlId="formGroupGroup">
                <Form.Label>Your group</Form.Label>
                <Form.Control type="text" placeholder="Enter group" onChange={(e) => {setGroup(e.target.value); setErrorGroup(false)}}/>
                {errorGroup?<span style={{color:'red'}}>Group is required</span>:null }
              </Form.Group>
                <Button onClick={(!name||!group)?abort:announceUser} block variant="primary" type="button">
                Join Chat Group
                </Button>
            </Form>
          </Row>
        </Container>
      </div>
      )
}

export default Join;
