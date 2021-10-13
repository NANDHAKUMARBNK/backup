export const isNumericValidator = function (value: any) {
  const number_Regex = new RegExp(/^[0-9]*(?:\.\d{1,2})?$/g);
  if (number_Regex.test(value)) {
    return true;
  }
  return false;
};
export const valueEmptyCheck = function (value: any) {
  if (value.trim().length === 0) {
    return false;
  }
  return true;
};
export const isAlphaValidator = function (value: any) {
  const alpha_Regex = new RegExp(/^[a-zA-Z]+$/g);
  if (alpha_Regex.test(value)) {
    return true;
  }
  return false;
};
export const emailValidator = function (value: any) {
  const email_Regex = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g);
  if (email_Regex.test(value)) {
    return true;
  }
  return false;
};
export const alphaNumericValidator = function (value: any) {
  const alphaNumeric_Regex = new RegExp(/^[a-zA-Z0-9\s]+$/g);
  if (alphaNumeric_Regex.test(value)) {
    return true;
  }
  return false;
};
export const textareaValidator = function (value: any) {
  const textarea_Regex = new RegExp(/^[a-zA-Z0-9.,\s]+$/g);
  if (textarea_Regex.test(value)) {
    return true;
  }
  return false;
};
export const dobValidator = function (value: any) {
  // let dob_Regex = new RegExp(
  //   /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/g
  // );
  // const dob_Regex = new RegExp(
  //   /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/g
  // );
  const dob_Regex = new RegExp(
    /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/g
  );
  if (dob_Regex.test(value)) {
    return true;
  }
  return false;
};
export const mobileValidator = function (value: any) {
  const mobile_Regex = new RegExp(/[- +()0-9]+/g);
  if (mobile_Regex.test(value)) {
    return true;
  }
  return false;
};

export const dobCompare = function (value: any) {
  const tdy: any = new Date();
  const start: any = new Date("01-01-1900");
  if (new Date(value) > start && new Date(value) < tdy) {
    return true;
  }
  return false;
};
