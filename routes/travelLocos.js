const express = require('express');
const router = express.Router();
const travelLocos = require('../controllers/travelLocos')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateTravelLoco } = require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })

const TravelLoco = require('../models/travelLoco');

router.route('/')
    .get(catchAsync(travelLocos.index))
    .post(isLoggedIn, upload.array('image'), validateTravelLoco, catchAsync(travelLocos.createTravelLoco))

router.get('/new', isLoggedIn, travelLocos.renderNewForm)

router.route('/:id')
    .get(catchAsync(travelLocos.showTravelLoco))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateTravelLoco, catchAsync(travelLocos.updateTravelLoco))
    .delete(isLoggedIn, isAuthor, catchAsync(travelLocos.deleteTravelLoco))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(travelLocos.renderEditForm))

module.exports = router;