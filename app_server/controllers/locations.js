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
      if (response.data.length) {  //only run if the api returned some data
          data = response.data.map(item => {
          item.distance = formatDistance(item.distance)
          return item
        })
      }
      renderHomepage(req, res, data)
    })
    .catch(err => {
      renderHomepage(req, res, "");
    })

}

/**GET 'LocationInfo' page */
export const locationInfo = (req, res, next) => {
  const callback = (req, res, data) => { renderDetailPage(req, res, data)} 
  getLocationInfo(req, res, callback)
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

/**Post a review through the add review page */
export const submitReview = (req, res, next) => {
  
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
  let message = null
  if (!(responseBody instanceof Array)) { //if the response isn't an array
    message = "API lookup error"
    responseBody = [] //return an empty array
  }
  else if (!responseBody.length) //if the response is an array with no length
    message = "no places found nearby"
  
   //render the homepage
  res.render('locations_list', {
    title: 'loc8r',
    pageHeader: {  //page header object
      title: 'loc8r',
      strapLine: 'Find places to work with wifi near you!'
    },
    locations: responseBody,
    message
  });
}
const renderDetailPage = (req, res, location) => {
  res.render('location_info', {
    pageHeader: { title: location.name },
    sideBar: {
      context: ' is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'please leave a review'
    },
    location
  });
}
const renderError = (error, req, res) => {
  let title = ''
      let content = ''
      if (error.response.status === 404) {
        title = '404, Page requested not found'
        content = 'sorry, looks like the page you requested isn\'t there anymore.'
      }
      else {
        title = `${error.response.status}, something went wrong`
        content = 'something, somewhere, has gone just a little bit wrong.'
      }
      res.status(error.response.status)
      res.render('generic_text', {
        title,
        content
      })
}
const getLocationInfo = (req, res, callback) => {
  const path = `/api/locations/${req.params.locationId}`
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'get'
  }

  axios(requestOptions)
    .then(response => {
      const data = response.data
      data.coords = {
        longitude: data.coords.coordinates[0],
        latitude: data.coords.coordinates[1]
      }
      callback(req, res, data) //following a successful api response, invokes callback instead of a named function
    })
    .catch(error => {
      renderError(error, req, res)
    })
}