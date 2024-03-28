export const createShipping = async (accountAddress, contract, shippingData) => {
  return await contract.methods.createShippingCenter(shippingData.email).send({
    from: accountAddress
  });
};

export const createStorehouse = async (accountAddress, contract, storehouseData) => {
  return await contract.methods.createStorehouse(storehouseData.email).send({
    from: accountAddress
  });
};

export const createCustomer = async (accountAddress, contract, customerData) => {
  return await contract.methods.createCustomer(customerData.email, customerData.phoneNumber).send({
    from: accountAddress
  });
};

export const removeShippingCenter = async (accountAddress, contract, email) => {
  return await contract.methods.removeShoppingCenter(email).send({
    from: accountAddress
  });
};

export const removeStorehouse = async (accountAddress, contract, email) => {
  return await contract.methods.removeStorehouse(email).send({
    from: accountAddress
  });
};

export const removeCustomer = async (accountAddress, contract, email) => {
  return await contract.methods.removeCustomer(email).send({
    from: accountAddress
  });
};
