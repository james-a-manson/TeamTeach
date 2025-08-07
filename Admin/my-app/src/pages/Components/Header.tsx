import React from "react";
import { Box, Flex, Spacer, Button, Image, useToast } from "@chakra-ui/react";

interface HeaderProps {
  toggleLogin: () => void;
}

export default function Header({ toggleLogin }: HeaderProps) {
  const toast = useToast();

  const handleLogout = () => {
    toggleLogin();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <div>
      <Box bg="#8ecae6" w="100%" p={4} color="#023047">
        <Flex alignItems="center">
          <Image src={"/teamteach.png"} alt="TeamTeach" maxWidth="200px" />
          <Spacer />
          <Button colorScheme="blue" variant="solid" onClick={handleLogout}>
            Log Out
          </Button>
        </Flex>
      </Box>
    </div>
  );
}
