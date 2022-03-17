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
         const review = addReview(req, res, location)
         if (review.msg == "validationError")
             return res.status(400).json({ message: 'validationError' })
         
         const thisReview = location.reviews.slice(-1).pop()
         await location.save()
         res.status(200).json(thisReview)
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
        if (!location.reviews && !location.reviews.length > 0) 
            return res.status(404).json({ message: "this location doesn't have reviews yet" })
        
        //search current location for the review with the given id. (reviews is a sub-document in location)
        const review = location.reviews.id(req.params.reviewId)
        if (!review) {
            return res.status(404).json({ message: "review not found" })
        }
        //a review is found, return it alongside its location name and id
        const response = {
            location: {
                name: location.name,
                id: req.params.locationId
            },
            review
        }
        return res.status(200).json(response)

    } catch (error) {
        next(new CustomError(404, "error while getting review -> " + error))
    }
}

const reviewsUpdateOne = async(req, res, next) => {
    try {
        if (!req.params.locationId || !req.params.reviewId)
            res.status(404).json({ message: "Not found, locationID and reviewID are required" })
        
        const location = await locationModel.findById(req.params.locationId)
        if (!location)
            res.status(404).json({ message: "location not found" })
        
        if (!location.reviews && !location.reviews.length > 0) 
            res.status(404).json({ message: "No reviews to update" })
        
        const thisReview = location.reviews.id(req.params.reviewId)
        if (!thisReview)
            res.status(404).json({ message: "Review not found" })
        
        thisReview.author = req.body.author
        thisReview.rating = req.body.rating
        thisReview.reviewText = req.body.reviewText
        //rating may have changed,call function to update overall rating
        updateOverallRating(location)
        res.status(200).json(thisReview);
    
            
    } catch (error) {
        next(new CustomError(404, "an error occurred " + error.message))
    }
}

const reviewsDeleteOne = async(req, res, next) => {
   try {
       const { locationId, reviewId } = req.params;
       console.log(locationId + " .." + reviewId);
        if (!locationId || !reviewId)
            return res.status(404).json({ message: "Not found, locationId and reviewId are both required" })
        
       const location = await locationModel.findById(locationId).select('reviews')
       console.log(location);
        if (!location)
            return res.status(404).json({ message: "location not found" })
        if (!location.reviews && !location.reviews.length > 0)
            return res.status(404).json({ message: "location has no reviews yet" })
        
       const thisReview = location.reviews.id(reviewId)
        if (!thisReview)
            return res.status(404).json({ message: "no review found" })
        
        //remove review using mongoose .remove that can be applied to sub-docs, then update location rating
        thisReview.remove()
       updateOverallRating(location)
       
       res.status(200).json(location)
   } catch (error) {
        next(new CustomError(404, "an error occurred " + error.message))
   }
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
    if (!author || !rating || !reviewText)  //return if any review field is empty
        return { msg: 'validationError' }
        
    location.reviews.push({
        author,
        rating,
        reviewText
    })
    updateOverallRating(location)
    return {msg: "reviewAdded"} //success
}

const updateOverallRating = (location) => {
    if (location.reviews && location.reviews.length > 0) {
        const count = location.reviews.length;
        const total = location.reviews.reduce((sum, { rating }) => { //get sum of ratings of all review sub-docs belonging to current location
            return sum + rating
        }, 0)
        //update the overall rating of the location
        location.rating = parseInt(total / count, 10) 
        console.log("overall rating updated to " + location.rating);
    }
}

export default {
    reviewsCreate,
    reviewsReadOne,
    reviewsUpdateOne,
    reviewsDeleteOne
}