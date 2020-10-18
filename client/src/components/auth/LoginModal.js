import React, {Component} from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  NavLink,
  Alert
} from 'reactstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {login} from '../../actions/authActions';
import {clearErrors} from '../../actions/errorActions';

class LoginModal extends Component{
  state = {
    modal: false,
    email: '',
    password: '',
    message: null
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps, nextProps) {
    const {error, isAuthenticated} = this.props;

    //Check if anything has changed
    if(error !== prevProps.error){
      //Check for register error
      if(error.id === 'LOGIN_FAIL'){
        this.setState({
          message: error.message.message,
        });
      } else {
        this.setState({
          message: null,
        });
      }
    }

    //If user is authenticated, then close the modal
    if(this.state.modal){
      if(isAuthenticated){
        //Toggle the modal
        this.toggle();
      }
    }
  }

  toggle = () => {
    //Clear errors
    this.props.clearErrors();

    this.setState({
      modal: !this.state.modal
    });
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSubmit = (event) => {
    event.preventDefault();

    const {email, password} = this.state;
    const user = {
      email: email,
      password: password,
    };

    //Attempt to login
    this.props.login(user);

    //Close the modal
    // this.toggle();
  }

  render(){
    return(
      <div>
        <NavLink
          onClick={this.toggle}
          href="#">
            Login
        </NavLink>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}>
            <ModalHeader
              toggle={this.toggle}>
                Login
            </ModalHeader>
            <ModalBody>
              {
                this.state.message ?
                <Alert color='danger'>
                  {this.state.message}
                </Alert> :
                null
              }
              <Form onSubmit={this.onSubmit}>
                <FormGroup>
                    <Label for='email'>
                      Email
                    </Label>
                    <Input
                      type='email'
                      name='email'
                      id='email'
                      placeholder='Email'
                      className='mb-3'
                      onChange={this.onChange}/>

                      <Label for='password'>
                        Password
                      </Label>
                      <Input
                        type='password'
                        name='password'
                        id='password'
                        placeholder='Password'
                        className='mb-3'
                        onChange={this.onChange}/>

                      <Button
                        color='dark'
                        style={{
                          marginTop: '2rem',
                          display: 'block'
                        }}>
                        Login
                      </Button>
                </FormGroup>
              </Form>
            </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default connect(
  mapStateToProps,
  {
    login,
    clearErrors,
  }
)(LoginModal);
