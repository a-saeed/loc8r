
/**GET 'Home' page === list of all available nearby locations with wifi*/
export const homeList = (req, res, next) => {
  res.render('locations_list', {
    title: 'loc8r - Find places to work with wifi near you!',
    pageHeader: {  //page header object
      title: 'loc8r',
      strapLine: 'Find places to work with with wifi near you!'
    },
    locations: [   //array of locations objects
      {
      name: 'StarCups',
      address: '125 High Street, Reading, RG6 1PS',
      rating: '3',
      facilities: ['Hot drinks', 'Food', 'Premium Wifi'],
      distance: '5000m'},
      {
      name: 'cafeHero',
      address: '125 High Street, Reading, RG6 1PS',
      rating: '4',
      facilities: ['Hot drinks', 'Food', 'Premium Wifi'],
      distance: '200m'},
      {
      name: 'Burger Queen',
      address: '125 High Street, Reading, RG6 1PS',
      rating: '2',
      facilities: ['Hot drinks', 'Premium Wifi'],
      distance: '250m'
      }
    ] 
  });
}

/**GET 'LocationInfo' page */
export const locationInfo = (req, res, next) => {
  res.render('location_info', { title: 'Location info' });
}

/**GET 'AddReview' page */
export const addReview = (req, res, next) => {
  res.render('location_review_form', { title: 'add a review' });
}