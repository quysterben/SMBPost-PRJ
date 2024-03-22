const { expect } = require('chai');
const { it, describe, before } = require('mocha');
const { ethers } = require('hardhat');

describe('SMPost', () => {
    it('Should deploy contract', async () => {
        const smbpostContract = await ethers.deployContract('SMBPOST');

        const customerEmail = 'testCusEmail@test.com';
        const customerName = 'testCusName';
        const customerAddress = 'test address'
        const customerPhone = '1234567890'

        const tx = await smbpostContract.createCustomer(customerEmail, customerPhone, customerAddress, customerName);
        await tx.wait();

        const customer = await smbpostContract.getCustomerDetail(customerEmail);
        expect(customer[0]).to.equal(customerName);
    })
})

describe('About Shipping Center', () => {
    const shippingCenterTestName = 'testCenter';
    const shippingCenterTestPos = 'testCenterPos';
    const shippingCenterTestEmail = 'testCenterEmail';
    const shippingCenterTestPhone = '0123456789';

    let smbpostContract;
    before(async () => {
        smbpostContract = await ethers.deployContract('SMBPOST');
    })
    it('Should create a shipping center', async () => {
        const tx = await smbpostContract.createShippingCenter(
            shippingCenterTestEmail, 
            shippingCenterTestPhone, 
            shippingCenterTestName,
            shippingCenterTestPos
        );
        await tx.wait();

        const center = await smbpostContract.getShippingCenterDetail(shippingCenterTestEmail);
        expect(center[0]).to.equal(shippingCenterTestName);
    });
    it('Shound fail to create a shipping center with the same email', async () => {
        const tx = smbpostContract.createShippingCenter(
            shippingCenterTestEmail, 
            shippingCenterTestPhone, 
            shippingCenterTestName,
            shippingCenterTestPos
        );
        await expect(tx).to.be.revertedWith('Email already exist');
    });
    it('Shound fail with empty address', async () => {
        const tx = smbpostContract.createShippingCenter(
            shippingCenterTestEmail + '1', 
            shippingCenterTestPhone, 
            shippingCenterTestName,
            ''
        );
        await expect(tx).to.be.revertedWith('Position is required');
    });
    it('Should fail with empty name', async () => {
        const tx = smbpostContract.createShippingCenter(
            shippingCenterTestEmail + '1', 
            shippingCenterTestPhone, 
            '',
            shippingCenterTestPos
        );
        await expect(tx).to.be.revertedWith('Name is required');
    });
    it('Should fail with empty email', async () => {
        const tx = smbpostContract.createShippingCenter(
            '', 
            shippingCenterTestPhone, 
            shippingCenterTestName,
            shippingCenterTestPos
        );
        await expect(tx).to.be.revertedWith('Email is required');
    });
    it('Should fail with empty phone', async () => {
        const tx = smbpostContract.createShippingCenter(
            shippingCenterTestEmail + '1', 
            '', 
            shippingCenterTestName,
            shippingCenterTestPos
        );
        await expect(tx).to.be.revertedWith('Phonenumber is required');
    });
    it('Should fail with not 10 numbers of phone', async () => {
        const tx = smbpostContract.createShippingCenter(
            shippingCenterTestEmail + '1', 
            '123456789',
            shippingCenterTestName,
            shippingCenterTestPos
        );
        await expect(tx).to.be.revertedWith('Please enter 10 digits mobile number, only');
    });
})

describe('About Storehouse', () => {
    const storehouseTestName = 'testStorehouse';
    const storehouseTestAddress = 'testStorehouseAddress';
    const storehouseTestEmail = 'testStorehouseEmail';
    const storehouseTestPhone = '0123456789';

    let smbpostContract;
    before(async () => {
        smbpostContract = await ethers.deployContract('SMBPOST');
    })
    it('Should create a storehouse', async () => {
        const tx = await smbpostContract.createStorehouse(
            storehouseTestEmail, 
            storehouseTestPhone, 
            storehouseTestName,
            storehouseTestAddress
        );
        await tx.wait();

        const storehouse = await smbpostContract.getStorehouseDetail(storehouseTestEmail);
        expect(storehouse[0]).to.equal(storehouseTestName);
    });
    it('Shound fail to create a storehouse with the same email', async () => {
        const tx = smbpostContract.createStorehouse(
            storehouseTestEmail, 
            storehouseTestPhone, 
            storehouseTestName,
            storehouseTestAddress
        );
        await expect(tx).to.be.revertedWith('Email already exist');
    });
    it('Shound fail with empty address', async () => {
        const tx = smbpostContract.createStorehouse(
            storehouseTestEmail + '1', 
            storehouseTestPhone, 
            storehouseTestName,
            ''
        );
        await expect(tx).to.be.revertedWith('Position is required');
    });
    it('Should fail with empty name', async () => {
        const tx = smbpostContract.createStorehouse(
            storehouseTestEmail + '1', 
            storehouseTestPhone, 
            '',
            storehouseTestAddress
        );
        await expect(tx).to.be.revertedWith('Name is required');
    });
    it('Should fail with empty email', async () => {
        const tx = smbpostContract.createStorehouse(
            '', 
            storehouseTestPhone, 
            storehouseTestName,
            storehouseTestAddress
        );
        await expect(tx).to.be.revertedWith('Email is required');
    });
    it('Should fail with empty phone', async () => {
        const tx = smbpostContract.createStorehouse(
            storehouseTestEmail + '1', 
            '', 
            storehouseTestName,
            storehouseTestAddress
        );
        await expect(tx).to.be.revertedWith('Phonenumber is required');
    });
})

describe('About Order', () => {
  
})
