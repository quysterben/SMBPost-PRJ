import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export const createOrder = async (accountArress, contract, orderData) => {
  const orderID = uuidv4();
  const timestampNow = moment().format('YYYY-MM-DD HH:mm:ss').toString();
  return await contract.methods
    .createOrder(
      orderID,
      orderData.centerEmail,
      orderData.senderPhone,
      orderData.receiverPhone,
      orderData.note,
      orderData.imageURL,
      orderData.requestDate,
      timestampNow,
      orderData.posTypes,
      orderData.posNames
    )
    .send({
      from: accountArress
    });
};
