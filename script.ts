/*
    Variables
 */
const body = document.body;
const labels = [...document.querySelectorAll("label")];
const labelsClone = Array.from(document.querySelectorAll("label")).map(
  (label) => label.cloneNode(true),
);
const errorMessages = [...document.querySelectorAll("span")];
const scrollItems = document.querySelector("ul");
const form = document.querySelector(".container") as HTMLElement;
const success = document.querySelector("#successContainer") as HTMLElement;
const button = document.querySelector("button") as HTMLButtonElement;
const fullName = document.querySelector("#full_name") as HTMLInputElement;
const email = document.querySelector("#email") as HTMLInputElement;
const phoneNo = document.querySelector("#phone") as HTMLInputElement;
const pwd = document.querySelector("#password") as HTMLInputElement;
const inputs = document.querySelectorAll("input");
const pwdConfirm = document.querySelector(
  "#confirm_password",
) as HTMLInputElement;

let fields = [fullName, email, phoneNo, pwd, pwdConfirm];

let listCreated = false;
let noErrors = false;
let errorsChecked = false;

let filteredErrors = Array();
let filteredLabels = Array();
let filteredInputs = Array();

let filteredLength: number;

let label: string | null;

const RAND_ARR_LENGTH = 100;

let random: number[] = randomize(
  Array.from({ length: RAND_ARR_LENGTH }, (_, i) => i + 1),
);

window.addEventListener("load", updateScroll, true);

button.addEventListener("click", checkIfFormIsSubmittable);
button.addEventListener("focus", checkErrors);

body.addEventListener("click", setScrollLabel, true);
body.addEventListener("focus", setScrollLabel, true);

form.addEventListener("input", checkInput);

/*
    Main functions
 */
function checkErrors(evt: Event, updateLabel: boolean = false) {
  if (evt instanceof FocusEvent) evt.preventDefault();
  errorsChecked = true;

  let error: string = getErrorBool();

  resetFiltersAndLabels();

  if (error) {
    noErrors = false;

    filteredLength = filteredInputs.length;
    // TODO data validation and error testing

    updateLabelErrors();

    for (let i = 0; i < filteredLength; i++) {
      if (filteredLength === 1 || i === filteredLength - 1) {
        error += `${filteredLabels[i].textContent}>`;
      } else {
        error += `${filteredLabels[i].textContent}, `;
      }
    }
    label = error;

    if (updateLabel) return updateScroll(evt);

    return updateScrollItems(label);
  } else {
    updateScrollItems((label = "Everything looks good!"));
    noErrors = true;
  }
}
// Will only check the input AFTER an attempt to create an account with bad data.
// This way the error message in the scroll will update on-the-fly for instant feedback.
function checkInput(evt: Event) {
  if (!evt.target) return;
  if (!(evt.target instanceof HTMLInputElement)) return;
  if (errorsChecked) {
    checkErrors(evt, true);
  }
}

function checkIfFormIsSubmittable(evt: Event) {
  if (noErrors) {
    if (!form || !success) return;
    updateScrollItems("Account created successfully!");
    form.style.display = "none";
    success.style.display = "block";
    body.removeEventListener("click", setScrollLabel, true);
    body.removeEventListener("focus", setScrollLabel, true);
  } else {
    checkErrors(evt);
  }
}

function resetFiltersAndLabels() {
  filteredErrors = Array();
  filteredLabels = Array();
  filteredInputs = Array();

  for (let i = 0; i < fields.length; i++) {
    if (errorTesting(fields[i])) {
      filteredErrors.push(errorMessages[i]);
      filteredLabels.push(labelsClone[i]);
      filteredInputs.push(fields[i]);
    }
  }

  labelsClone.forEach((state, index) => {
    labels[index].textContent = state.textContent;
  });
}
function errorTesting(val: HTMLInputElement) {
  let id = val.id;
  switch (id) {
    case "full_name":
      return val.value === "";
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      return !emailRegex.test(val.value);
    case "phone":
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[\s.\-0-9]{6,}$/;
      return !phoneRegex.test(val.value);
    case "password":
      return val.value === "";
    case "confirm_password":
      return !confirmPassword();
    default:
      return false;
  }
}

function confirmPassword() {
  return (
    inputs[3].value !== "" &&
    inputs[4].value !== "" &&
    inputs[3].value === inputs[4].value
  );
}

function updateLabelErrors() {
  for (let i = 0; i < filteredLength; i++) {
    labels.forEach((label, index) => {
      // console.log(inputs[index].required);
      if (label.textContent === filteredLabels[i].textContent) {
        labels[index].textContent += ` (${filteredErrors[i].textContent})`;
      }
    });
  }
}

function getErrorBool() {
  return fields.some((field) => errorTesting(field)) ? `Missing: <` : "";
}

/*
    Animation Functions
*/
function setScrollLabel(evt: Event) {
  if (evt.target instanceof HTMLInputElement) return updateScroll(evt);
  if (!errorsChecked) return updateScrollItems("welcome");
  checkErrors(evt);
}
function updateScroll(evt: Event) {
  // prettier-ignore
  if (!(evt.target instanceof HTMLInputElement || evt.target instanceof Document)) return;
  if (!scrollItems) return;

  label = getSelectedLabel(evt);

  if (!listCreated) {
    createScrollItems();
  } else {
    updateScrollItems(label);
  }
}

function createScrollItems() {
  if (!scrollItems) return;
  scrollItems.innerHTML = "";
  let fragment = document.createDocumentFragment();
  for (let i = 0; i < RAND_ARR_LENGTH; i++) {
    let li = document.createElement("li");
    li.textContent = label;
    li.style.animationDuration = `${random[i]}s`;
    fragment.appendChild(li);
  }
  scrollItems.appendChild(fragment);
  listCreated = true;
}

// updates the current scroll items
function updateScrollItems(label: string | null) {
  if (!scrollItems) return;
  scrollItems.childNodes.forEach((child) => (child.textContent = label));
}

// grabs what was selected
function getSelectedLabel(evt: Event) {
  if (evt.target instanceof HTMLInputElement) {
    // prettier-ignore
    return labels.filter((label) => label.htmlFor === (evt.target as HTMLElement).id,)[0].textContent;
  }
  return "welcome";
}

/*
    Helper Functions
*/
function randomize(array: number[]): number[] {
  // Uses the Fisher-Yates Sorting Algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
