import { v4 as uuidv4 } from 'uuid';

export const createOrder = async (accountArress, contract, orderData) => {
  const orderID = uuidv4();
  return await contract.methods
    .createOrder(
      orderID,
      orderData.centerEmail,
      orderData.senderPhone,
      orderData.receiverPhone,
      orderData.note,
      orderData.imageURL,
      orderData.requestDate
    )
    .send({
      from: accountArress
    });
};
