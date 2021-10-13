import authConfig from "../../Config/authConfig";
// Login
export const LoginApi = (request: any) => {
  return authConfig
    .post("/token", request)
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return error;
    });
};
// logout
export const LogoutApi = () => {
  return authConfig
    .post("/logout")
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      return error;
    });
};
