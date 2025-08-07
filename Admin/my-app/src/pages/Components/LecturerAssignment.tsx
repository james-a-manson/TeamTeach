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
  Select,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { LecturerResponse, CourseResponse } from "../../services/api-types";
import { lecturerService, courseService } from "../../services/api";

export default function LecturerAssignment() {
  // Toggle between add/remove modes
  const [addCourse, setAddCourse] = useState(true);

  // Toast for notifications
  const toast = useToast();

  // Form states
  const [selectedLecturer, setSelectedLecturer] = useState<LecturerResponse>();
  const [selectedCourse, setSelectedCourse] = useState("");

  // Data states
  const [lecturers, setLecturers] = useState<LecturerResponse[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Data states for form options
  const [coursesToRemove, setCoursesToRemove] = useState<CourseResponse[]>([]);
  const [coursesToAdd, setCoursesToAdd] = useState<CourseResponse[]>([]);

  // Form handling
  const handleAssignCourse = async () => {
    if (!selectedLecturer || !selectedCourse) {
      toast({
        title: "Missing fields",
        description: "Please select a lecturer and a course.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);

      let newCoursesCodes;
      if (
        !selectedLecturer.assignedCourseCodes ||
        selectedLecturer.assignedCourseCodes.trim() === ""
      ) {
        newCoursesCodes = [selectedCourse];
      } else {
        newCoursesCodes = [
          ...selectedLecturer.assignedCourseCodes
            .split(",")
            .map((code) => code.trim()),
          selectedCourse,
        ];
      }
      const updatedLecturer = await lecturerService.updateLecturerCourses(
        selectedLecturer.email,
        newCoursesCodes
      );
      setSelectedLecturer(updatedLecturer);
      toast({
        title: "Course Assigned",
        description: `Successfully assigned ${selectedCourse} to ${selectedLecturer.firstName} ${selectedLecturer.lastName}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error assigning course",
        description: "Could not assign course. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setSelectedCourse("");
    }
  };

  const handleRemoveCourse = async () => {
    if (!selectedLecturer || !selectedCourse) {
      toast({
        title: "Missing fields",
        description: "Please select a lecturer and a course.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const updatedLecturer = await lecturerService.updateLecturerCourses(
        selectedLecturer.email,
        selectedLecturer.assignedCourseCodes
          .split(",")
          .filter((code) => code !== selectedCourse)
      );

      if (updatedLecturer) {
        setSelectedLecturer(updatedLecturer);
        setSelectedCourse("");
      }

      toast({
        title: "Course Removed",
        description: `Successfully removed ${selectedCourse} from ${selectedLecturer.firstName} ${selectedLecturer.lastName}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error removing course",
        description: "Could not remove course. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setSelectedCourse("");
    }
  };

  useEffect(() => {
    if (selectedLecturer) {
      const lecturerCourses =
        selectedLecturer?.assignedCourseCodes.split(",") || [];

      setCoursesToRemove(
        courses.filter((course) => lecturerCourses.includes(course.courseCode))
      );
      setCoursesToAdd(
        courses.filter((course) => !lecturerCourses.includes(course.courseCode))
      );
    } else {
      setCoursesToRemove([]);
      setCoursesToAdd(courses);
    }
  }, [selectedLecturer, courses]);

  const fetchLecturers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await lecturerService.getAllLecturers();
      setLecturers(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fetching lecturers",
        description: "Could not fetch lecturers. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fetching courses",
        description: "Could not fetch courses. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLecturers();
    fetchCourses();
  }, [fetchCourses, fetchLecturers]);

  return (
    <VStack spacing={4}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} padding={4}>
        <Button
          colorScheme={addCourse ? "green" : "blue"}
          variant={addCourse ? "solid" : "outline"}
          onClick={() => setAddCourse(true)}
          size="md"
        >
          Add courses
        </Button>
        <Button
          colorScheme={!addCourse ? "red" : "blue"}
          variant={!addCourse ? "solid" : "outline"}
          onClick={() => setAddCourse(false)}
          size="md"
        >
          Remove courses
        </Button>
      </SimpleGrid>
      <Alert status={addCourse ? "info" : "warning"} borderRadius="md">
        <AlertIcon />
        <Text fontSize="sm">
          {addCourse ? "You are in ADD mode" : "You are in REMOVE mode"}
        </Text>
      </Alert>

      <Card variant="outline">
        <CardHeader bg="f7f7f7">
          <Heading size="md" color="gray.700">
            {addCourse
              ? "Assign Courses to Lecturers"
              : "Remove Courses from Lecturers"}
          </Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} padding={5}>
            <FormControl isRequired gridColumn={{ md: "span 2" }}>
              <FormLabel fontWeight="bold" color="gray.700">
                Lecturer Email
              </FormLabel>
              <Select
                placeholder="Choose a lecturer"
                value={selectedLecturer?.email || ""}
                onChange={(e) =>
                  setSelectedLecturer(
                    lecturers.find((l) => l.email === e.target.value)
                  )
                }
                borderColor="gray.300"
                width="100%"
              >
                {lecturers.map((lecturer) => (
                  <option key={lecturer.email} value={lecturer.email}>
                    {lecturer.firstName} {lecturer.lastName} ({lecturer.email})
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="bold" color="gray.700">
                Select Course to {addCourse ? "Add" : "Remove"}
              </FormLabel>
              <Select
                placeholder={`Choose course to ${addCourse ? "add" : "remove"}`}
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                borderColor="gray.300"
                width="100%"
              >
                {addCourse
                  ? coursesToAdd.map((course) => (
                      <option key={course.courseCode} value={course.courseCode}>
                        {course.courseName} ({course.courseCode})
                      </option>
                    ))
                  : coursesToRemove.map((course) => (
                      <option key={course.courseCode} value={course.courseCode}>
                        {course.courseName} ({course.courseCode})
                      </option>
                    ))}
              </Select>
            </FormControl>

            <Button
              colorScheme={addCourse ? "green" : "red"}
              size="md"
              width="100%"
              onClick={addCourse ? handleAssignCourse : handleRemoveCourse}
              isLoading={loading}
            >
              {addCourse ? "Add Course" : "Remove Course"}
            </Button>
          </SimpleGrid>
        </CardBody>
      </Card>
    </VStack>
  );
}
