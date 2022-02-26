import mongoose from "mongoose"  

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
    }
})
locationSchema.index({ coords: '2dsphere' }) //speed geospatial queries by using 2dsphere index

const locationModel = mongoose.model('locationModel', locationSchema)
export default locationModel