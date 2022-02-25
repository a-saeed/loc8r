
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
  res.render('location_info', {
    pageHeader: { title: 'starCups' },
    sideBar: {
      context: ' is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'please leave a review'
    },
    location: {
      name: 'starCups',
      address: ' 125 High Street, Reading, RG6 1PS',
      rating: '3',
      facilities: ['HOt drinks', 'Food', 'Premium Wifi'],
      coords: { lat: 51.455041, lng: -0.9690884 },
      openingTimes: [
        {
          days: 'monday - friday ',
          opening: '7:00am',
          closing: '7:00pm',
          closed: false
        },
        {
           days: 'saturday ',
          opening: '8:00am',
          closing: '5:00pm',
          closed: false
        },
        {
          days: 'sunday ',
          closed: 'true'
        }
      ],
      reviews: [
        {
          author: 'Simon Holmes',
          rating: '5',
          timestamp: '16 June 2013',
          reviewText: 'What a great place.'
        },
        {
          author: 'Charlie Chaplin',
          rating: '3',
          timestamp: '16 June 2013',
          reviewText: 'Coffee was not great .'
        }
      ]
    }
  });
}

/**GET 'AddReview' page */
export const addReview = (req, res, next) => {
  res.render('location_review_form', { title: 'add a review' });
}