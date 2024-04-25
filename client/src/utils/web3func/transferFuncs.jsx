import moment from 'moment';

export const transferToStorehouse = async (accountAdrress, contract, data) => {
  const timestampNow = moment().format('YYYY-MM-DD HH:mm:ss').toString();
  const submitData = {
    orderID: data.orderID,
    storehouseEmail: data.storehouseEmail,
    transferData: timestampNow
  };
  console.log(submitData);
  return await contract.methods
    .transferToStorehouse(submitData.orderID, submitData.storehouseEmail, submitData.transferData)
    .send({
      from: accountAdrress
    });
};
