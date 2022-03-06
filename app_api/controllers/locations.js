import CustomError from "../models/CustomError.js"
import locationModel from "../models/locationsModel.js"

const locationsListByDistance = async(req, res, next) => {
    
}

const locationsCreate = async(req, res, next) => {
    
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
    
}

const locationsDeleteOne = async(req, res, next) => {
    
}

export default {
    locationsListByDistance,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne
}
