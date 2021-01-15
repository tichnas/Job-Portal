const getRating = reviews => {
  let rating = 0;
  reviews.forEach(r => (rating += r.value));
  rating /= reviews.length || 1;
  rating = rating.toFixed(1);
  return rating;
};

export default getRating;
