import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export const createOrder = async (accountArress, contract, orderData) => {
  const orderID = uuidv4();
  const timestampNow = moment().format('YYYY-MM-DD HH:mm:ss').toString();
  const submitData = {
    orderID: orderID.slice(0, 8),
    centerEmail: orderData.centerEmail,
    senderEmail: orderData.senderEmail,
    receiverEmail: orderData.receiverEmail,
    note: orderData.note ? orderData.note : '',
    imageURL: orderData.imageURL,
    timestamp: timestampNow,
    wayEmails: orderData.wayEmails
  };
  return await contract.methods
    .createOrder(
      submitData.orderID,
      submitData.centerEmail,
      submitData.senderEmail,
      submitData.receiverEmail,
      submitData.note,
      submitData.imageURL,
      submitData.timestamp,
      submitData.wayEmails
    )
    .send({
      from: accountArress
    });
};

export const getAllOrders = async (accountAdrress, contract) => {
  try {
    const res = await contract.methods.getAllOrders().call({ from: accountAdrress });
    const requestedRes = res[0]
      .map((order, index) => {
        if (order.histories.length === 1) {
          return {
            id: res[1][index],
            receiver: order.receiverEmail,
            sender: order.senderEmail,
            note: order.note,
            center: order.wayEmails[0],
            status: {
              text: 'Requested',
              color: 'warning'
            },
            nowAt: order.histories[order.histories.length - 1].posEmail,
            timestamp: order.histories[order.histories.length - 1].date
          };
        }
      })
      .filter((order) => order !== undefined);
    const intransitRes = res[0]
      .map((order, index) => {
        if (order.histories[order.histories.length - 1].action === 'Canceled') {
          return undefined;
        }
        if (order.histories.length > 1 && order.histories.length <= order.wayEmails.length) {
          return {
            id: res[1][index],
            receiver: order.receiverEmail,
            center: order.wayEmails[0],
            nowAt: order.histories[order.histories.length - 1].posEmail,
            note: order.note,
            status: {
              text: 'Intransit',
              color: 'info'
            },
            sender: order.senderEmail,
            timestamp: order.histories[order.histories.length - 1].date
          };
        }
      })
      .filter((order) => order !== undefined);
    const deliveredRes = res[0]
      .map((order, index) => {
        if (order.histories[order.histories.length - 1].action === 'Canceled') {
          return undefined;
        }
        if (order.histories.length === order.wayEmails.length + 1) {
          return {
            id: res[1][index],
            center: order.wayEmails[0],
            receiver: order.receiverEmail,
            note: order.note,
            status: {
              text: 'Delivered',
              color: 'success'
            },
            sender: order.senderEmail,
            nowAt: order.histories[order.histories.length - 1].posEmail,
            timestamp: order.histories[order.histories.length - 1].date
          };
        }
      })
      .filter((order) => order !== undefined);
    const canceledRes = res[0]
      .map((order, index) => {
        if (order.histories[order.histories.length - 1].action === 'Canceled') {
          return {
            id: res[1][index],
            center: order.wayEmails[0],
            receiver: order.receiverEmail,
            note: order.note,
            status: {
              text: 'Cancelled',
              color: 'default'
            },
            sender: order.senderEmail,
            nowAt: order.histories[order.histories.length - 1].posEmail,
            timestamp: order.histories[order.histories.length - 1].date
          };
        }
      })
      .filter((order) => order !== undefined);
    return {
      requestedRes,
      intransitRes,
      deliveredRes,
      canceledRes
    };
  } catch (err) {
    console.log(err);
  }
};

