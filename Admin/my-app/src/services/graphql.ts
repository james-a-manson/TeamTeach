import { gql } from "@apollo/client";

export const GET_LECTURERS = gql`
  query getLecturers {
    lecturers {
      email
      firstName
      lastName
      assignedCourseCodes
    }
  }
`;

export const GET_COURSES = gql`
  query getCourses {
    courses {
      courseCode
      courseName
    }
  }
`;

export const GET_CANDIDATES = gql`
  query getCandidates {
    candidates {
      email
      firstName
      lastName
      rating
      timesAccepted
      applications {
        applicationId
        courseCode
      }
      isBlocked
    }
  }
`;

export const GET_APPLICATIONS = gql`
  query getApplications {
    applications {
      applicationId
      courseCode
      roleType
      status
      candidateEmail
      availability
      academicCredentials
      previousRoles
      skills
      rankedBy
      lecturerComments
    }
  }
`;

export const UPDATE_LECTURER_COURSES = gql`
  mutation updateLecturerCourses(
    $email: String!
    $assignedCoursesCodes: String!
  ) {
    updateLecturerCourses(
      email: $email
      assignedCourseCodes: $assignedCoursesCodes
    ) {
      email
      firstName
      lastName
      assignedCourseCodes
    }
  }
`;

export const CREATE_COURSE = gql`
  mutation createCourse($courseCode: String!, $courseName: String!) {
    createCourse(courseCode: $courseCode, courseName: $courseName) {
      courseCode
      courseName
    }
  }
`;
export const DELETE_COURSE = gql`
  mutation deleteCourse($courseCode: String!) {
    deleteCourse(courseCode: $courseCode)
  }
`;

export const UPDATE_COURSE_NAME = gql`
  mutation updateCourse($courseCode: String!, $courseName: String!) {
    updateCourseName(courseCode: $courseCode, courseName: $courseName) {
      courseCode
      courseName
    }
  }
`;

export const TOGGLE_CANDIDATE_BLOCKED = gql`
  mutation toggleBlocked($email: String!) {
    toggleCandidateBlocked(email: $email) {
      email
      firstName
      lastName
      rating
      timesAccepted
      applications {
        applicationId
        courseCode
      }
      isBlocked
    }
  }
`;
