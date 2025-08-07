import axios from "axios";


// base URL for the API

const API_BASE_URL = "http://localhost:3001/api";

// Create an axios instance with the base API
const api = axios.create({
  baseURL: API_BASE_URL,
  // The request body will be JSON
  headers: {
    "Content-Type": "application/json",
  },
});

// Interface for API error responses
interface APIError {
  response?: {
    data: {
      message?: string;
    };
  };
  mesage?: string;
}

// Interfaces for API login and registration requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "candidate" | "lecturer";
}

// Interface for application
export interface CreateApplicationRequest {
  candidateEmail: string;
  courseCode: string;
  roleType: "Tutor" | "Lab Assistant";
  availability: "Part Time" | "Full Time";
  skills: string;
  previousRoles?: string;
  academicCredentials: string;
}

// Interface for candidate response
export interface CandidateResponse {
  email: string;
  firstName: string;
  lastName: string;
  dateCreated: Date;
  timesAccepted: number;
  ratingSum: number;
  rating: number;
  isBlocked: boolean;
  role: "candidate";
  applications?: ApplicationResponse[];
}

// Interface for lecturer response
export interface LecturerResponse {
  email: string;
  firstName: string;
  lastName: string;
  dateCreated: Date;
  assignedCourseCodes: string;
  role: "lecturer";
  courses?: CourseResponse[];
}

// Interface for course response
export interface CourseResponse {
  courseCode: string;
  courseName: string;
}

// Interface for application response
export interface ApplicationResponse {
  applicationId: number;
  roleType: "Tutor" | "Lab Assistant";
  status: "pending" | "accepted" | "rejected";
  applicationDate: Date;
  availability: "Part Time" | "Full Time";
  skills: string;
  previousRoles?: string;
  academicCredentials: string;
  lecturerComments: string;
  rankedBy: string;
  candidate: CandidateResponse;
  course: CourseResponse;
}

export const authAPI = {
  // Login function
  login: async (
    credentials: LoginRequest
  ): Promise<{
    message: string;
    user: LecturerResponse | CandidateResponse;
  }> => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as APIError;
      if (apiError.response) {
        // The request was made and the server responded with a status code
        return Promise.reject({
          message: apiError.response.data.message || "Login failed",
          isAxiosError: true,
        });
      } else {
        return Promise.reject({
          message: "Network error or server is down",
          isAxiosError: false,
        });
      }
    }
  },
  // Register candidate function
  registerCandidate: async (
    userData: RegisterRequest
  ): Promise<{ message: string; candidate: CandidateResponse }> => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as APIError;
      if (apiError.response) {
        // The request was made and the server responded with a status code
        return Promise.reject({
          message: apiError.response.data.message || "Register failed",
          isAxiosError: true,
        });
      } else {
        return Promise.reject({
          message: "Network error or server is down",
          isAxiosError: false,
        });
      }
    }
  },
  // Register lecturer function
  registerLecturer: async (
    userData: RegisterRequest
  ): Promise<{ message: string; lecturer: LecturerResponse }> => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as APIError;
      if (apiError.response) {
        // The request was made and the server responded with a status code
        return Promise.reject({
          message: apiError.response.data.message || "Register failed",
          isAxiosError: true,
        });
      } else {
        return Promise.reject({
          message: "Network error or server is down",
          isAxiosError: false,
        });
      }
    }
  },
};

