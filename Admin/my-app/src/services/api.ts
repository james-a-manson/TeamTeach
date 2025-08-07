import { client } from "./apollo-client";
import {
  LecturerResponse,
  ApplicationResponse,
  CourseResponse,
  CandidateResponse,
} from "./api-types";
import {
  GET_LECTURERS,
  GET_COURSES,
  GET_CANDIDATES,
  GET_APPLICATIONS,
  UPDATE_LECTURER_COURSES,
  CREATE_COURSE,
  DELETE_COURSE,
  UPDATE_COURSE_NAME,
  TOGGLE_CANDIDATE_BLOCKED,
} from "./graphql";

// TODO: create api's for various things similar to below

export const lecturerService = {
  getAllLecturers: async (): Promise<LecturerResponse[]> => {
    const { data } = await client.query({
      query: GET_LECTURERS,
    });
    return data.lecturers;
  },

  updateLecturerCourses: async (
    email: string,
    assignedCoursesCodes: string[]
  ): Promise<LecturerResponse> => {
    const { data } = await client.mutate({
      mutation: UPDATE_LECTURER_COURSES,
      variables: {
        email,
        assignedCoursesCodes: assignedCoursesCodes.join(","),
      },
    });
    return data.updateLecturerCourses;
  },
};

export const courseService = {
  getAllCourses: async (): Promise<CourseResponse[]> => {
    const { data } = await client.query({
      query: GET_COURSES,
    });
    return data.courses;
  },

  createCourse: async (
    courseCode: string,
    courseName: string
  ): Promise<CourseResponse> => {
    const { data } = await client.mutate({
      mutation: CREATE_COURSE,
      variables: {
        courseCode,
        courseName,
      },
    });
    return data.createCourse;
  },

  deleteCourse: async (courseCode: string): Promise<void> => {
    await client.mutate({
      mutation: DELETE_COURSE,
      variables: {
        courseCode,
      },
    });
  },

  updateCourseName: async (
    courseCode: string,
    courseName: string
  ): Promise<CourseResponse> => {
    const { data } = await client.mutate({
      mutation: UPDATE_COURSE_NAME,
      variables: {
        courseCode,
        courseName,
      },
    });
    return data.updateCourseName;
  },
};

export const candidateService = {
  getAllCandidates: async (): Promise<CandidateResponse[]> => {
    const { data } = await client.query({
      query: GET_CANDIDATES,
    });
    return data.candidates;
  },
  toggleCandidateBlocked: async (
    email: string,
    isBlocked: boolean
  ): Promise<CandidateResponse> => {
    const { data } = await client.mutate({
      mutation: TOGGLE_CANDIDATE_BLOCKED,
      variables: {
        email,
        isBlocked,
      },
    });
    return data.toggleCandidateBlocked;
  },
};

export const applicationService = {
  getAllApplications: async (): Promise<ApplicationResponse[]> => {
    const { data } = await client.query({
      query: GET_APPLICATIONS,
    });
    return data.applications;
  },
};
