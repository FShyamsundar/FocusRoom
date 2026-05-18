export const getStartOfDay = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getDayDifference = (laterDate, earlierDate) => {
  const later = getStartOfDay(laterDate).getTime();
  const earlier = getStartOfDay(earlierDate).getTime();
  return Math.round((later - earlier) / (1000 * 60 * 60 * 24));
};

export const getLast7DayBuckets = () => {
  const buckets = [];
  const today = getStartOfDay(new Date());

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    buckets.push(date);
  }

  return buckets;
};

