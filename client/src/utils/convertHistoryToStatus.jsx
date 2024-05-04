const convertHistoryToStatus = (history) => {
  if (history.action === 'Requested') {
    return { text: 'Requested', color: 'warning' };
  } else if (history.action === 'Move to storehouse') {
    return { text: 'Intransit', color: 'info' };
  } else if (history.action === 'Canceled') {
    return { text: 'Cancelled', color: 'default' };
  } else {
    return { text: 'Delivered', color: 'success' };
  }
};

export default convertHistoryToStatus;
