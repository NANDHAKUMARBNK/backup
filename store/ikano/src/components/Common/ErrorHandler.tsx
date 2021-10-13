export default function ErrorHandler(err: any) {
  if (err) {
    window.location.replace("/");
    localStorage.clear();
  }
}
