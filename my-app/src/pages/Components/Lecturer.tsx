import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/UserContext";
import LecturerRanking from "./LecturerRanking";
import LecturerView from "./LecturerView";
import LecturerStatistics from "./LecturerStatistics";
import Profile from "./Profile";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Avatar,
  Drawer,
  DrawerOverlay,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerCloseButton,
  Spinner,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import {
  applicationAPI,
  lecturerAPI,
  ApplicationResponse,
} from "@/services/api";

// Props for the Lecturer component
// We need these for the drawer which we use for navigation
interface LecturerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Lecturer({ isOpen, onClose }: LecturerProps) {
  // Toast for user feedback
  const toast = useToast();

  // Grabbing user context
  const { user } = useAuth();

  // useState for current page
  const [currentPage, setCurrentPage] = useState<string>("view");

  // useState for loading state
  const [loading, setLoading] = useState<boolean>(true);

  // functions to change current page
  const handleViewApplicants = () => {
    setCurrentPage("view");
    onClose();
  };

  const handleRankApplicants = () => {
    setCurrentPage("rank");
    onClose();
  };

  const handleStatistics = () => {
    setCurrentPage("statistics");
    onClose();
  };

  const handleProfile = () => {
    setCurrentPage("profile");
    onClose();
  };

  // useState and useEffect to grab applications from local storage
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);

  // Refresh function for when application is accepted
  // This gets called from the LecturerView component, as we want to update/refresh the applications when one gets accepted
  const refreshApplications = async () => {
    if (user?.email) {
      try {
        setLoading(true);
        // We need to grab the lecturer info and the courses they are assigned to
        const lecturerInfo = await lecturerAPI.getLecturer(user?.email);
        const lecturerCourses = lecturerInfo.assignedCourseCodes.split(",");

        // courseApplications is just an array of Application Responses from the API
        const courseApplications: ApplicationResponse[] = [];
        // We want to append all applications for each course the lecturer is assigned to
        for (const courseCode of lecturerCourses) {
          const foundApplications =
            await applicationAPI.getApplicationsByCourse(courseCode);
          courseApplications.push(...foundApplications);
        }
        // We set the applications state to the courseApplications array
        setApplications(courseApplications);
        // And stop the loading state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Error",
          description: "Failed to fetch applications.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    }
  };

  // useEffect to set applications from backend
  useEffect(() => {
    setLoading(true);
    const fetchApplications = async () => {
      try {
        console.log("attempting to fetch applications for lecturer");
        // We want to make sure that the lecturer's email exists before fetching applications
        if (user?.email) {
          // grab the lecturer info and then the courses they're assigned to
          const lecturerInfo = await lecturerAPI.getLecturer(user?.email);
          const lecturerCourses = lecturerInfo.assignedCourseCodes.split(",");
          console.log(`Lecturer's courses: ${lecturerCourses}`);
          // This logic is all the same as the refresh applications function
          const courseApplications: ApplicationResponse[] = [];

          for (const courseCode of lecturerCourses) {
            const foundApplications =
              await applicationAPI.getApplicationsByCourse(courseCode);
            courseApplications.push(...foundApplications);
          }
          console.log(courseApplications);
          setApplications(courseApplications);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Error",
          description: "Failed to fetch applications.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user?.email, toast]);

  // If we are loading data from the backend, we want to display a spinner just to let the user know that something is happening
  if (loading) {
    return (
      <Box>
        <Heading as="h1" textAlign="center" margin="40px">
          Loading applications...
        </Heading>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          size="xl"
          margin="auto"
          display="block"
        />
      </Box>
    );
  }

  return (
    <>
      <Box>
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
                onClick={handleViewApplicants}
              >
                View tutor applications
              </Button>
              <Button
                colorScheme="blue"
                marginTop="1px"
                variant="link"
                onClick={handleRankApplicants}
              >
                Rank tutor applications
              </Button>
              <Button
                colorScheme="blue"
                marginTop="1px"
                variant="link"
                onClick={handleStatistics}
              >
                View tutor statistics
              </Button>
              <Button
                colorScheme="blue"
                marginTop="1px"
                variant="link"
                onClick={handleProfile}
                display="block"
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
                  {user?.role === "candidate" ? <>Tutor</> : <>Lecturer</>}
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
        {/* Conditionally rendering page based on useState */}
        {currentPage === "view" && (
          <LecturerView
            applications={applications}
            onApplicationUpdate={refreshApplications}
          />
        )}
        {currentPage === "rank" && (
          <LecturerRanking applications={applications} />
        )}
        {currentPage === "statistics" && <LecturerStatistics />}
        {currentPage === "profile" && <Profile />}
      </Box>
    </>
  );
}
