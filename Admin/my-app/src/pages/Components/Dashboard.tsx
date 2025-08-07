import React, { useState } from "react";
import {
  Box,
  SimpleGrid,
  VStack,
  Heading,
  Text,
  Button,
  Container,
} from "@chakra-ui/react";
import LecturerAssignment from "./LecturerAssignment";
import CourseEdit from "./CourseEdit";
import CandidateEdit from "./CandidateEdit";
import Reports from "./Reports";

export default function Dashboard() {
  // useState for active tab
  const [activeTab, setActiveTab] = useState<string>("lecturers-edit");

  // array of nav items for sidebar
  const navItems = [
    { id: "lecturers-edit", label: "Assign Lecturers" },
    { id: "course-edit", label: "Manage Courses" },
    { id: "candidate-edit", label: "Manage Candidates" },
    { id: "reports", label: "Generate Reports" },
  ];

  return (
    <>
      <Box minHeight="100vh">
        <VStack spacing={2} marginTop={8} marginBottom={4}>
          <Heading as="h1" size="xl" color="gray.700" marginBottom={4}>
            Admin Dashboard
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Manage TeachTeam system
          </Text>
        </VStack>
        <Container maxWidth="1400px" paddingLeft={6} paddingRight={6}>
          <VStack spacing={6}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} p={4}>
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  colorScheme="blue"
                  variant={activeTab === item.id ? "solid" : "outline"}
                  fontWeight={activeTab === item.id ? "bold" : "normal"}
                  size="lg"
                  height="60px"
                  onClick={() => setActiveTab(item.id)}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </SimpleGrid>
            <Box width="100%">
              {activeTab === "lecturers-edit" && <LecturerAssignment />}
              {activeTab === "course-edit" && <CourseEdit />}
              {activeTab === "candidate-edit" && <CandidateEdit />}
              {activeTab === "reports" && <Reports />}
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
}
