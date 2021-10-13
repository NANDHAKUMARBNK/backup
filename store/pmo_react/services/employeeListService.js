import axiosConfig from "../Config/config";
import Headers from "../Config/headers";
import ErrorHandler from "../common/errorHandler";
const getEmployeesAPI = () => {
  return axiosConfig
    .get("/employee", { headers: Headers() })
    .then((response) => {
      let resEmployees = response.data;
      return resEmployees;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const getEmployeeAPI = (empID) => {
  return axiosConfig
    .get(`/employee/${empID}`, { headers: Headers() })
    .then((response) => {
      let resEmployee = response.data;
      return resEmployee;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
const postEmployeeAPI = (request, empID) => {
  return axiosConfig
    .post(`/employee/${empID}`, request, { headers: Headers() })
    .then((response) => {
      let resEmployee = response.data;
      return resEmployee;
    })
    .catch((error) => {
      return ErrorHandler(error);
    });
};
export { getEmployeesAPI, getEmployeeAPI, postEmployeeAPI };
