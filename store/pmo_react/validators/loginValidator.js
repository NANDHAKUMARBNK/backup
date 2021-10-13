export const isNumericValidator = function (value) {
  let number_Regex = new RegExp(/^[0-9]*(?:\.\d{1,2})?$/g);
  if (number_Regex.test(value)) {
    return true;
  }
  return false;
};
export const valueEmptyCheck = function (value) {
  if (value.trim().length === 0) {
    return false;
  }
  return true;
};
export const isAlphaValidator = function (value) {
  let alpha_Regex = new RegExp(/^[a-zA-Z]+$/g);
  if (alpha_Regex.test(value)) {
    return true;
  }
  return false;
};
export const emailValidator = function (value) {
  let email_Regex = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g);
  if (email_Regex.test(value)) {
    return true;
  }
  return false;
};
export const alphaNumericValidator = function (value) {
  let alphaNumeric_Regex = new RegExp(/^[a-zA-Z0-9\s]+$/g);
  if (alphaNumeric_Regex.test(value)) {
    return true;
  }
  return false;
};
