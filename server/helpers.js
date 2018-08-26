const moment = require('moment');

//  Calculate the show data from the Inventory with query params
const getTicketStatus = function (queryDate, showDate, startDate) {
  // Query date is the date on which we are getting our tickets
  // Show date is the date we want tickets for
  // Start date is the date the show started being in shown theatres
  const queryMoment = moment(queryDate);
  const showMoment = moment(showDate);
  const startMoment = moment(startDate);

  const daysSinceStart = moment.duration(showMoment.diff(startMoment)).asDays();
  const daysTilShowing = moment.duration(showMoment.diff(queryMoment)).asDays();

  // If the show will not have started return flag values
  if (daysSinceStart < 0) {
    return {
      tickets_left: -1,
      tickets_available: -1,
      status: 'Error Flag'
    }
  }

  const ticketsPerDay = 60 <= daysSinceStart ? 5 : 10;
  const ticketTotal = 60 <= daysSinceStart ? 100 : 200;

  const statuses = ["In the past", "Sale not started", "Open for sale", "Sold out"];
  let tickets_left = 0;
  let tickets_available = 0;
  let status = '';

  switch(true) {
    case (99 < daysSinceStart):
        status = statuses[0];
        break;
    case (25 < daysTilShowing):
        status = statuses[1];
        tickets_left = ticketTotal;
        break;
    case (5 < daysTilShowing && daysTilShowing <= 25):
        status = statuses[2];
        tickets_available = ticketsPerDay;
        tickets_left = ticketsPerDay * (daysTilShowing - 5);
        break;
    case (daysTilShowing <= 5):
        status = statuses[3];
        break;
    default:
        throw new Error('Error with daysTilShowing');
        break;
  }

  return {tickets_left, tickets_available, status};
}

// Returns the show JSON objects for a given genre
// Will not return shows which are no longer in theatres
const getShowInfo = function (shows, genre, queryDate, showDate) {
  const showInfo = shows
    .filter(show => show.genre === genre)
    .map(show => {
      const {tickets_left, tickets_available, status} =
        getTicketStatus(queryDate, showDate, show.startDate);
        
      return {
        title: show.title,
        tickets_left,
        tickets_available,
        status
      }
    })
    .filter(show => show.status !== 'Error Flag');

  return showInfo;
}

module.exports = {getShowInfo}
