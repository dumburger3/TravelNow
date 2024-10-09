const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

main().catch(err => {
    console.log("OH NO MONGO CONNECTION ERROR!!!");
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log("MONGO CONNECTION OPEN!!!");
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6702015253126b3409d6f241',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vero rem, esse fugit ipsam similique est accusamus veniam expedita! Ea commodi, laborum quae totam inventore fugit officiis cupiditate libero repellat impedit?`,
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dhpx73ymx/image/upload/v1728277084/YelpCamp/oetfdw8ols733xdr06ja.png',
                    filename: 'YelpCamp/oetfdw8ols733xdr06ja',
                },
                {
                    url: 'https://res.cloudinary.com/dhpx73ymx/image/upload/v1728277085/YelpCamp/fhkqvwlw4ghzqyqgfqwj.png',
                    filename: 'YelpCamp/fhkqvwlw4ghzqyqgfqwj',
                },
                {
                    url: 'https://res.cloudinary.com/dhpx73ymx/image/upload/v1728277085/YelpCamp/pubqzmjepisfodhk7iae.png',
                    filename: 'YelpCamp/pubqzmjepisfodhk7iae',
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})