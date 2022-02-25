
/**GET 'Home' page === list of all available nearby locations with wifi*/
export const homeList = (req, res, next) => {
  res.render('locations_list', { title: 'Express' });
}

/**GET 'LocationInfo' page */
export const locationInfo = (req, res, next) => {
  res.render('location_info', { title: 'Location info' });
}

/**GET 'AddReview' page */
export const addReview = (req, res, next) => {
  res.render('location_review_form', { title: 'add a review' });
}