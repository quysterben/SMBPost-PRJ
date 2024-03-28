export const createShipping = async (accountAddress, contract, shippingData) => {
  try {
    return await contract.methods
      .createShippingCenter(
        shippingData.email,
        shippingData.phonenumber,
        shippingData.username,
        shippingData.address
      )
      .send({
        from: accountAddress
      });
  } catch (err) {
    console.log(err);
  }
};

export const createStorehouse = async (accountAddress, contract, storehouseData) => {
  try {
    return await contract.methods
      .createStorehouse(
        storehouseData.email,
        storehouseData.phonenumber,
        storehouseData.username,
        storehouseData.address
      )
      .send({
        from: accountAddress
      });
  } catch (err) {
    console.log(err);
  }
};

export const createCustomer = async (accountAddress, contract, customerData) => {
  try {
    return await contract.methods.createCustomer(...customerData).send({
      from: accountAddress
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeShipping = async (accountAddress, contract, email) => {
  try {
    return await contract.methods.removeShoppingCenter(email).send({
      from: accountAddress
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeStorehouse = async (accountAddress, contract, email) => {
  try {
    return await contract.methods.removeStorehouse(email).send({
      from: accountAddress
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeCustomer = async (accountAddress, contract, email) => {
  try {
    return await contract.methods.removeCustomer(email).send({
      from: accountAddress
    });
  } catch (err) {
    console.log(err);
  }
};
