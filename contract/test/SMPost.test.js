/* eslint-disable */
const { expect } = require('chai');
const { it, describe, before } = require('mocha');
const { ethers } = require('hardhat');
/* eslint-enable */
/* eslint-disable no-unused-expressions */

const TestingData = {
   customer1: {
      email: 'customer1@test.com'
   },
   customer2: {
      email: 'customer2@test.com'
   },
   center1: {
      email: 'center1@test.com',
      location: 'center1'
   },
   storehouse1: {
      email: 'storehouse1@test.com',
      location: 'storehouse1'
   },
   customer1: {
      email: 'customer1@test.com',
      location: 'customer1'
   },
   customer2: {
      email: 'customer2@test.com',
      location: 'customer2'
   },
   order: {
      id: 'order id',
      note: 'order note',
      imageURL: 'order image url',
      requestedDate: '2024-05-16'
   }
}

describe('Deploy Testing', () => {
  it('Should deploy the contract', async () => {
      const contract = await ethers.deployContract('SMBPOST');
    
      const tx = await contract.createCustomer(TestingData.customer1.email);
      await tx.wait();

      const customerOrders = await contract.getOrderByCustomerEmail(TestingData.customer1.email);

      expect(customerOrders).to.be.an('array');
  });
})

describe('ShippingCenter Creation Testing', () => {
   let contract;
   before(async () => {
      contract = await ethers.deployContract('SMBPOST');
   });
   // Create
   it('Should create a new ShippingCenter', async () => {
      const tx = await contract.createShippingCenter(TestingData.center1.email);
      await tx.wait();

      const centerOrders = await contract.getOrderByStaffEmail(TestingData.center1.email);

      expect(centerOrders).to.be.an('array');
   });
   it('Should fail to create a new ShippingCenter with existing email', async () => {
      try {
         const tx = await contract.createShippingCenter(TestingData.center1.email);
         await tx.wait();
      } catch (error) {
         expect(error).to.be.an('error');
      }
   });
   it('Should fail to create a new ShippingCenter without email', async () => {
      try {
         const tx = await contract.createShippingCenter('');
         await tx.wait();
      } catch (error) {
         expect(error).to.be.an('error');
      }
   });
   // Delete
   it('Should remove a ShippingCenter', async () => {
      const tx = await contract.removeShoppingCenter(TestingData.center1.email);
      await tx.wait();
      expect(tx).to.be.an('object');
   });
   it('Should fail to remove a ShippingCenter with non-existing email', async () => {
      try {
         const tx = await contract.removeShoppingCenter(TestingData.center1.email);
         await tx.wait();
      } catch (error) {
         expect(error).to.be.an('error');
      }}
   );
   it('Should fail to remove a ShippingCenter without email', async () => {
      try {
         const tx = await contract.removeShoppingCenter('');
         await tx.wait();
      } catch (error) {
         expect(error).to.be.an('error');
      }
   });
})

describe('Storehouse Creation Testing', () => {
   let contract;
   before(async () => {
      contract = await ethers.deployContract('SMBPOST');
   });
   // Create
   it('Should create a new Storehouse', async () => {
      const tx = await contract.createStorehouse(TestingData.customer1.email);
      await tx.wait();

      const storehouseOrders = await contract.getOrderByStaffEmail(TestingData.storehouse1.email);

      expect(storehouseOrders).to.be.an('array');
   });
   it('Should fail to create a new Storehouse with existing email', async () => {
      try {
         const tx = await contract.createStorehouse(TestingData.storehouse1.email);
         await tx.wait();
      } catch (error) {
         expect(error).to.be.an('error');
      }
   });
   it('Should fail to create a new Storehouse without email', async () => {
      try {
         const tx = await contract.createStorehouse('');
         await tx.wait();
      } catch (error) {
         expect(error).to.be.an('error');
      }
   });
   // Delete
   it('Should remove a Storehouse', async () => {
      const tx = await contract.removeStorehouse(TestingData.storehouse1.email);
      await tx.wait();
      expect(tx).to.be.an('object');
   });
   it('Should fail to remove a Storehouse with non-existing email', async () => {
      try {
         const tx = await contract.removeStorehouse(TestingData.storehouse1.email);
         await tx.wait();
      } catch (error) {
         expect(error).to.be.an('error');
      }}
   );
   it('Should fail to remove a Storehouse without email', async () => {
      try {
         const tx = await contract.removeStorehouse('');
         await tx.wait();
      } catch (error) {
         expect(error).to.be.an('error');
      }
   });
});

describe('Customer Creation Testing', () => {
   let contract;
   before(async () => {
      contract = await ethers.deployContract('SMBPOST');
   });
   // Create
   it('Should create a new Customer', async () => {
      const tx = await contract.createCustomer(TestingData.customer1.email);
      await tx.wait();

      const customerOrders = await contract.getOrderByCustomerEmail(TestingData.customer1.email);

      expect(customerOrders).to.be.an('array');
   });
   it('Should fail to create a new Customer with existing email', async () => {
      try {
         const tx = await contract.createCustomer(TestingData.customer1.email);
         await tx.wait();
      } catch (error) {
         expect(error).to.be.an('error');
      }
   });
   it('Should fail to create a new Customer without email', async () => {
      try {
         const tx = await contract.createCustomer('');
         await tx.wait();
      } catch (error) {
         expect(error).to.be.an('error');
      }
   });
   // Delete
   it('Should remove a Customer', async () => {
      const tx = await contract.removeCustomer(TestingData.customer1.email);
      await tx.wait();
      expect(tx).to.be.an('object');
   });
   it('Should fail to remove a Customer with non-existing email', async () => {
      try {
         const tx = await contract.removeCustomer(TestingData.customer1.email);
         await tx.wait();
      } catch (error) {
         expect(error).to.be.an('error');
      }}
   );
   it('Should fail to remove a Customer without email', async () => {
      try {
         const tx = await contract.removeCustomer('');
         await tx.wait();
      } catch (error) {
         expect(error).to.be.an('error');
      }
   });
});

describe('Order Testing', () => {
   let contract;
   before(async () => {
      contract = await ethers.deployContract('SMBPOST');

      // ShippingCenter
      await contract.createShippingCenter(TestingData.center1.email);

      // Storehouse
      await contract.createStorehouse(TestingData.storehouse1.email);

      // sender
      await contract.createCustomer(TestingData.customer1.email);
      // receiver
      await contract.createCustomer(TestingData.customer2.email);
   });

   it('Should create a new Order', async () => {
      const ways = [
         TestingData.storehouse1.email, 
      ]

      const tx = await contract.createOrder(
         TestingData.order.id,
         TestingData.center1.email,
         TestingData.customer1.email,
         TestingData.customer2.email,
         TestingData.order.note,
         TestingData.order.imageURL,
         TestingData.order.requestedDate,
         ways
      )
      await tx.wait();

      const orderDetail = await contract.getOrderDetail(TestingData.order.id);
      const orders = await contract.getOrderByCustomerEmail(TestingData.customer1.email);

      expect(orders).to.be.an('array');
   });
});
