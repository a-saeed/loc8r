import express from 'express';
import { addReview, homeList, locationInfo, submitReview } from '../controllers/locations.js';
import { about } from '../controllers/other.js';

var router = express.Router();


/* Location pages. */
router.get('/', homeList );
router.get('/location/:locationId', locationInfo );
router
    .route('/location/:locationId/review/new')
    .get(addReview)
    .post(submitReview)

/* Other pages. */
router.get('/about', about)

export default router;
