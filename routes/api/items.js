const express = require('express');
const auth = require('../../middleware/auth').auth;

const router = express.Router();

//Item model
const Item = require('../../models/Item');

//@route    GET api/items
//@desc     Get all Items
//@access   Public
router.get('/', (request, response, next) => {
  Item.find()
      .sort({date: -1})
      .then(items => {
        return response.status(200).json(items);
      });
});

//@route    POST api/items
//@desc     Create an Item
//@access   Private
router.post('/', auth, (request, response, next) => {
  const newItem = new Item({
    name: request.body.name
  });

  newItem.save()
         .then(item => {
           return response.status(201).json(item);
         });
});

//@route    DELETE api/items/:id
//@desc     Delete an Item
//@access   Private
router.delete('/:id', auth, (request, response, next) => {
  Item.findById(request.params.id)
      .then(item => {
        item.remove()
            .then(item => {
              return response.status(200).json(item);
            });
      })
      .catch(error => {
        return response.status(404).json({
          success: false,
          message: 'Item not found!'
        });
      });
});

module.exports = router;
