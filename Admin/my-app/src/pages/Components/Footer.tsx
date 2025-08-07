import React from "react";
import { Box, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box
      bg="#8ecae6"
      color="black"
      p={4}
      textAlign="center"
      marginTop="auto"
      position="fixed"
      width="100%"
      bottom="0"
    >
      <Text fontSize="sm">Trenton Ma and James Manson</Text>
    </Box>
  );
}
