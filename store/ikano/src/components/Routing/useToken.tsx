import { useState } from "react";

export default function useToken() {
  const getToken = () => {
    const tokenString: any = localStorage.getItem("Access_Token");
    const userToken: any = JSON.parse(tokenString);
    if (userToken) return userToken;
  };
  const [token, setToken]: any = useState(getToken());
  const saveToken: any = (userToken: any) => {
    localStorage.setItem("Access_Token", JSON.stringify(userToken));
    setToken(userToken.token);
  };
  return {
    setToken: saveToken,
    token,
  };
}
