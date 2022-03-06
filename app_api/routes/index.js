import express from 'express';
const router = express.Router();
import locationsController from '../controllers/locations.js'
import reviewsController from '../controllers/reviews.js'

//LOCATIONS
router
    .route('/locations')
    .get(locationsController.locationsListByDistance)
    .post(locationsController.locationsCreate);

router
    .route('/locations/:locationId')
    .get(locationsController.locationsReadOne)
    .put(locationsController.locationsUpdateOne)
    .delete(locationsController.locationsDeleteOne);

//REVIEWS
router
    .route('/locations/:locationId/reviews')
    .post(reviewsController.reviewsCreate);

router
    .route('/locations/:locationId/reviews/:reviewId')
    .get(reviewsController.reviewsReadOne)
    .put(reviewsController.reviewsUpdateOne)
    .delete(reviewsController.reviewsDeleteOne);

export default router