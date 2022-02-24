import express from 'express';
import { addReview, homeList, locationInfo } from '../controllers/locations.js';
import { about } from '../controllers/other.js';

var router = express.Router();


/* Location pages. */
router.get('/', homeList );
router.get('/location', locationInfo );
router.get('/location/review/new', addReview );

/* Other pages. */
router.get('/about', about)

export default router;
