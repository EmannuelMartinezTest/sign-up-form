let body = document.body;
let clonable = document.querySelectorAll("label");

let labels = [...document.querySelectorAll("label")];
let labelsClone = Array.from(document.querySelectorAll("label")).map((label) =>
  label.cloneNode(true),
);
let errorMessages = [...document.querySelectorAll("span")];
let scrollItems = document.querySelector("ul");
let listCreated = false;
let noErrors = false;
let form = document.querySelector(".container") as HTMLElement;
let success = document.querySelector("#successContainer") as HTMLElement;

let button = document.querySelector("button");
let fullName = document.querySelector("#full_name") as HTMLInputElement;
let email = document.querySelector("#email") as HTMLInputElement;
let phoneNo = document.querySelector("#phone") as HTMLInputElement;
let pwd = document.querySelector("#password") as HTMLInputElement;
// prettier-ignore
let pwdConfirm = document.querySelector("#confirm_password") as HTMLInputElement;

let fields = [fullName, email, phoneNo, pwd, pwdConfirm];
let errorsChecked = false;

button?.addEventListener("click", checkIfFormIsSubmittable);
button?.addEventListener("focus", checkErrors);

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

function checkErrors(evt: Event) {
  if (evt instanceof FocusEvent) evt.preventDefault();
  errorsChecked = true;
  let error: string = "";
  fields.some((field) => {
    if (field?.value === "") {
      error += `Missing: <`;
      return true;
    }
  });

  // need a "Success! Your account has been created." somewhere

  if (!error) {
    updateScrollItems((label = "Everything looks good!"));
    noErrors = true;
    // I should then just visually hide the form from here.
  } else {
    noErrors = false;
    let filteredErrors = Array();
    let filteredLabels = Array();
    let filteredInputs = Array();

    for (let i = 0; i < fields.length; i++) {
      if (fields[i].value === "") {
        filteredErrors.push(errorMessages[i]);
        filteredLabels.push(labelsClone[i]);
        filteredInputs.push(fields[i]);
      }
    }

    let filteredLength = filteredInputs.length;

    labelsClone.forEach((state, index) => {
      labels[index].textContent = state.textContent;
    });

    for (let i = 0; i < filteredLength; i++) {
      labels.forEach((label, index) => {
        if (label.textContent === filteredLabels[i].textContent) {
          labels[index].textContent += ` (${filteredErrors[i].textContent})`;
        }
      });

      if (filteredLength === 1 || i === filteredLength - 1) {
        error += `${filteredLabels[i].textContent}>`;
      } else {
        error += `${filteredLabels[i].textContent}, `;
      }
    }
    label = error;
    return updateScrollItems(label);
  }
}

let label: string | null;

const RAND_ARR_LENGTH = 100;

let random: number[] = randomize(
  Array.from({ length: RAND_ARR_LENGTH }, (element, i) => i + 1),
);
function randomize(array: number[]): number[] {
  // Uses the Fisher-Yates Sorting Algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

window.addEventListener("load", updateScroll, true);
window.addEventListener("load", createClones, true);
body.addEventListener("click", setScrollLabel, true);
body.addEventListener("focus", setScrollLabel, true);

function createClones() {}
function setScrollLabel(evt: Event) {
  if (evt.target instanceof HTMLInputElement) return updateScroll(evt);
  if (!errorsChecked) return updateScrollItems("hello");
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
