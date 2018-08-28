function reviews(state = [], action) {
  switch(action.type) {
    case 'FETCH_REVIEWS':
      return action.reviews;
    case 'ADD_REVIEW':
      return [...state, {
        reviewId: action.review.reviewId ,
        origin : action.review.origin,
        destination: action.review.destination,
        company: action.review.company,
        price: action.review.price,
        comment: action.review.comment,
        features: {
          isAC: action.review.features.isAC,
          isMusicVideos: action.review.features.isMusicVideos,
          isMovies: action.review.features.isMovies,
          hasCurtains: action.review.features.hasCurtains,
          hasUSB: action.review.features.hasUSB,
          brokedown: action.review.features.brokedown,
        },
        ticket_time: {
          hours: action.review.ticket_time.hours,
          minutes: action.review.ticket_time.minutes,
          AM: action.review.ticket_time.AM,},
        departure_time: {
          hours: action.review.departure_time.hours,
          minutes: action.review.departure_time.minutes,
          AM: action.review.departure_time.AM,},
        arrival_time: {
          hours: action.review.arrival_time.hours,
          minutes: action.review.arrival_time.minutes,
          AM: action.review.arrival_time.AM,},
      }];
    case 'REMOVE_REVIEW':
      console.log("removing a review!");
      return state;
    default:
      return state;
  }
}

export default reviews;