export const getAllOrdersIn5Days = async (accountAdrress, contract) => {
  try {
    const res = await contract.methods.getAllOrders().call({ from: accountAdrress });
    const orders = res[0].map((order, index) => {
      return {
        id: res[1][index],
        receiver: order.receiverEmail,
        sender: order.senderEmail,
        note: order.note,
        center: order.wayEmails[0],
        requestedTime: order.histories[0].date
      };
    });
    const FiveDayAgoOrders = orders.filter((order) => {
      return moment(order.requestedTime).isBefore(moment().subtract(5, 'days'));
    });
    const FourDayAgoOrders = orders.filter((order) => {
      return moment(order.requestedTime).isBefore(moment().subtract(4, 'days'));
    });
    const ThreeDayAgoOrders = orders.filter((order) => {
      return moment(order.requestedTime).isBefore(moment().subtract(3, 'days'));
    });
    const TwoDayAgoOrders = orders.filter((order) => {
      return moment(order.requestedTime).isBefore(moment().subtract(2, 'days'));
    });
    const OneDayAgoOrders = orders.filter((order) => {
      return moment(order.requestedTime).isBefore(moment().subtract(1, 'days'));
    });
    const TodayOrders = orders.filter((order) => {
      return moment(order.requestedTime).isSame(new Date(), 'day');
    });
    return {
      FiveDayAgoOrders,
      FourDayAgoOrders,
      ThreeDayAgoOrders,
      TwoDayAgoOrders,
      OneDayAgoOrders,
      TodayOrders
    };
  } catch (err) {
    console.log(err);
  }
};

export const getAllOrdersIn5DaysByEmail = async (accountAdrress, contract, email) => {
  try {
    const res = await contract.methods.getOrderByStaffEmail(email).call({ from: accountAdrress });
    const orders = res[0].map((order, index) => {
      return {
        id: res[1][index],
        receiver: order.receiverEmail,
        sender: order.senderEmail,
        note: order.note,
        center: order.wayEmails[0],
        requestedTime: order.histories[0].date
      };
    });
    const FiveDayAgoOrders = orders.filter((order) => {
      return moment(order.requestedTime).isBefore(moment().subtract(5, 'days'));
    });
    const FourDayAgoOrders = orders.filter((order) => {
      return moment(order.requestedTime).isBefore(moment().subtract(4, 'days'));
    });
    const ThreeDayAgoOrders = orders.filter((order) => {
      return moment(order.requestedTime).isBefore(moment().subtract(3, 'days'));
    });
    const TwoDayAgoOrders = orders.filter((order) => {
      return moment(order.requestedTime).isBefore(moment().subtract(2, 'days'));
    });
    const OneDayAgoOrders = orders.filter((order) => {
      return moment(order.requestedTime).isBefore(moment().subtract(1, 'days'));
    });
    const TodayOrders = orders.filter((order) => {
      return moment(order.requestedTime).isSame(new Date(), 'day');
    });
    return {
      FiveDayAgoOrders,
      FourDayAgoOrders,
      ThreeDayAgoOrders,
      TwoDayAgoOrders,
      OneDayAgoOrders,
      TodayOrders
    };
  } catch (err) {
    console.log(err);
  }
};

export const getOrdersByStaffEmail = async (accountAdrress, contract, email) => {
  try {
    const res = await contract.methods.getOrderByStaffEmail(email).call({ from: accountAdrress });
    const requestedRes = res[0]
      .map((order, index) => {
        if (order.histories.length === 1) {
          return {
            id: res[1][index],
            receiver: order.receiverEmail,
            sender: order.senderEmail,
            note: order.note,
            status: {
              text: 'Requested',
              color: 'warning'
            },
            nowAt: order.histories[order.histories.length - 1].posEmail,
            timestamp: order.histories[order.histories.length - 1].date
          };
        }
      })
      .filter((order) => order !== undefined);
    const intransitRes = res[0]
      .map((order, index) => {
        if (order.histories[order.histories.length - 1].action === 'Canceled') {
          return undefined;
        }
        if (order.histories.length > 1 && order.histories.length <= order.wayEmails.length) {
          return {
            id: res[1][index],
            receiver: order.receiverEmail,
            nowAt: order.histories[order.histories.length - 1].posEmail,
            note: order.note,
            status: {
              text: 'Intransit',
              color: 'info'
            },
            sender: order.senderEmail,
            timestamp: order.histories[order.histories.length - 1].date
          };
        }
      })
      .filter((order) => order !== undefined);
    const deliveredRes = res[0]
      .map((order, index) => {
        if (order.histories[order.histories.length - 1].action === 'Canceled') {
          return undefined;
        }
        if (order.histories.length === order.wayEmails.length + 1) {
          return {
            id: res[1][index],
            receiver: order.receiverEmail,
            note: order.note,
            status: {
              text: 'Delivered',
              color: 'success'
            },
            sender: order.senderEmail,
            nowAt: order.histories[order.histories.length - 1].posEmail,
            timestamp: order.histories[order.histories.length - 1].date
          };
        }
      })
      .filter((order) => order !== undefined);
    const canceledRes = res[0]
      .map((order, index) => {
        if (order.histories[order.histories.length - 1].action === 'Canceled') {
          return {
            id: res[1][index],
            receiver: order.receiverEmail,
            note: order.note,
            status: {
              text: 'Cancelled',
              color: 'default'
            },
            sender: order.senderEmail,
            nowAt: order.histories[order.histories.length - 1].posEmail,
            timestamp: order.histories[order.histories.length - 1].date
          };
        }
      })
      .filter((order) => order !== undefined);
    return {
      requestedRes,
      intransitRes,
      deliveredRes,
      canceledRes
    };
  } catch (err) {
    console.log(err);
  }
};

