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


    struct Order {
        string senderEmail;
        string receiverEmail;
        string note;
        string imageURL;
        OrderStatus status;
        string[] wayEmails;
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
        string memory _senderEmail,
        string memory _receiverEmail,
        string memory _note,
        string memory _imageURL,
        string memory _requestDate,
        string[] memory _wayEmails
    ) public payable returns (bool) {
        require(
            bytes(customersList[_senderEmail].email).length > 0,
            "Customer does not exist"
        );
        require(
            bytes(customersList[_receiverEmail].email).length > 0,
            "Customer does not exist"
        );
        require(bytes(_orderID).length > 0, "OrderID is required");
        require(
            !orderExists(_orderID),
            "Order with the same ID already exists"
        );

        Order storage newOrder = ordersList[_orderID];
        newOrder.senderEmail = _senderEmail;
        newOrder.receiverEmail = _receiverEmail;
        newOrder.imageURL = _imageURL;
        newOrder.note = _note;

        newOrder.wayEmails.push(_shippingCenterEmail);

        HistoryOrder memory history;
        history.timestamp = block.timestamp;
        history.action = "Requested";
        history.detail = string(
            abi.encodePacked("Shipping Center:", _shippingCenterEmail)
        );
        history.posEmail = _shippingCenterEmail;
        history.date = _requestDate;
        newOrder.histories.push(history);

        customersList[_senderEmail].sentOrders.push(_orderID);
        customersList[_receiverEmail].receivedOrders.push(_orderID);

        ordersList[_orderID] = newOrder;
        orderIDs.push(_orderID);

        for (uint256 i = 0; i < _wayEmails.length - 1; i++) {
            ordersList[_orderID].wayEmails.push(_wayEmails[i]);
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
            string[] memory,
            HistoryOrder[] memory
        )
    {
        return (
            ordersList[_orderID].senderEmail,
            ordersList[_orderID].receiverEmail,
            ordersList[_orderID].imageURL,
            ordersList[_orderID].note,
            ordersList[_orderID].wayEmails,
            ordersList[_orderID].histories
        );
    }

    function createCustomer(string memory _email)
        public
        payable
        returns (bool)
    {
        require(bytes(_email).length > 0, "Email is required");
        require(
            !(bytes(customersList[_email].email).length > 0),
            "Email already exist"
        );

        if (customersList[_email].isExist) {
            return false;
        }

        Customer memory newCustomer;
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
            string[] memory ways = ordersList[orderID].wayEmails;
            if (findOrderByWays(ways, _email)) {
                orderCount++;
            }
        }

        Order[] memory orders = new Order[](orderCount);
        string[] memory ids = new string[](orderCount);
        uint256 index = 0;

        for (uint256 i = 0; i < orderIDs.length; i++) {
            string memory orderID = orderIDs[i];
            string[] memory ways = ordersList[orderID].wayEmails;
            if (findOrderByWays(ways, _email)) {
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

    function findOrderByWays(
        string[] memory ways,
        string memory _email
    ) internal pure returns (bool) {
        for (uint256 i = 0; i < ways.length; i++) {
            if (compareTwoStrings(ways[i], _email)) {
                return true;
            }
        }
        return false;
    }
}
