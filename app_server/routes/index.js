var express = require('express');
var router = express.Router();
var ctrlStatic = require('../controllers/static');
var ctrlOrder = require('../controllers/order');
var ctrlGallery = require('../controllers/gallery');
var ctrlNewEntry = require('../controllers/newEntry');
var Multer = require('multer');
var multer = Multer({
    storage: Multer.MemoryStorage
});

router.use('/gallery/new', multer.fields([{ name:'mainImage',maxCount:1},{name:'images',maxCount:20}]));
/*static pages*/
router.get('/',ctrlStatic.homepage);
router.get('/about',ctrlStatic.about);
router.get('/price',ctrlStatic.price);
router.get('/contacts',ctrlStatic.contacts);


/*Gallery*/
//router.get('/gallery',ctrlGallery.gallery);
router.get('/gallery',ctrlGallery.galleryAngular);
router.get('/gallery/new',ctrlNewEntry.newEntryForm);
router.post('/gallery/new',ctrlNewEntry.newEntrySubmit);
router.get('/gallery/:slug',ctrlGallery.entry);
//router.get(/\/gallery\/(.*)/, ctrlGallery.entry);


/*Order page*/
router.get('/order',ctrlOrder.orderForm);
//router.post('/order',ctrlOrder.newOrderSubmit);

module.exports = router;
