import React from "react";
import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  Text,
  Badge,
  VStack,
  HStack,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Heading,
  Icon,
} from "@chakra-ui/react";
import {
  SearchIcon,
  TimeIcon,
  EmailIcon,
  StarIcon,
  InfoIcon,
  CheckCircleIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { ApplicationResponse, applicationAPI } from "@/services/api";

interface LecturerViewProps {
  applications: ApplicationResponse[];
  onApplicationUpdate?: () => void;
}

export default function LecturerView({
  applications,
  onApplicationUpdate,
}: LecturerViewProps) {
  // Toast for success/error messages
  const toast = useToast();

  // useState to store selected application
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationResponse | null>(null);

  // useStates for searching and sorting
  const [searchSelection, setSearchSelection] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortQuery, setSortQuery] = useState<string>("name");

  // useMemo to filter applications based on search query and selection
  // sorting the applications every re-render made the site quite laggy
  const filteredApplications = useMemo(() => {
    // Filtering applications based on search terms

    // Safe guard to ensure applications is an array
    if (!applications || !Array.isArray(applications)) {
      return [];
    }
    const filtered = applications.filter((application) => {
      if (searchSelection === "name") {
        return (
          application.candidate.firstName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          application.candidate.lastName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      }
      // If user selects course, we check if the course code OR name matches their query
      else if (searchSelection === "course") {
        return (
          application.course.courseCode
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          application.course.courseName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      }
      // If user selects availability, we check if the availability matches their query
      else if (searchSelection === "availability") {
        return application.availability
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      }
      // If user selects skills, we check if the skills match their query
      else if (searchSelection === "skills") {
        return application.skills
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      }
      // If user selects nothing and still uses search bar, we default to searching by name
      // This is more so done so that when the page is intially rendered, applications are shown
      else if (searchSelection === "") {
        return (
          application.candidate.firstName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          application.candidate.lastName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      }
      // Just in case, we return false
      else {
        return false;
      }
    });
    // Sorting is now only done when the applications, search or sorting query changes
    const sorted = [...filtered];
    if (sortQuery === "name") {
      sorted.sort((a, b) => {
        const nameA =
          a.candidate.firstName.toLowerCase() +
          " " +
          a.candidate.lastName.toLowerCase();
        const nameB =
          b.candidate.firstName.toLowerCase() +
          " " +
          b.candidate.lastName.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else if (sortQuery === "course") {
      sorted.sort((a, b) => {
        const courseA = a.course.courseCode.toLowerCase();
        const courseB = b.course.courseCode.toLowerCase();
        return courseA.localeCompare(courseB);
      });
    }
    return sorted;
  }, [applications, searchSelection, searchQuery, sortQuery]);

  // useDislosure for modals
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Function to handle opening application modal
  const handleViewApplication = (application: ApplicationResponse) => {
    // If the application is already selected, close the modal. This is done so that the user has the option to click off the modal to close it.
    setSelectedApplication(
      selectedApplication === application ? null : application
    );
    onOpen();
  };

  // Function to handle closing application modal
  const handleCloseApplication = () => {
    setSelectedApplication(null);
    onClose();
  };

  // Function to handle accepting application
  const handleApplicationAccept = async (application: ApplicationResponse) => {
    // Call the API to accept the application
    try {
      await applicationAPI.acceptApplication(
        application.candidate.email,
        application.applicationId
      );
    } catch (error) {
      console.error("Error accepting application:", error);
      toast({
        title: "Error",
        description: "There was an error accepting the application.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    // Alert user that application was accepted
    toast({
      title: "Application Accepted",
      description: `${application.candidate.firstName} ${application.candidate.lastName}'s application has been accepted.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    handleCloseApplication();

    // Refresh applications
    if (onApplicationUpdate) {
      onApplicationUpdate();
    }
  };

  return (
    <>
      <Heading as="h1" textAlign="center" margin="40px">
        View Applications
      </Heading>
      <Box
        marginTop="40px"
        marginLeft="40px"
        marginRight="40px"
        marginBottom="150px"
      >
        <Box
          maxWidth="330px"
          marginBottom="40px"
          bg="white"
          padding="5"
          borderRadius="lg"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.200"
        >
          <VStack spacing={4} align="stretch" marginBottom="10px">
            <Box>
              <Text
                fontSize="md"
                fontWeight="bold"
                color="gray.700"
                marginBottom="3"
              >
                Sort Applications
              </Text>
              <HStack spacing={4}>
                <Box
                  as="button"
                  padding="2"
                  borderRadius="md"
                  background={sortQuery === "name" ? "blue.100" : "gray.50"}
                  border="1px solid"
                  borderColor={sortQuery === "name" ? "blue.500" : "gray.200"}
                  onClick={() => setSortQuery("name")}
                  transition="all 0.2s"
                  _hover={{ borderColor: "blue.400" }}
                  flex={1}
                >
                  <Text
                    fontSize="sm"
                    fontWeight={sortQuery === "name" ? "bold" : "medium"}
                    color={sortQuery === "name" ? "blue.700" : "gray.600"}
                  >
                    By Name
                  </Text>
                </Box>
                <Box
                  as="button"
                  padding="2"
                  borderRadius="md"
                  background={sortQuery === "course" ? "blue.100" : "gray.50"}
                  border="1px solid"
                  borderColor={sortQuery === "course" ? "blue.500" : "gray.200"}
                  onClick={() => setSortQuery("course")}
                  transition="all 0.2s"
                  _hover={{ borderColor: "blue.400" }}
                  flex={1}
                >
                  <Text
                    fontSize="sm"
                    fontWeight={sortQuery === "course" ? "bold" : "medium"}
                    color={sortQuery === "course" ? "blue.700" : "gray.600"}
                  >
                    By Course
                  </Text>
                </Box>
              </HStack>
            </Box>
            <Box height="1px" bg="gray.200"></Box>
            <Box>
              <Text
                fontSize="md"
                fontWeight="bold"
                color="gray.700"
                marginBottom="3"
              >
                Filter Applications
              </Text>
              <VStack spacing={4}>
                <Select
                  placeholder="Select search category"
                  value={searchSelection}
                  onChange={(e) => setSearchSelection(e.target.value)}
                  borderColor="gray.300"
                  bg="white"
                >
                  <option value="name">Name</option>
                  <option value="course">Course</option>
                  <option value="availability">Availability</option>
                  <option value="skills">Skills</option>
                </Select>
                <InputGroup>
                  <InputLeftElement>
                    <SearchIcon color="gray.500" />
                  </InputLeftElement>
                  <Input
                    placeholder={`Search by ${searchSelection || "name"}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    borderColor="gray.300"
                    background="white"
                  ></Input>
                </InputGroup>
              </VStack>
            </Box>
          </VStack>
        </Box>
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={6} minChildWidth="280px">
          {/* Loop through filtered applications and display card for each one */}
          {filteredApplications.map((application, index) => (
            <Card
              key={index}
              bg={application.status == "accepted" ? "green.50" : "white"}
              borderColor={
                application.status == "accepted" ? "green.300" : "gray.200"
              }
              borderWidth="1px"
              padding={2}
              boxShadow="md"
              _hover={{ boxShadow: "xl", transform: "translateY(-4px)" }}
              transition="all 0.3s ease-in-out"
              position="relative"
              overflow="hidden"
            >
              <Badge
                position="absolute"
                top={2}
                right={2}
                colorScheme={
                  application.status === "accepted"
                    ? "green"
                    : application.status === "pending"
                    ? "yellow"
                    : "red"
                }
                borderRadius="full"
                fontSize="xs"
                fontWeight="bold"
              >
                {application.status === "accepted" ? "ACCEPTED" : "PENDING"}
              </Badge>
              <Text fontSize="lg" fontWeight="bold">
                {application.candidate.firstName +
                  " " +
                  application.candidate.lastName}
              </Text>
              <Text fontWeight="500">{application.roleType}</Text>
              <Text fontSize="sm" fontWeight="semibold">
                {application.course.courseName}
              </Text>
              <Text fontSize="xs">{application.course.courseCode}</Text>
              <HStack spacing={2} marginTop={2} marginBottom={2}>
                <Icon as={TimeIcon} color="gray.500" />
                <Text fontSize="sm" color="gray.600">
                  {application.availability}
                </Text>
              </HStack>
              <Button
                maxWidth="100%"
                colorScheme="blue"
                onClick={() => handleViewApplication(application)}
              >
                View Application
              </Button>
            </Card>
          ))}
        </SimpleGrid>
        {/* If no applications, tell the user this */}
        {filteredApplications.length === 0 ? (
          <Text fontSize="xl" textAlign="center">
            No applications found.
          </Text>
        ) : null}
      </Box>
      {selectedApplication && (
        <Modal isOpen={isOpen} onClose={handleCloseApplication}>
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent borderRadius="xl">
            <ModalHeader
              bg="gray.50"
              borderTopRadius="xl"
              borderBottom="1px solid"
              borderBottomColor="gray.200"
            >
              <Text>
                {selectedApplication.candidate.firstName}{" "}
                {selectedApplication.candidate.lastName}
              </Text>
              <Badge
                colorScheme={
                  selectedApplication.status === "accepted"
                    ? "green"
                    : selectedApplication.status === "pending"
                    ? "yellow"
                    : "red"
                }
                borderRadius="full"
                fontSize="xs"
              >
                {selectedApplication.status === "accepted"
                  ? "ACCEPTED"
                  : selectedApplication.status === "pending"
                  ? "PENDING"
                  : "REJECTED"}
              </Badge>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing="6" align="stretch">
                <SimpleGrid columns={1} spacing="4">
                  <Box
                    bg="gray.100"
                    padding="4"
                    borderRadius="lg"
                    borderLeft="4px solid"
                    borderLeftColor="blue.400"
                  >
                    <HStack spacing={2} marginBottom={2}>
                      <Icon as={InfoIcon} />
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="blue.800"
                      >
                        Course
                      </Text>
                    </HStack>
                    <Text fontSize="md" fontWeight="bold" color="blue.900">
                      {selectedApplication.course.courseName}
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" color="blue.900">
                      {selectedApplication.course.courseCode}
                    </Text>
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={2} spacing="4">
                  <Box
                    bg="gray.100"
                    padding="4"
                    borderRadius="lg"
                    borderLeft="4px solid"
                    borderLeftColor="purple.400"
                  >
                    <HStack spacing={2} marginBottom={2}>
                      <Icon as={CheckCircleIcon} />
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="blue.800"
                      >
                        Role
                      </Text>
                    </HStack>
                    <Text fontSize="lg" fontWeight="bold" color="blue.900">
                      {selectedApplication.roleType}
                    </Text>
                  </Box>
                  <Box
                    bg="gray.100"
                    padding="4"
                    borderRadius="lg"
                    borderLeft="4px solid"
                    borderLeftColor="green.400"
                  >
                    <HStack spacing={2} marginBottom={2}>
                      <Icon as={TimeIcon} />
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="blue.800"
                      >
                        Availability
                      </Text>
                    </HStack>
                    <Text fontSize="md" fontWeight="bold" color="blue.800">
                      {selectedApplication.availability}
                    </Text>
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={1} spacing="4">
                  <Box
                    bg="gray.100"
                    padding="4"
                    borderRadius="lg"
                    borderLeft="4px solid"
                    borderLeftColor="orange.400"
                  >
                    <HStack spacing={2} marginBottom={2}>
                      <Icon as={StarIcon} />
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="blue.800"
                      >
                        Skills
                      </Text>
                    </HStack>
                    <Text fontSize="md" fontWeight="bold" color="blue.900">
                      {selectedApplication.skills}
                    </Text>
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={1} spacing="4">
                  <Box
                    bg="gray.100"
                    padding="4"
                    borderRadius="lg"
                    borderLeft="4px solid"
                    borderLeftColor="teal.400"
                  >
                    <HStack spacing={2} marginBottom={2}>
                      <Icon as={EditIcon} />
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="blue.800"
                      >
                        Previous Roles
                      </Text>
                    </HStack>
                    <Text fontSize="md" fontWeight="bold" color="blue.900">
                      {selectedApplication.previousRoles ||
                        "No previous experience."}
                    </Text>
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={1} spacing="4">
                  <Box
                    bg="gray.100"
                    padding="4"
                    borderRadius="lg"
                    borderLeft="4px solid"
                    borderLeftColor="indigo.400"
                  >
                    <HStack spacing={2} marginBottom={2}>
                      <Icon as={CheckCircleIcon} />
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="blue.800"
                      >
                        Academic Credentials
                      </Text>
                    </HStack>
                    <Text fontSize="md" fontWeight="bold" color="blue.900">
                      {selectedApplication.academicCredentials}
                    </Text>
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={1} spacing="4">
                  <Box
                    bg="gray.100"
                    padding="4"
                    borderRadius="lg"
                    borderLeft="4px solid"
                    borderLeftColor="gray.400"
                  >
                    <HStack spacing={2} marginBottom={2}>
                      <Icon as={EmailIcon} />
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="blue.800"
                      >
                        Contact Information
                      </Text>
                    </HStack>
                    <Text fontSize="md" fontWeight="bold" color="blue.900">
                      {selectedApplication.candidate.email}
                    </Text>
                  </Box>
                </SimpleGrid>
              </VStack>
            </ModalBody>
            <ModalFooter>
              {/* If the application has been accepted, we give it a green background */}
              {!(selectedApplication.status == "accepted") ? (
                <Button
                  colorScheme="green"
                  marginRight={3}
                  onClick={() => handleApplicationAccept(selectedApplication)}
                >
                  Accept
                </Button>
              ) : null}
              <Button
                colorScheme="blue"
                marginRight={3}
                onClick={handleCloseApplication}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
