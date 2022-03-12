import CustomError from "../models/CustomError.js"
import locationModel from "../models/locationsModel.js"

const locationsListByDistance = async (req, res, next) => {
    try {
        //read lng and lat from query strings
        const longitude = parseFloat(req.query.longitude)
        const latitude = parseFloat(req.query.latitude)
        const near = { //create geoJSON point
            type: "point",
            coordinates: [longitude, latitude]
        };
        const geoOptions = {
            distanceField: "distance.calculated",
            key: "coords",
            spherical: "true",
            maxDistance: 20000, //20km
        };
        if (!longitude || !latitude) {
            return res.status(404).json({ message: "lng and lat query strings are required" })
        }
        const results = await locationModel.aggregate([
            {
                $geoNear: {
                    near,
                    ...geoOptions
                }
            },
            {
                $limit: 10 //return no more than 10 near locations
            }
        ])
        const locations = results.map(result => { //output all near locations
            return {
                id: result._id,
                name: result.name,
                address: result.address,
                rating: result.rating,
                facilities: result.facilities,
                distance: `${result.distance.calculated}`
            }   
        })
        res.status(200).json(locations)
    } catch (error) {
        next(new CustomError(404, "an error occurred " + error))
    }
    
}

const locationsCreate = async (req, res, next) => {
    try {
        const newLocation = new locationModel({
            name: req.body.name,
            address: req.body.address,
            facilities: req.body.facilities.split(","),
            coords: {
                type: "Point",
                coordinates: [
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat)
                ]
            },
            openingTimes: [{
                days: req.body.days1,
                opening: req.body.opening1,
                closing: req.body.closing1,
                closed: req.body.closed1
            },
            {
                days: req.body.days2,
                opening: req.body.opening2,
                closing: req.body.closing2,
                closed: req.body.closed2
            }]
        })

        const location = await newLocation.save()
        res.status(200).json(location)
    } catch (error) {
        next(new CustomError(404, "an error occurred " + error))
    }
}

const locationsReadOne = async (req, res, next) => {
    try {
        const location = await locationModel.findById(req.params.locationId)
        if (!location) {
            return res.status(404).json({message: "no location found"})
        }
        res.status(200).json(location)
    } catch (error) {
        next(new CustomError(404, "an error occurred "))
    }
}

const locationsUpdateOne = async(req, res, next) => {
    try {
        if (!req.params.locationId)
            res.status(404).json({message:"Not found, location ID is required"})
        
        const location = await locationModel.findById(req.params.locationId).select('-reviews -rating') //return doc except reviews and rating
        if (!location) {
            return res.status(404).json({message: "no location found"})
        }
        //update location based on req.body
        location.name = req.body.name,
        location.address = req.body.address,
        location.facilities = req.body.facilities.split(","),
        location.coords = {
            type: "Point",
            coordinates: [
                parseFloat(req.body.lng),
                parseFloat(req.body.lat)
            ]
        },
        location.openingTimes = [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1
        },
        {
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2
                }]
        await location.save()
        res.status(200).json(location)

    } catch (error) {
        next(new CustomError(404, "an error occurred " + error))
    }
}

const locationsDeleteOne = async(req, res, next) => {
    try {
        const { locationId } = req.params //reading params this way prevents castToObject errors caused by mongoose
        if (!locationId)
            return res.status(404).json({ message: "no location found" })
        
        await locationModel.findByIdAndDelete(locationId)
        res.status(204).json(null)
    } catch (error) {
        next(new CustomError(404, "an error occurred " + error))
    }
}

export default {
    locationsListByDistance,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne
}
