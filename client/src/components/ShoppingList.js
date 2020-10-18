import React, {Component} from 'react';
import {
  Container,
  ListGroup,
  ListGroupItem,
  Button
} from 'reactstrap';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {connect} from 'react-redux';
import {getItems, deleteItem} from '../actions/itemActions';
import PropTypes from 'prop-types';

class ShoppingList extends Component{
  static propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  componentDidMount() {
    this.props.getItems();
  }

  // addItem = () => {
  //     const name = prompt('Enter Item name');
  //     if(name){
  //       this.setState(state => ({
  //         items: [...state.items, {id: uuid(), name: name}]
  //       }));
  //     }
  // }

  deleteItem = (_id) => {
    this.props.deleteItem(_id);
  }

  render(){
    const {items} = this.props.item;
    return(
      <Container>
        {/*<Button
          color='dark'
          style={{marginBottom: '2rem'}}
          onClick={this.addItem}>
        Add Item
        </Button>*/}
        <ListGroup>
          <TransitionGroup className='shopping-list'>
            {
              items.map(({_id, name}) => (
                <CSSTransition
                  key={_id}
                  timeout={500}
                  classNames='fade'>
                  <ListGroupItem>
                    {
                      this.props.isAuthenticated ?
                      <Button
                        className='remove-btn'
                        color='danger'
                        size='sm'
                        onClick={() => this.deleteItem(_id)}>
                        {/*
                          In this case of deleting an item,
                          option #1: onClick={this.deleteItem(id)}
                          option #2: onClick={() => this.deleteItem(id)}
                          REASON TO USE #2 OVER #1 in THIS CASE is EXPLAINED BELOW:
                          The main difference is between onClick={this.deleteItem(id)}
                          and onClick={() => this.deleteItem(id)} is that
                          the first one is WRONG IN THIS CASE.
                          In that it just invokes the deleteItem(id)
                          method immediately and assigns
                          its return value (undefined) to the onClick handle
                          therefore nothing happens. The second one actually
                          assigns a method to onClick -
                          one that invokes deleteItem(id).
                          */}
                        &times;
                      </Button> :
                      null
                    }
                    {name}
                  </ListGroupItem>
                </CSSTransition>
              ))
            }
          </TransitionGroup>
        </ListGroup>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(
  mapStateToProps,
  {
    getItems,
    deleteItem
  }
)(ShoppingList);
