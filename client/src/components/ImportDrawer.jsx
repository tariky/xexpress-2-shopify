import React, { useState } from "react";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  VStack,
  Text,
  Switch,
  useToast,
} from "@chakra-ui/react";
import Select from "react-select";
import axios from "axios";
import API from "../api";

export default function ImportDrawer({
  order,
  onClose,
  isOpen,
  zipList,
  ordersList,
  setOrdersList,
}) {
  const [otkupSwitch, setOtkupSwitch] = useState(true);
  const [noteSwitch, setNoteSwitch] = useState(false);
  const [zip, setZip] = useState(null);
  const toast = useToast();

  async function import2ShippingCompany() {
    const postData = {
      sifraExt: order.name,
      uslugaSifra: 1,
      pttPrim: zip,
      nacinPlacanja: 9,
      nazivPrim: order.shippingAddress.name,
      kontaktPrim: order.shippingAddress.name,
      telefonPrim: order.shippingAddress.phone,
      adresaPrim: order.shippingAddress.address1,
      duzina: 0,
      sirina: 0,
      visina: 0,
      tezina: 1,
      opisPosiljke: "Igracke",
      otkupnina: otkupSwitch,
      iznosOtkupnine: Number(order.totalPriceSet.shopMoney.amount),
      vrednostPosiljke: Number(order.totalPriceSet.shopMoney.amount),
    };

    console.log(postData);

    const importedOrder = await axios.post(`${API}/api/toexp`, postData);
    const { status, data } = importedOrder;

    if (status === 200) {
      console.log(data);
      if (data.status === "OK") {
        if (data.action === "NEW") {
          toast({
            title: "Imported",
            description: `ID: ${data.sifra}`,
            duration: 3000,
            status: "success",
          });
        } else if (data.action === "UPDATE") {
          toast({
            title: "Already imported",
            description: `Order already imported. Check X-Express app.`,
            duration: 3000,
            status: "warning",
          });
        }

        flagOrderAsExpored(order.legacyResourceId);
      }
    }
    setZip(null);
    onClose();
  }

  function flagOrderAsExpored(id) {
    const flaggedOrderList = ordersList.map((ord) => {
      if (ord.legacyResourceId === id) {
        console.log(ord);
        return { ...ord, isExported: true };
      } else {
        return ord;
      }
    });
    setOrdersList(flaggedOrderList);
  }
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Import to X-Express</DrawerHeader>

        <DrawerBody>
          <VStack>
            {order !== null && (
              <>
                <VStack width={"100%"}>
                  <Text>City</Text>
                  <Input bg="white" defaultValue={order.shippingAddress.city} />
                  <Text>Zip</Text>
                  <Box width={"100%"}>
                    <Select
                      options={zipList}
                      placeholder="Select city"
                      onChange={(e) => {
                        setZip(Number(e.value));
                      }}
                    />
                  </Box>
                </VStack>
                {zip !== null ? (
                  <>
                    <Text>Name and last name</Text>
                    <Input defaultValue={order.shippingAddress.name} />
                    <Text>Address</Text>
                    <Input defaultValue={order.shippingAddress.address1} />
                    <Text>Order value</Text>
                    <Input
                      defaultValue={Number(
                        order.totalPriceSet.shopMoney.amount
                      )}
                    />
                    <Text>Note</Text>
                    <Input defaultValue={order.note} />
                    <Box
                      display={"flex"}
                      flexDir="row"
                      alignItems={"center"}
                      width={"100%"}
                      mt="2"
                    >
                      <Switch
                        isChecked={noteSwitch}
                        onChange={() => setNoteSwitch(!noteSwitch)}
                      />
                      <Text ml="4">Note</Text>
                    </Box>
                    <Box
                      display={"flex"}
                      flexDir="row"
                      alignItems={"center"}
                      width={"100%"}
                      mt="2"
                    >
                      <Switch
                        isChecked={otkupSwitch}
                        onChange={() => setOtkupSwitch(!otkupSwitch)}
                      />
                      <Text ml="4">Amount to pay</Text>
                    </Box>
                  </>
                ) : (
                  <Text pt="4" fontWeight={"black"} textAlign="center">
                    Please select city before import!
                  </Text>
                )}
              </>
            )}
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          {zip !== null && (
            <Button
              colorScheme="green"
              onClick={() => {
                import2ShippingCompany();
              }}
            >
              Import
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
