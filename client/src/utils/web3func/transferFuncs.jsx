import moment from 'moment';

export const transferToStorehouse = async (accountAdrress, contract, data) => {
  const timestampNow = moment().format('YYYY-MM-DD HH:mm:ss').toString();
  const submitData = {
    orderID: data.orderID,
    storehouseEmail: data.storehouseEmail,
    transferData: timestampNow
  };
  return await contract.methods
    .transferToStorehouse(submitData.orderID, submitData.storehouseEmail, submitData.transferData)
    .send({
      from: accountAdrress
    });
};

export const transferToCustomer = async (accountAdrress, contract, data) => {
  const timestampNow = moment().format('YYYY-MM-DD HH:mm:ss').toString();
  const submitData = {
    orderID: data.orderID,
    transferDate: timestampNow,
    customerEmail: data.customerEmail
  };
  return await contract.methods
    .transferToCustomer(submitData.orderID, submitData.customerEmail, submitData.transferDate)
    .send({
      from: accountAdrress
    });
};

export const cancelAnOrder = async (accountAdrress, contract, data) => {
  const timestampNow = moment().format('YYYY-MM-DD HH:mm:ss').toString();
  const submitData = {
    orderID: data.orderID,
    cancelDate: timestampNow,
    cancelReason: data.cancelReason
  };
  return await contract.methods
    .cancelAnOrder(submitData.orderID, submitData.cancelDate, submitData.cancelReason)
    .send({
      from: accountAdrress
    });
};
