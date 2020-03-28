const express = require('express');
const { check } = require('express-validator');

const imagesController = require('../controllers/images-controller');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:modulo', imagesController.getImagesByModule);

router.get('/update/:imageId', imagesController.getImageById);

// router.get('/user/:uid', placesControllers.getPlacesByUserId);

// router.use(checkAuth);

router.patch(
  '/:imageId',
  [
    check('nombre').notEmpty(),
    check('orden')
      .not()
      .isEmpty()
  ],
  imagesController.updateImage
);

router.post(
  '/new',
  fileUpload.single('image'),
  [
    check('modulo')
      .not()
      .isEmpty(),
    check('nombre').notEmpty(),
    check('orden')
      .not()
      .isEmpty()
  ],
  imagesController.createImage
);

router.delete('/:iid', imagesController.deleteImage);

module.exports = router;
