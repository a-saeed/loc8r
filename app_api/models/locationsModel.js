import mongoose from "mongoose"  
  
const openingTimeSchema = mongoose.Schema({
    days: String,
    opening: String, //time
    closing: String, //time
    closed: {
        type: Boolean,
        required: true
    }
})

const reviewSchema = mongoose.Schema({
    author: String,
    rating: {
        type: Number,
        max: 5,
        min: 0,
        default: 0
    },
    reviewText: String,
    createdOn: { type: Date, default: Date.now()}
})

const locationSchema = mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    facilities: [String], //array of strings
    coords: { //distance is resembled as geoJSON pair coordinates [longitude,latitude]
        type: String,
        coordinates: [Number]
    },
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
})
locationSchema.index({ coords: '2dsphere' }) //speed geospatial queries by using 2dsphere index

const locationModel = mongoose.model('locationModel', locationSchema)
export default locationModel