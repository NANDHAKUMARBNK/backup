import axiosConfig from "../Config/config";
import Headers from "../Config/headers";
import ErrorHandler from "../common/errorHandler";
const getAllocationReportsAPI = (targetValue) => {
  return axiosConfig
    .get(`/reportAllocation/${targetValue}`, { headers: Headers() })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return ErrorHandler(err);
    });
};

export { getAllocationReportsAPI };
