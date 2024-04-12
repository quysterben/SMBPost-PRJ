import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export const createOrder = async (accountArress, contract, orderData) => {
  const orderID = uuidv4();
  const timestampNow = moment().format('YYYY-MM-DD HH:mm:ss').toString();
  const submitData = {
    orderID: orderID,
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
    console.log(res);
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

export const getOrdersByMail = async (accountAdrress, contract, email) => {
  try {
    const res = await contract.methods.getOrderByEmail(email).call({ from: accountAdrress });
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};