export const candidateAPI = {
  // Create application
  createApplication: async (
    applicationData: CreateApplicationRequest
  ): Promise<{ message: string; application: ApplicationResponse }> => {
    try {
      const response = await api.post("/applications", applicationData);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as APIError;
      if (apiError.response) {
        return Promise.reject({
          message:
            apiError.response.data.message || "Application creation failed",
          isAxiosError: true,
        });
      } else {
        return Promise.reject({
          message: "Network error or server is down",
          isAxiosError: false,
        });
      }
    }
  },
  // Get candidate by email
  getCandidate: async (email: string): Promise<CandidateResponse> => {
    try {
      const response = await api.get(`/candidates/${email}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as APIError;
      if (apiError.response) {
        return Promise.reject({
          message:
            apiError.response.data.message || "Failed to fetch candidate",
          isAxiosError: true,
        });
      } else {
        return Promise.reject({
          message: "Network error or server is down",
          isAxiosError: false,
        });
      }
    }
  },
  // Get courses in backend
  getCourses: async (): Promise<CourseResponse[]> => {
    try {
      const response = await api.get("/courses");
      return response.data;
    } catch (error: unknown) {
      const apiError = error as APIError;
      if (apiError.response) {
        return Promise.reject({
          message: apiError.response.data.message || "Failed to fetch courses",
          isAxiosError: true,
        });
      } else {
        return Promise.reject({
          message: "Network error or server is down",
          isAxiosError: false,
        });
      }
    }
  },

  getAllCandidates: async (): Promise<CandidateResponse[]> => {
    try {
      const candidates = await api.get(`/candidates`);
      return candidates.data;
    } catch (error) {
      console.log("Failed to fetch applications by course code");
      return Promise.reject({
        message: error,
        isAxiosError: true,
      });
    }
  },

  updateCandidateRating: async (
    email: string,
    newRating: number
  ): Promise<CandidateResponse> => {
    try {
      const updatedCandidate = await api.put(
        `/candidates/${email}/${newRating}`
      );

      return updatedCandidate.data;
    } catch (error) {
      return Promise.reject({
        message: error,
        isAxiosError: true,
      });
    }
  },

  getStatistics: async (): Promise<{
    mostChosen: CandidateResponse | null;
    leastChosen: CandidateResponse | null;
    notChosen: CandidateResponse[];
    allCandidates: CandidateResponse[];
  }> => {
    try {
      const response = await api.get("/statistics");
      return response.data;
    } catch (error: unknown) {
      const apiError = error as APIError;
      if (apiError.response) {
        return Promise.reject({
          message:
            apiError.response.data.message || "Failed to fetch statistics",
          isAxiosError: true,
        });
      } else {
        return Promise.reject({
          message: "Network error or server is down",
          isAxiosError: false,
        });
      }
    }
  },
};

export const lecturerAPI = {
  // Get lecturer by email
  getLecturer: async (email: string): Promise<LecturerResponse> => {
    try {
      const response = await api.get(`/lecturers/${email}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as APIError;
      if (apiError.response) {
        return Promise.reject({
          message: apiError.response.data.message || "Failed to fetch lecturer",
          isAxiosError: true,
        });
      } else {
        return Promise.reject({
          message: "Network error or server is down",
          isAxiosError: false,
        });
      }
    }
  },
};

export interface ApplicationsRequest {
  candidateEmail: string;
}

export const applicationAPI = {
  getApplications: async (email: string): Promise<ApplicationResponse[]> => {
    try {
      const applications = await api.get(`/applications/candidate/${email}`);
      return applications.data;
    } catch (error) {
      console.log("Failed to fetch applications", error);
      return Promise.reject({
        message: error,
        isAxiosError: true,
      });
    }
  },

  getApplicationsByCourse: async (
    courseCode: string
  ): Promise<ApplicationResponse[]> => {
    try {
      const applications = await api.get(`/applications/course/${courseCode}`);
      return applications.data;
    } catch (error) {
      console.log("Failed to fetch applications by course code");
      return Promise.reject({
        message: error,
        isAxiosError: true,
      });
    }
  },

  updateApplicationFeedback: async (
    applicationId: number,
    email: string,
    feedback: string
  ): Promise<CandidateResponse> => {
    try {
      const updatedApplication = await api.put(`/applications/${applicationId}/feedback`, { rankedBy: email, feedback });
      console.log(`/applications/:${applicationId}/feedback`);

      return updatedApplication.data;
    } catch (error) {
      return Promise.reject({
        message: error,
        isAxiosError: true,
      });
    }
  },

  acceptApplication: async (
    email: string,
    applicationId: number
  ): Promise<ApplicationResponse> => {
    try {
      const response = await api.put(
        `/candidates/accept/${email}/${applicationId}`
      );
      return response.data;
    } catch (error: unknown) {
      const apiError = error as APIError;
      if (apiError.response) {
        return Promise.reject({
          message:
            apiError.response.data.message ||
            "Failed to increment times accepted",
          isAxiosError: true,
        });
      } else {
        return Promise.reject({
          message: "Network error or server is down",
          isAxiosError: false,
        });
      }
    }
  },
};
