import React from "react";
import Profile from "./Profile";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/UserContext";
import { applicationAPI, candidateAPI, CourseResponse } from "@/services/api";
import {
  Box,
  Stack,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Card,
  Input,
  Button,
  Center,
  Text,
  RadioGroup,
  Radio,
  Select,
  useToast,
  Drawer,
  DrawerCloseButton,
  DrawerHeader,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Avatar,
} from "@chakra-ui/react";
import { ApplicationResponse } from "@/services/api";

interface TutorApplicationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TutorApplication({
  isOpen,
  onClose,
}: TutorApplicationProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState<number | null>(null);

  const toast = useToast();

  // useStates for the form inputs
  const [availability, setAvailability] = useState("");
  const [role, setRole] = useState("");
  const [course, setCourse] = useState("");
  const [previousRoles, setPreviousRoles] = useState("");
  const [skills, setSkills] = useState("");
  const [academicCredentials, setAcademicCredentials] = useState("");

  // useState to track the current page
  const [currentPage, setCurrentPage] = useState("applyToTutor");

  // functions to change current page
  const handleViewApplications = () => {
    setCurrentPage("viewApplications");
    onClose();
  };

  const handleApplyToTutor = () => {
    setCurrentPage("applyToTutor");
    onClose();
  };

  const handleProfile = () => {
    setCurrentPage("profile");
    onClose();
  };

  // useState to show tutor applications
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);

  // useEffect to set applications useState at startup
  useEffect(() => {
    const fetchApplications = async () => {
      console.log("attempting to fetch applications");
      if (user?.email) {
        try {
          const data = await applicationAPI.getApplications(user.email);
          const candidate = await candidateAPI.getCandidate(user.email);
          setApplications(data);
          setRating(candidate.rating);
          console.log("rating", candidate.rating);
          console.log(data);
        } catch (error) {
          console.error("Failed to fetch applications", error);
        }
      }
    };

    fetchApplications();
  }, [user?.email]);

  // useEffect to fetch courses for the select input
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await candidateAPI.getCourses();
        setCourses(response);
      } catch (error: unknown) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to fetch courses",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchCourses();
  }, [toast]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If for some reason the user is not logged in, we want to show an error message (this should never happen, but good to be safe)
    if (!user?.email) {
      toast({
        title: "Error",
        description: "User email not found",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // Format data in a way that the API expects
      // React validation is done in the form, so we don't need to check for empty fields etc.
      const applicationData = {
        candidateEmail: user?.email,
        courseCode: course,
        roleType: role as "Tutor" | "Lab Assistant",
        availability: availability as "Part Time" | "Full Time",
        skills,
        previousRoles: previousRoles || "",
        academicCredentials,
      };

      // Call the API to create the application
      await candidateAPI.createApplication(applicationData);

      // Show success toast
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      // Refresh the applications list
      const updatedApplications = await applicationAPI.getApplications(
        user.email
      );
      setApplications(updatedApplications);

      // reset the states for the form
      setAvailability("");
      setRole("");
      setCourse("");
      setPreviousRoles("");
      setSkills("");
      setAcademicCredentials("");
    } catch (error: unknown) {
      toast({
        title: "Application failed",
        description:
          error instanceof Error
            ? error.message
            : "Application for this role already exists",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      marginTop="40px"
      marginLeft="40px"
      marginRight="40px"
      marginBottom="150px"
    >
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Navigation</DrawerHeader>
          <DrawerBody>
            <Button
              colorScheme="blue"
              marginTop="1px"
              variant="link"
              onClick={handleApplyToTutor}
            >
              Apply to be a tutor
            </Button>
            <Button
              colorScheme="blue"
              marginTop="1px"
              variant="link"
              onClick={handleViewApplications}
            >
              View previous applications
            </Button>
            <Button
              colorScheme="blue"
              marginTop="1px"
              variant="link"
              onClick={handleProfile}
            >
              View profile
            </Button>
          </DrawerBody>
          <DrawerFooter>
            <VStack spacing={2} align="stretch">
              <Text fontSize="lg" fontWeight="bold">
                Logged in as: {user?.firstName + " " + user?.lastName}
              </Text>
              <Text fontSize="sm" fontWeight="bold">
                {user?.role === "candidate" ? <>Candidate</> : <>Lecturer</>}
              </Text>
            </VStack>
            <Avatar
              bg="blue.500"
              name={user?.firstName + " " + user?.lastName}
              src="https://bit.ly/broken-link"
              marginLeft={4}
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <VStack as="header" spacing={6} marginTop={50} marginBottom={5}>
        <Text as="h1" fontSize="4xl" fontWeight="bold" textAlign="center">
          Hi, {user?.firstName}!
        </Text>
        {currentPage != "profile" && (
          <>
            {rating == 0 ? (
              <Text as="h2" fontSize="2xl" fontWeight="bold" textAlign="center">
                You have not been rated yet
              </Text>
            ) : (
              <Text as="h2" fontSize="2xl" fontWeight="bold" textAlign="center">
                Your current candidate rating is: {rating}
              </Text>
            )}
          </>
        )}
        {currentPage == "applyToTutor" && (
          <Text
            as="h2"
            fontSize="2xl"
            fontWeight="medium"
            textAlign="center"
            color="gray.600"
          >
            Please fill out the following application to apply for a tutor or
            lab assistant role.
          </Text>
        )}
      </VStack>
      {currentPage == "applyToTutor" ? (
        <Center>
          <Stack spacing="3">
            <Card variant="unstytled" bg="#f7f7f7" maxWidth={400}>
              <form onSubmit={handleFormSubmit}>
                <Stack spacing={3} padding={3}>
                  <Card
                    bg="#f7f7f7"
                    variant="unstyled"
                    borderColor="#e8e8e8"
                    padding={4}
                    maxWidth={400}
                  >
                    <FormControl isRequired>
                      <FormLabel as="legend">Availability</FormLabel>
                      <RadioGroup
                        defaultValue="Part Time"
                        value={availability}
                        onChange={(value) => setAvailability(value)}
                      >
                        <HStack spacing="24px">
                          <Radio value="Part Time">Part Time</Radio>
                          <Radio value="Full Time">Full Time</Radio>
                        </HStack>
                      </RadioGroup>
                    </FormControl>
                  </Card>
                  <Card
                    bg="#f7f7f7"
                    variant="unstyled"
                    borderColor="#e8e8e8"
                    padding={4}
                    maxWidth={400}
                  >
                    <FormControl isRequired>
                      <FormLabel as="legend">Role</FormLabel>
                      <RadioGroup
                        defaultValue="Tutor"
                        value={role}
                        onChange={(value) => setRole(value)}
                      >
                        <HStack spacing="24px">
                          <Radio value="Tutor">Tutor</Radio>
                          <Radio value="Lab Assistant">Lab Assistant</Radio>
                        </HStack>
                      </RadioGroup>
                    </FormControl>
                  </Card>
                  <Card
                    bg="#f7f7f7"
                    variant="unstyled"
                    borderColor="#e8e8e8"
                    padding={4}
                    maxWidth={400}
                  >
                    <FormControl isRequired>
                      <FormLabel>Course</FormLabel>
                      <Select
                        bg="white"
                        placeholder="Select course"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                      >
                        {courses.map((course) => (
                          <option
                            key={course.courseCode}
                            value={course.courseCode}
                          >
                            {course.courseName + " (" + course.courseCode + ")"}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </Card>
                  <Card
                    bg="#f7f7f7"
                    variant="unstyled"
                    borderColor="#e8e8e8"
                    padding={4}
                    maxWidth={400}
                  >
                    <FormControl>
                      <FormLabel>Previous roles</FormLabel>
                      <Input
                        bg="white"
                        placeholder="List previous roles (if any)"
                        value={previousRoles}
                        onChange={(e) => setPreviousRoles(e.target.value)}
                      />
                    </FormControl>
                  </Card>
                  <Card
                    bg="#f7f7f7"
                    variant="unstyled"
                    borderColor="#e8e8e8"
                    padding={4}
                    maxWidth={400}
                  >
                    <FormControl isRequired>
                      <FormLabel>Skills</FormLabel>
                      <Input
                        bg="white"
                        placeholder="List applicable skills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                      />
                    </FormControl>
                  </Card>
                  <Card
                    bg="#f7f7f7"
                    variant="unstyled"
                    borderColor="#e8e8e8"
                    padding={4}
                    maxWidth={400}
                  >
                    <FormControl isRequired>
                      <FormLabel>Academic Credentials</FormLabel>
                      <Input
                        bg="white"
                        placeholder="List academic credentials"
                        value={academicCredentials}
                        onChange={(e) => setAcademicCredentials(e.target.value)}
                      />
                    </FormControl>
                  </Card>
                  <Card
                    bg="#f7f7f7"
                    variant="unstyled"
                    borderColor="#e8e8e8"
                    padding={4}
                    maxWidth={400}
                  >
                    <Button type="submit" colorScheme="blue" width="stretch">
                      Submit Application
                    </Button>
                  </Card>
                </Stack>
              </form>
            </Card>
          </Stack>
        </Center>
      ) : currentPage == "viewApplications" ? (
        <Center>
          <VStack spacing="5px">
            <Text
              as="h2"
              fontSize="2xl"
              fontWeight="medium"
              textAlign="center"
              color="gray.600"
            >
              Here are your current applications
            </Text>
            {applications.map((application) =>
              application.candidate.email === user?.email ? (
                <Card
                  bg="#f7f7f7"
                  variant="unstyled"
                  borderColor="#e8e8e8"
                  padding={4}
                  width={400}
                  _hover={{ bg: "#e8e8e8" }}
                  key={`${application.applicationId}-${application.course.courseCode}`}
                >
                  <Text fontWeight="550">
                    {application.course.courseName} - {application.roleType} -{" "}
                    {application.availability}
                  </Text>
                  <Text>
                    Application Status:
                    {application.status === "accepted" ? (
                      <Text color="green.500" fontWeight="bold">
                        Accepted
                      </Text>
                    ) : application.status === "pending" ? (
                      <Text color="orange.500" fontWeight="bold">
                        Pending
                      </Text>
                    ) : application.status === "rejected" ? (
                      <Text color="red.500" fontWeight="bold">
                        Rejected
                      </Text>
                    ) : null}
                  </Text>
                </Card>
              ) : null
            )}
          </VStack>
        </Center>
      ) : currentPage == "profile" ? (
        <Profile />
      ) : null}
    </Box>
  );
}
