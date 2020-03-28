const { validationResult } = require('express-validator');
const fs = require('fs');

const HttpError = require('../models/http-error.js');
// const Place = require('../models/place-model');
const Imagen = require('../models/imagen-model');
const mongoose = require('mongoose');

const createImage = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError('Invalid inputs passes, pleased check your data', 422));
  }
  const { modulo, nombre, orden } = req.body;

  const newImage = new Imagen({
    modulo,
    nombre,
    orden,
    imagen: req.file.path
  });
  try {
    await newImage.save();
  } catch (err) {
    const error = new HttpError('Failed', 500);
    return next(error);
  }
  res.status(201).json({ imagen: newImage });
};

const getImageById = async (req, res, next) => {
  let imageId = req.params.imageId;
  let image;
  try {
    image = await Imagen.findById(imageId);
  } catch (err) {
    const error = new HttpError('No se pudo encontrat la imagen', 500);
    return next(error);
  }
  if (!image) {
    const error = new HttpError('No se pudo encontrat la imagen', 500);
    return next(error);
  }

  res.json({ imagen: image.toObject({ getters: true }) });
};

const getImagesByModule = async (req, res, next) => {
  let modulo = req.params.modulo;
  let imagenes;
  try {
    imagenes = await Imagen.find({ modulo: modulo }).sort('orden');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place',
      500
    );
    return next(error);
  }
  if (!imagenes) {
    const error = new HttpError(
      'No se han podido encontrar imagenes para este módulo',
      404
    );
    return next(error);
  }
  res.json({
    imagenes: imagenes.map(imagen => imagen.toObject({ getters: true }))
  });
};

const updateImage = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError(
      'Invalid inputs passes, pleased check your data',
      422
    );
    return next(error);
  }
  const { nombre, orden } = req.body;
  const imageId = req.params.imageId;

  let image;
  try {
    image = await Imagen.findById(imageId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update image',
      500
    );
    return next(error);
  }

  image.nombre = nombre;
  image.orden = orden;

  try {
    await image.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update image',
      500
    );
    return next(error);
  }

  res.status(200).json({ imagen: image.toObject({ getters: true }) });
};

const deleteImage = async (req, res, next) => {
  const imageId = req.params.iid;
  console.log(imageId);
  let image;
  try {
    image = await Imagen.findById(imageId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place',
      500
    );
    return next(error);
  }
  console.log(image);

  if (!image) {
    const error = new HttpError('Could not find image for this id', 404);
    return next(error);
  }

  const imagePath = image.imagen;

  try {
    image.deleteOne();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place',
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted image' });
};

exports.createImage = createImage;
exports.getImagesByModule = getImagesByModule;
exports.deleteImage = deleteImage;
exports.getImageById = getImageById;
exports.updateImage = updateImage;

// const getPlaceById = async (req, res, next) => {
//   const placeId = req.params.pid;

//   let place;
//   try {
//     place = await Place.findById(placeId);
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not find a place',
//       500
//     );
//     return next(error);
//   }

//   if (!place) {
//     const error = new HttpError(
//       'Could not find a place for the provided id',
//       404
//     );
//     return next(error);
//   }
//   res.json({ place: place.toObject({ getters: true }) });
// };

// const getPlacesByModule = async (req, res, next) => {
//   const userId = req.params.uid;
//   let places;
//   try {
//     places = await Place.find({ creator: userId });
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not find the places for the user',
//       500
//     );
//     return next(error);
//   }

//   if (!places || places.length === 0) {
//     const error = new HttpError(
//       'Could not find places for the provided user id',
//       404
//     );
//     return next(error);
//   }

//   res.json({ places: places.map(place => place.toObject({ getters: true })) });
// };

// const createPlace = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     next(new HttpError('Invalid inputs passes, pleased check your data', 422));
//   }
//   const { title, description, address } = req.body;
//   let coordinates;
//   try {
//     coordinates = await getCoordsForAddress(address);
//   } catch (error) {
//     return next(error);
//   }

//   const createdPlace = new Place({
//     title,
//     description,
//     address,
//     image: req.file.path,
//     creator: req.userData.userId
//   });

//   let user;
//   try {
//     user = await User.findById(creator);
//   } catch (err) {
//     const error = new HttpError('Creating place failed, please try again', 500);
//     return next(error);
//   }

//   if (!user) {
//     const error = new HttpError('Could not find user for provided id', 404);
//     return next(error);
//   }

//   // console.log(user);

//   try {
//     const sess = await mongoose.startSession();
//     sess.startTransaction();
//     await createdPlace.save({ session: sess });
//     user.places.push(createdPlace);
//     await user.save({ session: sess });
//     await sess.commitTransaction();
//   } catch (err) {
//     const error = new HttpError('Creating place failed, please try again', 500);
//     return next(error);
//   }

//   res.status(201).json({ place: createdPlace });
// };

// const updatePlace = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.log(errors);
//     const error = new HttpError(
//       'Invalid inputs passes, pleased check your data',
//       422
//     );
//     return next(error);
//   }
//   const { title, description } = req.body;
//   const placeId = req.params.pid;

//   let place;
//   try {
//     place = await Place.findById(placeId);
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not update place',
//       500
//     );
//     return next(error);
//   }

//   if (place.creator.toString() !== req.userData.userId) {
//     const error = new HttpError('You are not allowed to edit this place', 401);
//     return next(error);
//   }

//   place.title = title;
//   place.description = description;

//   try {
//     await place.save();
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not update place',
//       500
//     );
//     return next(error);
//   }

//   res.status(200).json({ place: place.toObject({ getters: true }) });
// };

// const deletePlace = async (req, res, next) => {
//   const placeId = req.params.pid;
//   let place;
//   try {
//     place = await Place.findById(placeId).populate('creator');
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not delete place',
//       500
//     );
//     return next(error);
//   }

//   if (!place) {
//     const error = new HttpError('Could not find place for this id', 404);
//     return next(error);
//   }

//   if (place.creator.id !== req.userData.userId) {
//     const error = new HttpError(
//       'You are not allowed to delete this place',
//       401
//     );
//     return next(error);
//   }

//   const imagePath = place.image;

//   try {
//     const sess = await mongoose.startSession();
//     await sess.startTransaction();
//     await place.remove({ session: sess });
//     place.creator.places.pull(place);
//     await place.creator.save({ session: sess });
//     await sess.commitTransaction();
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not delete place',
//       500
//     );
//     return next(error);
//   }

//   fs.unlink(imagePath, err => {
//     console.log(err);
//   });

//   res.status(200).json({ message: 'Deleted place' });
// };

// exports.getPlaceById = getPlaceById;
// exports.getPlacesByUserId = getPlacesByUserId;
// exports.createPlace = createPlace;
// exports.updatePlace = updatePlace;
// exports.deletePlace = deletePlace;
