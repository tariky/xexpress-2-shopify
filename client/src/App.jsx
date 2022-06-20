import { useState, useEffect } from "react";
import {
  Heading,
  Box,
  Spinner,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  VStack,
  Text,
  Switch,
} from "@chakra-ui/react";
import OrderList from "./components/OrderList";
import axios from "axios";
import API from "./api";
import zipList from "./zipList";
import ImportDrawer from "./components/ImportDrawer";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [exported, setExporten] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const result = await axios.get(`${API}/api/orders`);
      setOrdersList(
        result.data.orders.edges.map((order) => {
          return { ...order.node, isExported: false };
        })
      );
      setLoading(false);
    }
    fetchOrders();
  }, []);

  return (
    <Box display="flex" flexDir="column" p="4">
      <Box
        display={"flex"}
        flexDirection="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Heading>S2X</Heading>
      </Box>
      {loading ? (
        <Box
          height={"250px"}
          display="flex"
          alignItems={"center"}
          justifyContent="center"
        >
          <Spinner size={"lg"} />
        </Box>
      ) : (
        <OrderList orderList={ordersList} onOpen={onOpen} setOrder={setOrder} />
      )}
      <>
        <ImportDrawer
          order={order}
          isOpen={isOpen}
          onClose={onClose}
          zipList={zipList}
          ordersList={ordersList}
          setOrdersList={setOrdersList}
        />
      </>
    </Box>
  );
}

export default App;
