//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SMBPOST {
    enum OrderStatus {
        Pending,
        InTransit,
        Delivered,
        Cancelled
    }

    struct HistoryOrder {
        uint256 timestamp;
        string date;
        string action;
        string detail;
    }

    struct Order {
        string senderEmail;
        string receiverEmail;
        uint256 weight;
        uint256 size;
        uint256 deposit;
        string note;
        string imageURL;
        OrderStatus status;
        HistoryOrder[] history;
    }

    struct ShippingCenter {
        string email;
        string name;
        string phoneNumber;
    }

    struct Storehouse {
        string email;
        string name;
        string phoneNumber;
    }

    struct Customer {
        string email;
        string name;
        string cusAddress;
        string phoneNumber;
        bool isExist;
        string[] receivedOrders;
        string[] sentOrders;
    }

    mapping(string => Order) private ordersList;
    mapping(string => ShippingCenter) private shippingCentersList;
    mapping(string => Storehouse) private storehousesList;
    mapping(string => Customer) private customersList;

    string[] private orderIDs;

    receive() external payable {}

    function orderExists(string memory _orderID) public payable returns (bool) {
        return bytes(ordersList[_orderID].senderEmail).length > 0;
    }

    function createOrder(
        string memory _orderID,
        string memory _shippingCenterEmail,
        string memory _seenderEmail,
        string memory _receiverEmail,
        string memory _note,
        uint256 _size,
        uint256 _weight,
        uint256 _deposit,
        string memory _imageURL,
        string memory _requestDate
    ) public payable returns (bool) {
        require(
            bytes(customersList[_seenderEmail].name).length > 0,
            "Customer is not exist"
        );
        require(
            bytes(customersList[_receiverEmail].name).length > 0,
            "Customer is not exist"
        );
        require(bytes(_orderID).length > 0, "OrderID cannot be empty");
        require(
            !orderExists(_orderID),
            "Order with the same ID already exists"
        );

        Order storage newOrder = ordersList[_orderID];
        newOrder.senderEmail = _seenderEmail;
        newOrder.receiverEmail = _receiverEmail;
        newOrder.imageURL = _imageURL;
        newOrder.weight = _weight;
        newOrder.size = _size;
        newOrder.deposit = _deposit;
        newOrder.note = _note;

        HistoryOrder memory history;
        history.timestamp = block.timestamp;
        history.action = "Requested";
        history.detail = string(
            abi.encodePacked("Shipping Center:", _shippingCenterEmail)
        );
        history.date = _requestDate;

        newOrder.history.push(history);

        ordersList[_orderID] = newOrder;
        orderIDs.push(_orderID);

        return true;
    }

    function getOrderDetail(string memory _packageID)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            string memory,
            string memory,
            string memory,
            HistoryOrder[] memory
        )
    {
        return (
            ordersList[_packageID].weight,
            ordersList[_packageID].size,
            ordersList[_packageID].deposit,
            ordersList[_packageID].senderEmail,
            ordersList[_packageID].receiverEmail,
            ordersList[_packageID].imageURL,
            ordersList[_packageID].history
        );
    }

    function createCustomer(
        string memory _email,
        string memory _phoneNumber,
        string memory _cusAddress,
        string memory _name
    ) public payable returns (bool) {
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(
            !(bytes(customersList[_email].name).length > 0),
            "Email already exist"
        );
        require(bytes(_phoneNumber).length > 0, "Phone number cannot be empty");
        require(
            bytes(_phoneNumber).length > 9,
            "Please enter 10 digits mobile number, only"
        );
        require(bytes(_cusAddress).length > 0, "Address cannot be empty");
        require(bytes(_name).length > 0, "Name cannot be empty");

        if (customersList[_email].isExist) {
            return false;
        }

        Customer memory newCustomer;
        newCustomer.name = _name;
        newCustomer.cusAddress = _cusAddress;
        newCustomer.email = _email;
        newCustomer.phoneNumber = _phoneNumber;
        newCustomer.isExist = true;

        customersList[_email] = newCustomer;

        return true;
    }

    function createShippingCenter(
        string memory _email,
        string memory _phoneNumber,
        string memory _name
    ) public payable returns (bool) {
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(
            !(bytes(shippingCentersList[_email].name).length > 0),
            "Email already exist"
        );
        require(bytes(_phoneNumber).length > 0, "Phone number cannot be empty");
        require(
            bytes(_phoneNumber).length > 9,
            "Please enter 10 digits mobile number, only"
        );
        require(bytes(_name).length > 0, "Name cannot be empty");

        ShippingCenter memory newShippingCenter;
        newShippingCenter.name = _name;
        newShippingCenter.phoneNumber = _phoneNumber;
        newShippingCenter.email = _email;

        shippingCentersList[_email] = newShippingCenter;

        return true;
    }

    function createStorehouse(
        string memory _email,
        string memory _phoneNumber,
        string memory _name
    ) public payable returns (bool) {
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(
            !(bytes(storehousesList[_email].name).length > 0),
            "Email already exist"
        );
        require(
            bytes(_phoneNumber).length > 9,
            "Please enter 10 digits mobile number, only"
        );
        require(bytes(_name).length > 0, "Name cannot be empty");

        Storehouse memory newStorehouse;
        newStorehouse.name = _name;
        newStorehouse.phoneNumber = _phoneNumber;
        newStorehouse.email = _email;

        storehousesList[_email] = newStorehouse;

        return true;
    }

    function transferToStorehouse(
        string memory _orderID,
        string memory _storehouseEmail,
        string memory _transferDate
    ) public payable returns (bool) {
        Order storage order = ordersList[_orderID];

        require(orderExists(_orderID), "Order must be exist");
        require(
            bytes(storehousesList[_storehouseEmail].name).length > 0,
            "Storehouse must be exist"
        );
        require(bytes(_transferDate).length > 0, "Moving date cannot be empty");

        HistoryOrder memory newHistory;
        newHistory.timestamp = block.timestamp;
        newHistory.date = _transferDate;
        newHistory.action = "Move to storehouse";
        newHistory.detail = string(
            abi.encodePacked("Storehouse:", _storehouseEmail)
        );
        order.history.push(newHistory);

        return true;
    }

    function transferToShippingCenter(
        string memory _orderID,
        string memory _shippingCenterEmail,
        string memory _transferDate
    ) public payable returns (bool) {
        Order storage order = ordersList[_orderID];

        require(orderExists(_orderID), "Order must be exist");
        require(
            bytes(shippingCentersList[_shippingCenterEmail].name).length > 0,
            "Shipping center must be exist"
        );
        require(bytes(_transferDate).length > 0, "Moving date cannot be empty");

        HistoryOrder memory newHistory;
        newHistory.timestamp = block.timestamp;
        newHistory.date = _transferDate;
        newHistory.action = "Move to shipping center";
        newHistory.detail = string(
            abi.encodePacked("Shipping Center:", _shippingCenterEmail)
        );
        order.history.push(newHistory);

        return true;
    }

    function transferToCustomer(
        string memory _orderID,
        string memory _customerEmail,
        string memory _transferDate
    ) public payable returns (bool) {
        Order storage order = ordersList[_orderID];

        require(orderExists(_orderID), "Order must be exist");
        require(
            bytes(customersList[_customerEmail].name).length > 0,
            "Customer must be exist"
        );
        require(bytes(_transferDate).length > 0, "Moving date cannot be empty");

        order.status = OrderStatus.Delivered;

        HistoryOrder memory newHistory;
        newHistory.timestamp = block.timestamp;
        newHistory.date = _transferDate;
        newHistory.action = "Move to customer";
        newHistory.detail = string(
            abi.encodePacked("Customer:", _customerEmail)
        );
        order.history.push(newHistory);

        return true;
    }

    function cancelAnOrder(
        string memory _orderID,
        string memory _canceledDate,
        string memory _reason
    ) public payable returns (bool) {
        Order storage order = ordersList[_orderID];
        require(orderExists(_orderID), "Order must be exist");
        require(
            order.status != OrderStatus.Cancelled,
            "Order must be in system"
        );
        require(
            order.status != OrderStatus.Delivered,
            "Oder must be in system"
        );
        require(bytes(_canceledDate).length > 0, "Cancel date cannot be empty");

        order.status = OrderStatus.Cancelled;

        HistoryOrder memory newHistory;
        newHistory.timestamp = block.timestamp;
        newHistory.date = _canceledDate;
        newHistory.action = "Canceled";
        newHistory.detail = string(abi.encodePacked("Canceled:", _reason));

        return true;
    }

    function compareTwoStrings(string memory str1, string memory str2)
        internal
        pure
        returns (bool)
    {
        return
            keccak256(abi.encodePacked(str1)) ==
            keccak256(abi.encodePacked(str2));
    }
}
