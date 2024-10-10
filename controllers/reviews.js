const TravelLoco = require('../models/travelLoco');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const travelLoco = await TravelLoco.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    travelLoco.reviews.push(review);
    await review.save();
    await travelLoco.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/travelLocos/${travelLoco._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await TravelLoco.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/travelLocos/${id}`);
}