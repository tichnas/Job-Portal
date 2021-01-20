const getRating = (reviews, raw = false) => {
  let rating = 0;
  reviews.forEach(r => (rating += r.value));
  rating /= reviews.length || 1;
  if (raw) return rating;
  rating = rating.toFixed(1);
  return `${rating}/5 (${reviews.length})`;
};

export default getRating;
