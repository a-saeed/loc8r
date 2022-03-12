import axios from "axios";
/**set the environment */
const apiOptions = {
  server: 'http://localhost:3000'
}
if (process.env.NODE_ENV === 'production')
    apiOptions.server = 'https://mighty-springs-13927.herokuapp.com'

/**GET 'Home' page === list of all available nearby locations with wifi
 * get data from app-api instead of hardcoded data
 * 
*/
export const homeList = (req, res, next) => {
  const path = '/api/locations'; //set the path of the required api
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'get',
    params: {
        longitude: 31.218139, 
        latitude: 30.013651,
        maxDistance: 20
    }
  }

  axios(requestOptions)
    .then(response => {
      let data = []
      data = response.data.map(item => {
        item.distance = formatDistance(item.distance)
        return item
      })
      renderHomepage(req, res, data)
    })
    .catch(err => {
      console.log(err);
    })

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
  res.render('location_review_form',
    {
      title: 'Review Starcups on loc8r',
      pageHeader: { title: 'Review Starcups' }
    }
  );
}

/* --------------------------------- HELPERS -------------------------------- */
/**
 * Decoupling the rendering from the application logic
 * start with the Homepage
 * format distance in kilometers
 */

const formatDistance = (distance) => {
  let thisDistance = 0
  let unit = 'm'
  if (distance > 1000) {
    thisDistance = parseFloat(distance / 1000).toFixed(1) //convert to km it surpasses 1000m
    unit = 'km'
  }
  else
    thisDistance = Math.floor(distance)
  return thisDistance + unit
}
const renderHomepage = (req, res, responseBody) => {

  res.render('locations_list', {
    title: 'loc8r',
    pageHeader: {  //page header object
      title: 'loc8r',
      strapLine: 'Find places to work with wifi near you!'
    },
    locations: responseBody
  });
}
