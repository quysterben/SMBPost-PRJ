export const createShipping = async (accountAddress, contract, shippingData) => {
  return await contract.methods.createManuFactory(shippingData).send({
    from: accountAddress
  });
};

export const createStorehouse = async (accountAddress, contract, storehouseData) => {
  return await contract.methods.createStorehouse(storehouseData).send({
    from: accountAddress
  });
};

export const createCustomer = async (accountAddress, contract, customerData) => {
  return await contract.methods.createCustomer(customerData).send({
    from: accountAddress
  });
};
