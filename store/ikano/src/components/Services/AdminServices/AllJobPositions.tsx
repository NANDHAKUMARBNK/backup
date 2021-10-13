import apiConfig from "../../Config/config";
import ErrorHandler from "../../Common/ErrorHandler";
import Headers from "../../Config/Headers";
// Dashboard
const getAllJobPositionsAPI = () => {
  return apiConfig
    .get("/dashboard/jobPositions", {
      headers: Headers(),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return ErrorHandler(error);
    });
};
// ManageDashboard
const getAllManageJobPositionsAPI = () => {
  return apiConfig
    .get("/jobPositions", {
      headers: Headers(),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return ErrorHandler(error);
    });
};
// Overall Status Count
const getOverAllStatusCountAPI = () => {
  return apiConfig
    .get("/dashboard/status", {
      headers: Headers(),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return ErrorHandler(error);
    });
};
// Update Job Position
const updateJobPositionsActiveAPI = (request: any) => {
  return apiConfig
    .put(
      `/jobPositions/updateStatus?jobId=${request.jobId}&status=${request.status}`,
      {},
      {
        headers: Headers(),
      }
    )
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return ErrorHandler(error);
    });
};
// GetSkills Lookup
const getSkillsLookUpAPI = () => {
  return apiConfig
    .get("/jobPositions/skills", {
      headers: Headers(),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return ErrorHandler(error);
    });
};
// Applicant Skills
const getSkillsApplicantLookUpAPI = () => {
  return apiConfig
    .get("/applicant/skills")
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {});
};
// GetQualification Lookup
const getQualificationLookUpAPI = () => {
  return apiConfig
    .get("/jobPositions/qualifications", {
      headers: Headers(),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return ErrorHandler(error);
    });
};
// Manager Dropdown Lookup
const getJobTypeLookUpAPI = () => {
  return apiConfig
    .get("/dashboard/jobPositions/types", {
      headers: Headers(),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return ErrorHandler(error);
    });
};
// GetQualification Lookup
const getQualificationLookUpApplicant = () => {
  return apiConfig
    .get("/applicant/qualifications")
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {});
};
// Create Job Position
const addJobPositionAPI = (Request: any) => {
  return apiConfig
    .post("/jobPositions/add", Request, {
      headers: Headers(),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return ErrorHandler(error);
    });
};
// Edit Job Position
const editJobPositionAPI = (Request: any, JobId: any) => {
  return apiConfig
    .put(`/jobPositions/update/${JobId}`, Request, {
      headers: Headers(),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return ErrorHandler(error);
    });
};
// Specific Job Positions
const getSpecificJobPositionDetails = (JobId: any) => {
  return apiConfig
    .get(`/jobPositions/${JobId}`, {
      headers: Headers(),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return ErrorHandler(error);
    });
};
export {
  getAllJobPositionsAPI,
  getOverAllStatusCountAPI,
  updateJobPositionsActiveAPI,
  getQualificationLookUpAPI,
  getQualificationLookUpApplicant,
  getSkillsLookUpAPI,
  addJobPositionAPI,
  getAllManageJobPositionsAPI,
  editJobPositionAPI,
  getSpecificJobPositionDetails,
  getSkillsApplicantLookUpAPI,
  getJobTypeLookUpAPI,
};
