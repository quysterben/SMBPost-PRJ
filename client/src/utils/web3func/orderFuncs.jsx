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
    const result = res[0].map((order, index) => {
      return {
        orderID: res[1][index],
        receiverEmail: order.receiverEmail,
        senderEmail: order.senderEmail,
        status: order.status,
        note: order.note,
        imageURL: order.imageURL,
        histories: order.histories,
        wayEmails: order.wayEmails
      };
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const getOrdersByStaffEmail = async (accountAdrress, contract, email) => {
  try {
    const res = await contract.methods.getOrderByStaffEmail(email).call({ from: accountAdrress });
    const result = res[0].map((order, index) => {
      return {
        orderID: res[1][index],
        receiverEmail: order.receiverEmail,
        senderEmail: order.senderEmail,
        status: order.status,
        note: order.note,
        imageURL: order.imageURL,
        histories: order.histories,
        wayEmails: order.wayEmails
      };
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const getOrdersByCustomerEmail = async (accountAdrress, contract, email) => {
  try {
    const res = await contract.methods
      .getOrderByCustomerEmail(email)
      .call({ from: accountAdrress });
    return res;
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
    return res;
  } catch (err) {
    console.log(err);
  }
};
