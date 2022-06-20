import { Table, Thead, Tr, Th, Td, Tbody, Button } from "@chakra-ui/react";
import React from "react";
import { HiCloudUpload, HiOutlineCheckCircle } from "react-icons/hi";

export default function OrderList({ orderList, onOpen, setOrder }) {
  return (
    <Table variant="simple" mt="4" borderTop={"1px"} pt="4">
      <Thead>
        <Tr>
          <Th>Name and last name</Th>
          <Th>Address</Th>
          <Th>City and phone</Th>
          <Th>Order value</Th>
          <Th>Note</Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {orderList.map((order, index) => {
          return (
            <Tr key={index}>
              <Td>{order.shippingAddress.name}</Td>
              <Td>{order.shippingAddress.address1}</Td>
              <Td>
                {order.shippingAddress.city} - {order.shippingAddress.phone}
              </Td>
              <Td>{order.totalPriceSet.shopMoney.amount} KM</Td>
              <Td>{order.note}</Td>
              <Td>
                <Button
                  colorScheme={order.isExported ? "green" : null}
                  onClick={() => {
                    setOrder(order);
                    onOpen();
                  }}
                >
                  {order.isExported ? (
                    <HiOutlineCheckCircle />
                  ) : (
                    <HiCloudUpload />
                  )}
                </Button>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
