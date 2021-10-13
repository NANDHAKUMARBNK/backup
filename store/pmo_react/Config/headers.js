function Headers() {
  return {
    "Content-Type": "application/json",
    Authorization: "JWT " + localStorage.getItem("userToken"),
  };
}
export default Headers;
