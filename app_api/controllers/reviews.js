import { response } from "express"
import CustomError from "../models/CustomError.js"
import locationModel from "../models/locationsModel.js"

const reviewsCreate = async(req, res, next) => {
    
}

const reviewsReadOne = async(req, res, next) => {
    try {
        //get location first, only return its name and reviews  
        const location = await locationModel.findById(req.params.locationId).select('name reviews')
        if (!location) {
            return  res.status(404).json({message: "no location found"})
        }

        //checks that the current location has reviews
        if (location.reviews && location.reviews.length > 0) {
            //search current location for the review with the given id. (reviews is a sub-document in location)
            const review = location.reviews.id(req.params.reviewId)
            if (!review) {
                return res.status(404).json({ message: "review not found" })
            }
            //a review is found, return it alongside its location name and id
            response = {
                location: {
                    name: location.name,
                    id: req.params.locationId
                },
                review
            }
            return res.status(200).json(response)
        }
        
        //current location does not have reviews, return error
        return res.status(404).json({message: "this location doesn't have reviews yet"})


    } catch (error) {
        next(new CustomError(404, "error while getting review -> " + error))
    }
}

const reviewsUpdateOne = async(req, res, next) => {
    
}

const reviewsDeleteOne = async(req, res, next) => {
    
}

export default {
    reviewsCreate,
    reviewsReadOne,
    reviewsUpdateOne,
    reviewsDeleteOne
}