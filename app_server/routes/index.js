import express from 'express';
import { index } from '../controllers/main.js';
var router = express.Router();


/* GET home page. */
router.get('/', index);

export default router;
