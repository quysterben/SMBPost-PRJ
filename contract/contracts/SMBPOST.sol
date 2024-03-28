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
        string posEmail;
    }

    struct OrderWay {
        string posName;
        string posType;
    }

    struct Order {
        string senderPhone;
        string receiverPhone;
        string note;
        string imageURL;
        OrderStatus status;
        OrderWay[] ways;
        HistoryOrder[] histories;
    }

    struct ShippingCenter {
        string email;
    }

    struct Storehouse {
        string email;
    }

    struct Customer {
        string email;
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
        string memory _imageURL,
        string memory _requestDate
    ) public payable returns (bool) {
        require(
            bytes(customersList[_senderPhone].email).length > 0,
            "Customer does not exist"
        );
        require(
            bytes(customersList[_receiverPhone].email).length > 0,
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
        newOrder.note = _note;

        OrderWay memory way;
        way.posType = "ShippingCenter";
        way.posName = shippingCentersList[_shippingCenterEmail].email;
        newOrder.ways.push(way);

        HistoryOrder memory history;
        history.timestamp = block.timestamp;
        history.action = "Requested";
        history.detail = string(
            abi.encodePacked("Shipping Center:", _shippingCenterEmail)
        );
        history.posEmail = _shippingCenterEmail;
        history.date = _requestDate;
        newOrder.histories.push(history);

        ordersList[_orderID] = newOrder;
        orderIDs.push(_orderID);

        return true;
    }

    function addOrderWay(
        string[] memory _posTypes,
        string[] memory _posNames,
        string memory _orderID
    ) public payable returns (bool) {
        for (uint256 i = 0; i < _posTypes.length - 1; i++) {
            OrderWay memory way;
            way.posType = _posTypes[i];
            way.posName = _posNames[i];
            ordersList[_orderID].ways.push(way);
        }
        return true;
    }

    function getOrderDetail(string memory _orderID)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            OrderWay[] memory,
            HistoryOrder[] memory
        )
    {
        return (
            ordersList[_orderID].senderPhone,
            ordersList[_orderID].receiverPhone,
            ordersList[_orderID].imageURL,
            ordersList[_orderID].note,
            ordersList[_orderID].ways,
            ordersList[_orderID].histories
        );
    }

    function createCustomer(string memory _email, string memory _phoneNumber)
        public
        payable
        returns (bool)
    {
        require(bytes(_email).length > 0, "Email is required");
        require(
            !(bytes(customersList[_email].email).length > 0),
            "Email already exist"
        );
        require(bytes(_phoneNumber).length > 0, "Phonenumber is required");
        require(
            bytes(_phoneNumber).length > 9,
            "Please enter 10 digits mobile number, only"
        );

        if (customersList[_email].isExist) {
            return false;
        }

        Customer memory newCustomer;
        newCustomer.phoneNumber = _phoneNumber;
        newCustomer.email = _email;
        newCustomer.isExist = true;
        customersList[_email] = newCustomer;

        return true;
    }

    function createShippingCenter(string memory _email)
        public
        payable
        returns (bool)
    {
        require(bytes(_email).length > 0, "Email is required");
        require(
            !(bytes(shippingCentersList[_email].email).length > 0),
            "Email already exist"
        );
        ShippingCenter memory newShippingCenter;
        newShippingCenter.email = _email;
        shippingCentersList[_email] = newShippingCenter;

        return true;
    }

    function createStorehouse(string memory _email)
        public
        payable
        returns (bool)
    {
        require(bytes(_email).length > 0, "Email is required");
        require(
            !(bytes(storehousesList[_email].email).length > 0),
            "Email already exist"
        );

        Storehouse memory newStorehouse;
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
            bytes(storehousesList[_storehouseEmail].email).length > 0,
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
            bytes(shippingCentersList[_shippingCenterEmail].email).length > 0,
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
            bytes(customersList[_customerEmail].email).length > 0,
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
        returns (string memory)
    {
        return (customersList[_customerEmail].email);
    }

    function getShippingCenterDetail(string memory _shippingCenterEmail)
        public
        view
        returns (string memory)
    {
        return (shippingCentersList[_shippingCenterEmail].email);
    }

    function getStorehouseDetail(string memory _storehouseEmail)
        public
        view
        returns (string memory)
    {
        return (storehousesList[_storehouseEmail].email);
    }

    function getAllOrders()
        public
        view
        returns (Order[] memory, string[] memory)
    {
        uint256 orderCount = orderIDs.length;

        Order[] memory orders = new Order[](orderCount);

        for (uint256 i = 0; i < orderCount; i++) {
            orders[i] = ordersList[orderIDs[i]];
        }

        return (orders, orderIDs);
    }

    function getOrderByEmail(string memory _email)
        public
        view
        returns (Order[] memory, string[] memory)
    {
        uint256 orderCount = 0;

        for (uint256 i = 0; i < orderIDs.length; i++) {
            string memory orderID = orderIDs[i];
            HistoryOrder[] memory histories = ordersList[orderID].histories;
            if (findOrderByHistory(histories, _email)) {
                orderCount++;
            }
        }

        Order[] memory orders = new Order[](orderCount);
        string[] memory ids = new string[](orderCount);
        uint256 index = 0;

        for (uint256 i = 0; i < orderIDs.length; i++) {
            string memory orderID = orderIDs[i];
            HistoryOrder[] memory histories = ordersList[orderID].histories;
            if (findOrderByHistory(histories, _email)) {
                orders[index] = ordersList[orderID];
                ids[index] = orderID;
                index++;
            }
        }

        return (orders, ids);
    }

    function removeShoppingCenter(string memory _email)
        public
        payable
        returns (bool)
    {
        require(
            bytes(shippingCentersList[_email].email).length > 0,
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
            bytes(storehousesList[_email].email).length > 0,
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
            bytes(customersList[_email].email).length > 0,
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

    function findOrderByHistory(
        HistoryOrder[] memory histories,
        string memory _email
    ) internal pure returns (bool) {
        for (uint256 i = 0; i < histories.length; i++) {
            if (compareTwoStrings(histories[i].posEmail, _email)) {
                return true;
            }
        }
        return false;
    }
}
