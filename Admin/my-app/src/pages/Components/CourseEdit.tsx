import React, { useState, useEffect, useCallback } from "react";
import {
  VStack,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  Button,
  SimpleGrid,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { CourseResponse } from "../../services/api-types";
import { courseService } from "../../services/api";

export default function CourseEdit() {
  // Toggle between add/remove/edit tabs
  const [currentTab, setCurrentTab] = useState<string>("create");

  const tabs = [
    { label: "Create courses", id: "create", color: "green" },
    { label: "Edit courses", id: "edit", color: "blue" },
    { label: "Delete courses", id: "delete", color: "red" },
  ];

  // Toast for notifications
  const toast = useToast();

  // Form states
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");

  // Data states
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Form handling
  const handleCreateCourse = async () => {
    if (!courseCode || !courseName) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields before creating a course.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      await courseService.createCourse(courseCode.trim(), courseName.trim());
      toast({
        title: "Course created",
        description: `Course ${courseCode} - ${courseName} created successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error creating course",
        description: "Failed to create course. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setCourseCode("");
      setCourseName("");
    }
    await fetchCourses();
  };
  const handleEditCourse = async () => {
    if (!selectedCourse || !courseName) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields before editing a course.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      await courseService.updateCourseName(
        selectedCourse.trim(),
        courseName.trim()
      );
      toast({
        title: "Course edited",
        description: `Course ${selectedCourse} updated to ${courseName}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error editing course",
        description: "Failed to edit course. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setSelectedCourse("");
      setCourseName("");
    }
    await fetchCourses();
  };

  const handleRemoveCourse = async () => {
    if (!selectedCourse) {
      toast({
        title: "Missing fields",
        description: "Please select a course to delete.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      await courseService.deleteCourse(selectedCourse);
      toast({
        title: "Course deleted",
        description: `Course ${selectedCourse} deleted successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchCourses();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error deleting course",
        description: "Failed to delete course. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setSelectedCourse("");
    }
    await fetchCourses();
  };

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await courseService.getAllCourses();
      setCourses(response);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fetching courses",
        description: "Failed to load courses. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <VStack spacing={4}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} padding={4}>
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            colorScheme={currentTab === tab.id ? tab.color : "gray"}
            variant={currentTab === tab.id ? "solid" : "outline"}
            size="md"
            width="100%"
            onClick={() => setCurrentTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </SimpleGrid>
      <Alert
        status={
          currentTab === "create"
            ? "info"
            : currentTab === "edit"
            ? "warning"
            : "error"
        }
        borderRadius="md"
      >
        <AlertIcon />
        <Text fontSize="sm">
          {currentTab === "create"
            ? "Create new courses to add to the system."
            : currentTab === "edit"
            ? "Edit existing courses"
            : "Delete courses from the system."}
        </Text>
      </Alert>

      <Card variant="outline" padding={4}>
        <CardHeader bg="f7f7f7">
          <Heading size="md" color="gray.700">
            {currentTab === "create"
              ? "Create New Course"
              : currentTab === "edit"
              ? "Edit Existing Course"
              : "Delete Course"}
          </Heading>
        </CardHeader>
        <CardBody>
          {currentTab === "create" && (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} padding={5}>
              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="gray.700">
                  Course Code
                </FormLabel>
                <Input
                  placeholder="Enter course code"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="gray.700">
                  Course Name
                </FormLabel>
                <Input
                  placeholder="Enter course name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </FormControl>
              <Button
                colorScheme="green"
                width="100%"
                onClick={handleCreateCourse}
                isLoading={loading}
              >
                Create Course
              </Button>
            </SimpleGrid>
          )}
          {currentTab === "edit" && (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} padding={5}>
              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="gray.700">
                  Select Course to Edit
                </FormLabel>
                <Select
                  placeholder="Chose course to delete"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  borderColor="gray.300"
                >
                  {courses.map((course) => (
                    <option key={course.courseCode} value={course.courseCode}>
                      {course.courseCode} - {course.courseName}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="gray.700">
                  New Course Name
                </FormLabel>
                <Input
                  placeholder="Enter course name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </FormControl>
              <Button
                colorScheme="blue"
                width="100%"
                onClick={handleEditCourse}
                isLoading={loading}
              >
                Edit Course
              </Button>
            </SimpleGrid>
          )}
          {currentTab === "delete" && (
            <SimpleGrid columns={{ base: 1 }} spacing={6} padding={5}>
              <FormControl isRequired>
                <FormLabel fontWeight="bold" color="gray.700">
                  Select Course to Delete
                </FormLabel>
                <Select
                  placeholder="Chose course to delete"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  borderColor="gray.300"
                >
                  {courses.map((course) => (
                    <option key={course.courseCode} value={course.courseCode}>
                      {course.courseCode} - {course.courseName}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Button
                colorScheme="red"
                width="100%"
                onClick={handleRemoveCourse}
                isLoading={loading}
              >
                Delete Course
              </Button>
            </SimpleGrid>
          )}
        </CardBody>
      </Card>
    </VStack>
  );
}
