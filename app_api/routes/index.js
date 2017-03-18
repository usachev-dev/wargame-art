var express = require('express');
var router = express.Router();
var ctrlGallery = require('../controllers/gallery');
var ctrlSystems = require('../controllers/systems');
var ctrlGenres = require('../controllers/genres');
var ctrlOrder = require('../controllers/order');

router.get('/gallery',ctrlGallery.galleryListByDate);
router.post('/gallery',ctrlGallery.entryCreate);
router.post('/order',ctrlOrder.newOrderSubmit);
router.get('/gallery/:slug',ctrlGallery.entryReadOne);
//router.put('/gallery/:slug',ctrlGallery.entryUpdateOne);
//router.delete('/gallery/:slug',ctrlGallery.entryDeleteOne);

//router.get('/gallery/:slug/main', ctrlGallery.mainImageRead);
//router.get('/gallery/:slug/images', ctrlGallery.readAllImages);
//router.post('/gallery/:slug/addImages', ctrlGallery.imageAddToEntry);
//router.delete('/gallery/:slug/:image', ctrlGallery.imageDeleteOne);

router.get('/systems',ctrlSystems.getAllSystems);
router.get('/genres',ctrlGenres.getAllGenres);


module.exports = router;