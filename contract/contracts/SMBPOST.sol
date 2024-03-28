//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SMBPOST {
    enum OrderStatus {
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

    struct OrderWay {
        string posName;
        string posType;
    }

    struct Order {
        string senderPhone;
        string receiverPhone;
        uint256 weight;
        uint256 paidMoney;
        string note;
        string imageURL;
        OrderStatus status;
        OrderWay[] ways;
        HistoryOrder[] histories;
    }

    struct ShippingCenter {
        string email;
        string name;
        string phoneNumber;
        string pos;
    }

    struct Storehouse {
        string email;
        string name;
        string phoneNumber;
        string pos;
    }

    struct Customer {
        string email;
        string name;
        string pos;
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
        return bytes(ordersList[_orderID].senderPhone).length > 0;
    }

    function createOrder(
        string memory _orderID,
        string memory _shippingCenterEmail,
        string memory _senderPhone,
        string memory _receiverPhone,
        string memory _note,
        uint256 _weight,
        uint256 _paidMoney,
        string memory _imageURL,
        string memory _requestDate
    ) public payable returns (bool) {
        require(
            bytes(customersList[_senderPhone].name).length > 0,
            "Customer does not exist"
        );
        require(
            bytes(customersList[_receiverPhone].name).length > 0,
            "Customer does not exist"
        );
        require(bytes(_orderID).length > 0, "OrderID is required");
        require(
            !orderExists(_orderID),
            "Order with the same ID already exists"
        );

        Order storage newOrder = ordersList[_orderID];
        newOrder.senderPhone = _senderPhone;
        newOrder.receiverPhone = _receiverPhone;
        newOrder.imageURL = _imageURL;
        newOrder.paidMoney = _paidMoney;
        newOrder.weight = _weight;
        newOrder.note = _note;

        OrderWay memory way;
        way.posType = "ShippingCenter";
        way.posName = shippingCentersList[_shippingCenterEmail].name;
        newOrder.ways.push(way);

        HistoryOrder memory history;
        history.timestamp = block.timestamp;
        history.action = "Requested";
        history.detail = string(
            abi.encodePacked("Shipping Center:", _shippingCenterEmail)
        );
        history.date = _requestDate;
        newOrder.histories.push(history);

        ordersList[_orderID] = newOrder;
        orderIDs.push(_orderID);

        return true;
    }

    function addOrderWay(
        string memory _posType,
        string memory _posName,
        string memory _orderID
    ) public payable returns (bool) {
        OrderWay memory newWay;
        newWay.posType = _posType;
        newWay.posName = _posName;

        ordersList[_orderID].ways.push(newWay);

        return true;
    }

    function getOrderDetail(string memory _orderID)
        public
        view
        returns (
            uint256,
            uint256,
            string memory,
            string memory,
            string memory,
            OrderWay[] memory
        )
    {
        return (
            ordersList[_orderID].weight,
            ordersList[_orderID].paidMoney,
            ordersList[_orderID].senderPhone,
            ordersList[_orderID].receiverPhone,
            ordersList[_orderID].imageURL,
            ordersList[_orderID].ways
        );
    }

    function getOrderHistories(string memory _orderID)
        public
        view
        returns (HistoryOrder[] memory)
    {
        return (ordersList[_orderID].histories);
    }

    function createCustomer(
        string memory _email,
        string memory _phoneNumber,
        string memory _name,
        string memory _pos
    ) public payable returns (bool) {
        require(bytes(_email).length > 0, "Email is required");
        require(
            !(bytes(customersList[_email].name).length > 0),
            "Email already exist"
        );
        require(bytes(_phoneNumber).length > 0, "Phonenumber is required");
        require(
            bytes(_phoneNumber).length > 9,
            "Please enter 10 digits mobile number, only"
        );
        require(bytes(_pos).length > 0, "Address is required");
        require(bytes(_name).length > 0, "Name is required");

        if (customersList[_email].isExist) {
            return false;
        }

        Customer memory newCustomer;
        newCustomer.name = _name;
        newCustomer.pos = _pos;
        newCustomer.phoneNumber = _phoneNumber;
        newCustomer.isExist = true;

        customersList[_email] = newCustomer;

        return true;
    }

    function createShippingCenter(
        string memory _email,
        string memory _phoneNumber,
        string memory _name,
        string memory _pos
    ) public payable returns (bool) {
        require(bytes(_email).length > 0, "Email is required");
        require(
            !(bytes(shippingCentersList[_email].name).length > 0),
            "Email already exist"
        );
        require(bytes(_pos).length > 0, "Position is required");
        require(bytes(_phoneNumber).length > 0, "Phonenumber is required");
        require(
            bytes(_phoneNumber).length > 9,
            "Please enter 10 digits mobile number, only"
        );
        require(bytes(_name).length > 0, "Name is required");

        ShippingCenter memory newShippingCenter;
        newShippingCenter.name = _name;
        newShippingCenter.phoneNumber = _phoneNumber;
        newShippingCenter.email = _email;
        newShippingCenter.pos = _pos;

        shippingCentersList[_email] = newShippingCenter;

        return true;
    }

    function createStorehouse(
        string memory _email,
        string memory _phoneNumber,
        string memory _name,
        string memory _pos
    ) public payable returns (bool) {
        require(bytes(_email).length > 0, "Email is required");
        require(
            !(bytes(storehousesList[_email].name).length > 0),
            "Email already exist"
        );
        require(bytes(_pos).length > 0, "Position is required");
        require(bytes(_phoneNumber).length > 0, "Phonenumber is required");
        require(
            bytes(_phoneNumber).length > 9,
            "Please enter 10 digits mobile number, only"
        );
        require(bytes(_name).length > 0, "Name is required");

        Storehouse memory newStorehouse;
        newStorehouse.name = _name;
        newStorehouse.phoneNumber = _phoneNumber;
        newStorehouse.email = _email;
        newStorehouse.pos = _pos;

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
        require(bytes(_transferDate).length > 0, "Moving date is required");

        HistoryOrder memory newHistory;
        newHistory.timestamp = block.timestamp;
        newHistory.date = _transferDate;
        newHistory.action = "Move to storehouse";
        newHistory.detail = string(
            abi.encodePacked("Storehouse:", _storehouseEmail)
        );
        order.histories.push(newHistory);

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
        order.histories.push(newHistory);

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
        order.histories.push(newHistory);

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
            "Order must be in system"
        );
        require(bytes(_canceledDate).length > 0, "Canceled date is required");

        order.status = OrderStatus.Cancelled;

        HistoryOrder memory newHistory;
        newHistory.timestamp = block.timestamp;
        newHistory.date = _canceledDate;
        newHistory.action = "Canceled";
        newHistory.detail = string(abi.encodePacked("Canceled:", _reason));

        return true;
    }

    function getCustomerDetail(string memory _customerEmail)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        return (
            customersList[_customerEmail].name,
            customersList[_customerEmail].email,
            customersList[_customerEmail].phoneNumber,
            customersList[_customerEmail].pos
        );
    }

    function getShippingCenterDetail(string memory _shippingCenterEmail)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        return (
            shippingCentersList[_shippingCenterEmail].name,
            shippingCentersList[_shippingCenterEmail].email,
            shippingCentersList[_shippingCenterEmail].phoneNumber,
            shippingCentersList[_shippingCenterEmail].pos
        );
    }

    function getStorehouseDetail(string memory _storehouseEmail)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        return (
            storehousesList[_storehouseEmail].name,
            storehousesList[_storehouseEmail].email,
            storehousesList[_storehouseEmail].phoneNumber,
            storehousesList[_storehouseEmail].pos
        );
    }

    function removeShoppingCenter(string memory _email)
        public
        payable
        returns (bool)
    {
        require(
            bytes(shippingCentersList[_email].name).length > 0,
            "Shipping center does not exist"
        );

        delete shippingCentersList[_email];

        return true;
    }

    function removeStorehouse(string memory _email)
        public
        payable
        returns (bool)
    {
        require(
            bytes(storehousesList[_email].name).length > 0,
            "Storehouse does not exist"
        );

        delete storehousesList[_email];

        return true;
    }

    function removeCustomer(string memory _email)
        public
        payable
        returns (bool)
    {
        require(
            bytes(customersList[_email].name).length > 0,
            "Customer does not exist"
        );

        delete customersList[_email];

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
