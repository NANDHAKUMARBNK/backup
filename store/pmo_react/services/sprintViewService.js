import axiosConfig from "../Config/config";
import Headers from "../Config/headers";
import ErrorHandler from "../common/errorHandler";
const getProjectDetailsAPI = (projectCode) => {
  return axiosConfig
    .get(`/projects/${projectCode}`, { headers: Headers() })
    .then((response) => {
      let resProjectInfo = response;
      return resProjectInfo;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const getSprintDetailsAPI = (project_Code, sprint_Id) => {
  return axiosConfig
    .get(`/sprints/${project_Code}/${sprint_Id}`, {
      headers: Headers(),
    })
    .then((response) => {
      let resSprintDetails = response;
      return resSprintDetails;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const getSprintConcernIssueStatusAPI = () => {
  return axiosConfig
    .get(`/sprintIssueStatus`, {
      headers: Headers(),
    })
    .then((response) => {
      let resSprintIssueStatus = response.data;
      return resSprintIssueStatus;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const getSprintStatusAPI = () => {
  return axiosConfig
    .get(`/sprintStatus`, {
      headers: Headers(),
    })
    .then((response) => {
      let resStatus = response.data;
      return resStatus;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const createSprintAPI = (projectCode, requestInfo) => {
  return axiosConfig
    .put(`/sprints/${projectCode}`, requestInfo, {
      headers: Headers(),
    })
    .then((response) => {
      let res = response.data;
      return res;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const updateBasicDetailsSprintAPI = (projectCode, sprintId, requestInfo) => {
  return axiosConfig
    .put(`/sprints/${projectCode}/${sprintId}/basic`, requestInfo, {
      headers: Headers(),
    })
    .then((response) => {
      let res = response.data;
      return res;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const updateSummaryAPI = (projectCode, sprintId, requestInfo) => {
  return axiosConfig
    .put(`/sprints/${projectCode}/${sprintId}/summary`, requestInfo, {
      headers: Headers(),
    })
    .then((response) => {
      let res = response.data;
      return res;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const updateCapacityAPI = (projectCode, sprintId, requestInformation) => {
  return axiosConfig
    .put(
      `/sprints/${projectCode}/${sprintId}/sprintcapacity`,
      requestInformation,
      {
        headers: Headers(),
      }
    )
    .then((response) => {
      let res = response.data;
      return res;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const updateIssueListAPI = (projectCode, sprintId, requestInformation) => {
  return axiosConfig
    .put(`/sprints/${projectCode}/${sprintId}/issuelist`, requestInformation, {
      headers: Headers(),
    })
    .then((response) => {
      let res = response.data;
      return res;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const updateEstimationExerciseAPI = (
  projectCode,
  sprintId,
  requestInformation
) => {
  return axiosConfig
    .put(
      `/sprints/${projectCode}/${sprintId}/estimationexercise`,
      requestInformation,
      {
        headers: Headers(),
      }
    )
    .then((response) => {
      let res = response.data;
      return res;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const updateCapacityPlanFormAPI = (
  projectCode,
  sprintId,
  requestInformation
) => {
  return axiosConfig
    .put(
      `/sprints/${projectCode}/${sprintId}/capacityexercise`,
      requestInformation,
      {
        headers: Headers(),
      }
    )
    .then((response) => {
      let res = response.data;
      return res;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const updateSprintCheckListAPI = (
  projectCode,
  sprintId,
  requestInformation
) => {
  return axiosConfig
    .put(
      `/sprints/${projectCode}/${sprintId}/sprintchecklist`,
      requestInformation,
      {
        headers: Headers(),
      }
    )
    .then((response) => {
      let res = response.data;
      return res;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const updateProjectCapacityAPI = (
  projectCode,
  sprintId,
  requestInformation
) => {
  return axiosConfig
    .put(
      `/sprints/${projectCode}/${sprintId}/projectcapacity`,
      requestInformation,
      {
        headers: Headers(),
      }
    )
    .then((response) => {
      let res = response.data;
      return res;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const deleteSprintAPI = (projectCode, sprintId) => {
  return axiosConfig
    .delete(`/sprints/${projectCode}/${sprintId}`, {
      headers: Headers(),
    })
    .then((response) => {
      let res = response.data;
      return res;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
export {
  getProjectDetailsAPI,
  getSprintDetailsAPI,
  getSprintConcernIssueStatusAPI,
  getSprintStatusAPI,
  createSprintAPI,
  updateBasicDetailsSprintAPI,
  updateSummaryAPI,
  updateCapacityAPI,
  updateIssueListAPI,
  updateEstimationExerciseAPI,
  updateCapacityPlanFormAPI,
  updateSprintCheckListAPI,
  updateProjectCapacityAPI,
  deleteSprintAPI,
};
