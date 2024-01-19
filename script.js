"use strict";
let body = document.body;
let clonable = document.querySelectorAll("label");
let labels = [...document.querySelectorAll("label")];
let labelsClone = Array.from(document.querySelectorAll("label")).map((label) => label.cloneNode(true));
let errorMessages = [...document.querySelectorAll("span")];
let scrollItems = document.querySelector("ul");
let listCreated = false;
let noErrors = false;
let form = document.querySelector(".container");
let success = document.querySelector("#successContainer");
let button = document.querySelector("button");
let fullName = document.querySelector("#full_name");
let email = document.querySelector("#email");
let phoneNo = document.querySelector("#phone");
let pwd = document.querySelector("#password");
// prettier-ignore
let pwdConfirm = document.querySelector("#confirm_password");
let fields = [fullName, email, phoneNo, pwd, pwdConfirm];
let errorsChecked = false;
button === null || button === void 0 ? void 0 : button.addEventListener("click", checkIfFormIsSubmittable);
button === null || button === void 0 ? void 0 : button.addEventListener("focus", checkErrors);
function checkIfFormIsSubmittable(evt) {
    if (noErrors) {
        if (!form || !success)
            return;
        updateScrollItems("Account created successfully!");
        form.style.display = "none";
        success.style.display = "block";
        body.removeEventListener("click", setScrollLabel, true);
        body.removeEventListener("focus", setScrollLabel, true);
    }
    else {
        checkErrors(evt);
    }
}
function checkErrors(evt) {
    if (evt instanceof FocusEvent)
        evt.preventDefault();
    errorsChecked = true;
    let error = "";
    fields.some((field) => {
        if ((field === null || field === void 0 ? void 0 : field.value) === "") {
            error += `Missing: <`;
            return true;
        }
    });
    // need a "Success! Your account has been created." somewhere
    if (!error) {
        updateScrollItems((label = "Everything looks good!"));
        noErrors = true;
        // I should then just visually hide the form from here.
    }
    else {
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
            }
            else {
                error += `${filteredLabels[i].textContent}, `;
            }
        }
        label = error;
        return updateScrollItems(label);
    }
}
let label;
const RAND_ARR_LENGTH = 100;
let random = randomize(Array.from({ length: RAND_ARR_LENGTH }, (element, i) => i + 1));
function randomize(array) {
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
function createClones() { }
function setScrollLabel(evt) {
    if (evt.target instanceof HTMLInputElement)
        return updateScroll(evt);
    if (!errorsChecked)
        return updateScrollItems("hello");
    checkErrors(evt);
}
function updateScroll(evt) {
    // prettier-ignore
    if (!(evt.target instanceof HTMLInputElement || evt.target instanceof Document))
        return;
    if (!scrollItems)
        return;
    label = getSelectedLabel(evt);
    if (!listCreated) {
        createScrollItems();
    }
    else {
        updateScrollItems(label);
    }
}
function createScrollItems() {
    if (!scrollItems)
        return;
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
function updateScrollItems(label) {
    if (!scrollItems)
        return;
    scrollItems.childNodes.forEach((child) => (child.textContent = label));
}
// grabs what was selected
function getSelectedLabel(evt) {
    if (evt.target instanceof HTMLInputElement) {
        // prettier-ignore
        return labels.filter((label) => label.htmlFor === evt.target.id)[0].textContent;
    }
    return "welcome";
}
