import React, {Component, Fragment} from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container
} from 'reactstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import RegisterModal from './auth/RegisterModal';
import LoginModal from './auth/LoginModal';
import Logout from './auth/Logout';

class AppNavbar extends Component{
  //state can also be used without a constructor in React
  state = {
    isOpen: false
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render(){
    const {isAuthenticated, user} = this.props.auth;

    const authLinks = (
      <Fragment>
        <NavItem>
          <span
           className="navbar-text mr-3">
            <strong>
              {
                this.props.auth.user ?
                `Welcome ${user.name}` : ''
              }
            </strong>
          </span>
        </NavItem>
        <NavItem>
          <Logout/>
        </NavItem>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        <NavItem>
          <RegisterModal/>
        </NavItem>
        <NavItem>
          <LoginModal/>
        </NavItem>
      </Fragment>
    );

    return(
      <div>
        <Navbar color="dark" dark expand='sm' className='mb-5'>
        {/*expand attribute toggles responsiveness
        depending on the screen size
        sm => small, md => medium, lg => large*/}
          <Container>
            <NavbarBrand href="/">ShoppingList</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
            {/*The navbar attribute in Collapse
               is to let the Collapse know that it
               is in a Navbar because Collapse
               can also be used elsewhere*/}
               <Nav className='ml-auto' navbar>
                  <NavItem>
                    <NavLink href="https://github.com/mudrakpatel">
                      GitHub
                    </NavLink>
                  </NavItem>
                  {
                    isAuthenticated ?
                    authLinks : guestLinks
                  }
               </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  null
)(AppNavbar);
