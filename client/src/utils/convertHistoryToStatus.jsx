const convertHistoryToStatus = (history) => {
  console.log(history.action);
  if (history.action === 'Requested') {
    return { text: 'Requested', color: 'warning' };
  } else if (history.action === 'Move to storehouse') {
    return { text: 'Intransit', color: 'info' };
  } else if (history.action === 'Canceled') {
    return { text: 'Canceled', color: 'default' };
  } else {
    return { text: 'Delivered', color: 'success' };
  }
};

export default convertHistoryToStatus;
