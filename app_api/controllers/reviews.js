import { response } from "express"
import CustomError from "../models/CustomError.js"
import locationModel from "../models/locationsModel.js"

const reviewsCreate = async(req, res, next) => {
    /*to add a new review(a sub-document), we need to find the parent document first(location)
    * keeping in mind that the new review has a rating that will affect the overall rating or the location 
    */
    //start by finding the location
     try {
        const location = await locationModel.findById(req.params.locationId)
        if (!location) {
            return res.status(404).json({message: "no location found"})
        }
        /**
         * a location is found, read new review from request body
         * then push it to the review array
         * to keep the function minimal and easier to test
         * we'll create an external function to do the next part
         * addReview is defined at end of file
         */
         addReview(req, res, location)
    } catch (error) {
        next(new CustomError(404, "an error occurred " + error.message))
    }

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

/* ---------------------------- HELPER FUNCTIONS ---------------------------- */

const addReview = (req, res, location) => {
    /**
     * a location is already found, we don't need to check for it
     * read review from request
     * then push it to the reviews sub-document.
     * update the overall review for the location before saving it. (another function)
     * return the newly added review 
     */
    const { author, rating, reviewText } = req.body;
    location.reviews.push({
        author,
        rating,
        reviewText
    })
    updateOverallRating(location)
    const thisReview = location.reviews.slice(-1).pop()
    res.status(200).json(thisReview)
}

const updateOverallRating = async (location) => {
    try {
        if (location.reviews && location.reviews.length > 0) {
            const count = location.reviews.length;
            const total = location.reviews.reduce((sum, { rating }) => { //get sum of ratings of all review sub-docs belonging to current location
                return sum + rating
            }, 0)
            //update the overall rating of the location, then save it
            location.rating = parseInt(total / count, 10)
            await location.save()  
            console.log("overall rating updated to " + location.rating);
        }
    //we don't need an action if the location doesn't have any reviews yet
    } catch (error) {
        throw error
    }
}

export default {
    reviewsCreate,
    reviewsReadOne,
    reviewsUpdateOne,
    reviewsDeleteOne
}