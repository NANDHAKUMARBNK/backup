export const PersonalInformationInput = [
  {
    type: "text",
    name: "firstName",
    placeholder: "First Name*",
    msg: "First Name",
  },
  {
    type: "text",
    name: "lastname",
    placeholder: "Last Name*",
    msg: "Last Name ",
  },
  { type: "text", name: "email", placeholder: "Email*", msg: "Email" },
  {
    type: "date",
    name: "birthDate",
    placeholder: "Date of birth*",
    errorMessagePattern: "Ex. 12/12/2022 Or 14-04-2022",
    msg: "DOB",
  },
  {
    type: "text",
    name: "mobileNumber",
    placeholder: "Phone number (Mobile)*",
    msg: "Phone Number",
  },
  {
    type: "text",
    name: "phoneNumber",
    placeholder: "Phone number (Home)",
    msg: "Phone Number (Home)",
  },
  {
    title: "Gender",
    type: "radio",
    name: "gender",
    msg: "Gender",
    option: [
      { value: "female", title: "Female" },
      { value: "male", title: "Male" },
    ],
  },
  {
    title: "Marital status",
    type: "radio",
    name: "maritalStatus",
    msg: "Marital status",
    option: [
      { value: "single", title: "Single" },
      { value: "married", title: "Married" },
      { value: "widowed", title: "Widowed" },
    ],
  },
];
export const Address = [
  {
    type: "text",
    title: "dddd",
    name: "HouseNumber",
    placeholder: "House Number",
  },
  {
    type: "text",
    title: "dddd",
    name: "streetName",
    placeholder: "Street Name",
  },
  {
    type: "text",
    title: "dddd",
    name: "municipality",
    placeholder: "Municipality",
  },
  { type: "text", title: "dddd", name: "city", placeholder: "City" },
  { type: "text", title: "dddd", name: "state", placeholder: "State" },
  { type: "text", title: "dddd", name: "zipcode", placeholder: "Zipcode" },
];
// Add Employment
const years = function (startYear: any) {
  const currentYear = new Date().getFullYear(),
    years = [];
  startYear = startYear || 1980;
  years.push({ value: "", label: "Select Year" });
  while (startYear <= currentYear) {
    const a = startYear++;
    years.push({ value: a, label: Math.floor(a) });
  }
  return years;
};

export const AddEmployment = [
  {
    type: "text",
    name: "OrganisationName",
    placeholder: "Company/Organisation",
    errorMsg: "Company/Organisation is required",
  },
  {
    type: "text",
    name: "Position",
    placeholder: "Position",
    errorMsg: "Position is required",
  },
  {
    type: "text",
    name: "Location",
    placeholder: "Location",
    errorMsg: "Location is required",
  },
  {
    type: "text",
    name: "WebsiteURL",
    placeholder: "Website URL",
    errorMsg: "Website URL is required",
  },
];

export const StartDate = [
  {
    title: "StartingFrom",
    name: "Month",
    placeholder: "Starting Month",
    errorMsg: "Starting Month is required",
    option: [
      { value: "", label: "Select Month" },
      { value: "January", label: "January" },
      { value: "February", label: "February" },
      { value: "March", label: "March" },
      { value: "April", label: "April" },
      { value: "May", label: "May" },
      { value: "June", label: "June" },
      { value: "July", label: "July" },
      { value: "August", label: "August" },
      { value: "September", label: "September" },
      { value: "October", label: "October" },
      { value: "November", label: "November" },
      { value: "December", label: "December" },
    ],
  },
  {
    title: "StartingFrom",
    name: "Year",
    placeholder: "Starting Year",
    errorMsg: "Starting Year is required",
    option: years(1958),
  },
];
export const EndDate = [
  {
    title: "endingIn",
    name: "Month",
    placeholder: "Ending Month",
    errorMsg: "Ending Month is required",
    option: [
      { value: "", label: "Select Month" },
      { value: "January", label: "January" },
      { value: "February", label: "February" },
      { value: "March", label: "March" },
      { value: "April", label: "April" },
      { value: "May", label: "May" },
      { value: "June", label: "June" },
      { value: "July", label: "July" },
      { value: "August", label: "August" },
      { value: "September", label: "September" },
      { value: "October", label: "October" },
      { value: "November", label: "November" },
      { value: "December", label: "December" },
    ],
  },
  {
    title: "endingIn",
    name: "Year",
    placeholder: "Ending Year",
    errorMsg: "Ending Year is required",
    option: years(1958),
  },
];
export const TeaxtArea = [
  {
    type: "textarea",
    placeholder: "Details",
    row: "4",
    name: "Details",
    errorMsg: "Details is required",
  },
];
// Eduction Filed
export const EducationHistory = [
  {
    type: "select",
    name: "EducationType",
    placeholder: "Education Level",
    errorMsg: "Education Level is required",
    option: [
      { value: "", label: "Education Level" },
      { value: 1, label: "High School Diploma/Technical Diploma" },
      { value: 2, label: "Bachelor Degree" },
      { value: 3, label: "Master Degree" },
      { value: 4, label: "PHD" },
    ],
  },
  {
    type: "text",
    name: "InstitutionName",
    placeholder: "Name of School/University",
    errorMsg: "Name of School/University is required",
  },
  {
    type: "text",
    name: "Subject",
    placeholder: "Subject of study",
    errorMsg: "Subject of study is required",
  },
  {
    type: "text",
    name: "Location",
    placeholder: "Location of School/University",
    errorMsg: "Location of School/University is required",
  },
  {
    type: "select",
    name: "QualificationId",
    placeholder: "Education Area",
    errorMsg: "Education Area is required",
    option: [
      { value: "", label: "Education Area" },
      { value: "1", label: "PG" },
      { value: "2", label: "UG" },
      { value: "3", label: "Others" },
    ],
  },
  { type: "text", name: "", placeholder: "", errorMsg: "" },
  // { type: "text", name: "Title", placeholder: "Title (PHd, MSc, BSc)" },
];
// skils
export const Skill = [
  { id: 1, skilsName: "Reat Js", option: true },
  { id: 2, skilsName: "Reat Js", option: true },
  { id: 3, skilsName: "Reat Js", option: true },
  { id: 4, skilsName: "Reat Js", option: true },
  { id: 5, skilsName: "Reat Js", option: true },
  { id: 6, skilsName: "Reat Js", option: true },
  { id: 7, skilsName: "Reat Js", option: true },
  { id: 8, skilsName: "Reat Js", option: true },
  { id: 9, skilsName: "Reat Js", option: true },
  { id: 10, skilsName: "Reat Js", option: true },
  { id: 11, skilsName: "Reat Js", option: true },
  { id: 12, skilsName: "Reat Js", option: true },
  { id: 13, skilsName: "Reat Js", option: true },
  { id: 14, skilsName: "Reat Js", option: true },
  { id: 15, skilsName: "Reat Js", option: true },
  { id: 16, skilsName: "Reat Js", option: true },
  { id: 17, skilsName: "Reat Js", option: true },
  { id: 18, skilsName: "Reat Js", option: true },
  { id: 19, skilsName: "Reat Js", option: true },
  { id: 20, skilsName: "Python Js", option: true },
];
export const CheckMonth: any = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};
export const Qualificationsdata: any = [
  { value: "", label: "Education Type" },
  { value: 1, label: "Diploma" },
  { value: 2, label: "Graduation" },
  { value: 3, label: "Post Graduation" },
  { value: 4, label: "Integrated Post Graduation" },
];
