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

import {register} from '../../actions/authActions';
import {clearErrors} from '../../actions/errorActions';

class RegisterModal extends Component{
  state = {
    modal: false,
    name: '',
    email: '',
    password: '',
    message: null
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps, nextProps) {
    const {error, isAuthenticated} = this.props;

    //Check if anything has changed
    if(error !== prevProps.error){
      //Check for register error
      if(error.id === 'REGISTER_FAIL'){
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

    const {name, email, password} = this.state;

    //Create an User object
    const newUser = {
      name: name,
      email: email,
      password: password,
    };

    //Attempt to register a new user
    this.props.register(newUser);

    //Close the modal
    // this.toggle();
  }

  render(){
    return(
      <div>
        <NavLink
          onClick={this.toggle}
          href="#">
            Register
        </NavLink>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}>
            <ModalHeader
              toggle={this.toggle}>
                Register
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
                    <Label for='name'>
                      Name
                    </Label>
                    <Input
                      type='text'
                      name='name'
                      id='name'
                      placeholder='Name'
                      className='mb-3'
                      onChange={this.onChange}/>
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
                        Register
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
    register,
    clearErrors,
  }
)(RegisterModal);
