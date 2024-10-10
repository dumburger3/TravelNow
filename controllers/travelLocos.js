const TravelLoco = require('../models/travelLoco');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require("../cloudinary");
const { query } = require('express');

module.exports.index = async (req, res) => {
    const travelLocos = await TravelLoco.find({});
    res.render('travelLocos/index', { travelLocos })
}

module.exports.renderNewForm = (req, res) => {
    res.render('travelLocos/new')
}

module.exports.createTravelLoco = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.travelLoco.location,
        limit: 1
    }).send()
    const travelLoco = new TravelLoco(req.body.travelLoco);
    travelLoco.geometry = geoData.body.features[0].geometry;
    travelLoco.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    travelLoco.author = req.user._id;
    await travelLoco.save()
    req.flash('success', 'Successfully made a new travelLoco!')
    res.redirect(`/travelLocos/${travelLoco._id}`)
}

module.exports.showTravelLoco = async (req, res) => {
    const travelLoco = await TravelLoco.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!travelLoco) {
        req.flash('error', 'Cannot find that travelLoco!');
        return res.redirect('/travelLocos');
    }
    res.render('travelLocos/show', { travelLoco })
}

module.exports.renderEditForm = async (req, res) => {
    const travelLoco = await TravelLoco.findById(req.params.id)
    if (!travelLoco) {
        req.flash('error', 'Cannot find that travelLoco!');
        return res.redirect('/travelLocos');
    }
    res.render('travelLocos/edit', { travelLoco })
}

module.exports.updateTravelLoco = async (req, res) => {
    const { id } = req.params;
    const travelLoco = await TravelLoco.findByIdAndUpdate(id, { ...req.body.travelLoco })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    travelLoco.images.push(...imgs)
    await travelLoco.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await travelLoco.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated travelLoco');
    res.redirect(`/travelLocos/${travelLoco._id}`)
}

module.exports.deleteTravelLoco = async (req, res) => {
    const { id } = req.params;
    await TravelLoco.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted travelLoco')
    res.redirect('/travelLocos')
}