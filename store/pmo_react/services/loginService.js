import axiosConfig from "../Config/config";
function LoginService(request) {
  return axiosConfig
    .post("/validateUser", request, { handlerEnabled: false })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
}
export default LoginService;
