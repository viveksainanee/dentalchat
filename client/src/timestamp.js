function getDateTime() {
  const timestamp = new Date().getTime();

  const date = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(timestamp);
  
  const time = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);

  return { date, time };
}

export default getDateTime;