export const getOrdersByCustomerEmail = async (accountAdrress, contract, email) => {
  try {
    const res = await contract.methods
      .getOrderByCustomerEmail(email)
      .call({ from: accountAdrress });
    const requestedRes = res[0]
      .map((order, index) => {
        if (order.histories.length === 1) {
          return {
            id: res[1][index],
            receiver: order.receiverEmail,
            sender: order.senderEmail,
            note: order.note,
            status: {
              text: 'Requested',
              color: 'warning'
            },
            nowAt: order.histories[order.histories.length - 1].posEmail,
            timestamp: order.histories[order.histories.length - 1].date
          };
        }
      })
      .filter((order) => order !== undefined);
    const intransitRes = res[0]
      .map((order, index) => {
        if (order.histories[order.histories.length - 1].action === 'Canceled') {
          return undefined;
        }
        if (order.histories.length > 1 && order.histories.length <= order.wayEmails.length) {
          return {
            id: res[1][index],
            receiver: order.receiverEmail,
            nowAt: order.histories[order.histories.length - 1].posEmail,
            note: order.note,
            status: {
              text: 'Intransit',
              color: 'info'
            },
            sender: order.senderEmail,
            timestamp: order.histories[order.histories.length - 1].date
          };
        }
      })
      .filter((order) => order !== undefined);
    const deliveredRes = res[0]
      .map((order, index) => {
        if (order.histories[order.histories.length - 1].action === 'Canceled') {
          return undefined;
        }
        if (order.histories.length === order.wayEmails.length + 1) {
          return {
            id: res[1][index],
            receiver: order.receiverEmail,
            note: order.note,
            status: {
              text: 'Delivered',
              color: 'success'
            },
            sender: order.senderEmail,
            nowAt: order.histories[order.histories.length - 1].posEmail,
            timestamp: order.histories[order.histories.length - 1].date
          };
        }
      })
      .filter((order) => order !== undefined);
    const canceledRes = res[0]
      .map((order, index) => {
        if (order.histories[order.histories.length - 1].action === 'Canceled') {
          return {
            id: res[1][index],
            receiver: order.receiverEmail,
            note: order.note,
            status: {
              text: 'Cancelled',
              color: 'default'
            },
            sender: order.senderEmail,
            nowAt: order.histories[order.histories.length - 1].posEmail,
            timestamp: order.histories[order.histories.length - 1].date
          };
        }
      })
      .filter((order) => order !== undefined);
    return {
      requestedRes,
      intransitRes,
      deliveredRes,
      canceledRes
    };
  } catch (err) {
    console.log(err);
  }
};

export const checkIsOrderExist = async (accountAdrress, contract, orderID) => {
  try {
    const res = await contract.methods.orderExists(orderID).call({ from: accountAdrress });
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getOrderById = async (accountAdrress, contract, orderID) => {
  try {
    const res = await contract.methods.getOrderDetail(orderID).call({ from: accountAdrress });
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};
