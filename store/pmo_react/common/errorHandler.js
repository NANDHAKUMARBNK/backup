function ErrorHandler(err) {
  if (err) {
    window.location.replace("/");
  }
}
export default ErrorHandler;
