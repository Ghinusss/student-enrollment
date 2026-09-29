const form = document.getElementById("enrollForm");
const courseSelect = document.getElementById("course");
const majorField = document.getElementById("majorField");
const successMessage = document.getElementById("successMessage");
const studentTable = document.getElementById("studentTable");
const studentBody = document.getElementById("studentBody");
const emptyMessage = document.getElementById("emptyMessage");

// Field rules: required flag and minimum length (text fields only)
const textRules = {
  studentId:  { label: "Student ID",  required: true,  min: 5 },
  prefix:     { label: "Prefix",      required: false, min: 2 },
  firstName:  { label: "First name",  required: true,  min: 3 },
  middleName: { label: "Middle name", required: false, min: 2 },
  lastName:   { label: "Last name",   required: true,  min: 2 },
  suffix:     { label: "Suffix",      required: false, min: 2 }
};

function setError(id, message) {
  document.getElementById(id + "Error").textContent = message;
  document.getElementById(id).classList.toggle("invalid", message !== "");
}

function clearError(id) {
  setError(id, "");
}

// Show the major dropdown only when BSIT is selected
courseSelect.addEventListener("change", () => {
  const isBSIT = courseSelect.value === "BSIT";
  majorField.hidden = !isBSIT;
  if (!isBSIT) {
    document.getElementById("major").value = "";
    clearError("major");
  }
});

// Clear the error as soon as the user edits a field
form.querySelectorAll("input, select").forEach((el) => {
  const evt = el.tagName === "SELECT" ? "change" : "input";
  el.addEventListener(evt, () => {
    clearError(el.id);
    successMessage.hidden = true;
  });
});

function validateForm() {
  let valid = true;

  // Text fields
  for (const id in textRules) {
    const { label, required, min } = textRules[id];
    const value = document.getElementById(id).value.trim();

    if (value === "") {
      if (required) {
        setError(id, label + " is required.");
        valid = false;
      }
    } else if (value.length < min) {
      setError(id, label + " must be at least " + min + " characters.");
      valid = false;
    }
  }

  // Email
  const email = document.getElementById("email").value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === "") {
    setError("email", "Email is required.");
    valid = false;
  } else if (!emailPattern.test(email)) {
    setError("email", "Enter a valid email address.");
    valid = false;
  }

  // Course and major
  if (courseSelect.value === "") {
    setError("course", "Please select a course.");
    valid = false;
  }
  if (courseSelect.value === "BSIT" && document.getElementById("major").value === "") {
    setError("major", "Please select a major.");
    valid = false;
  }

  // Year level
  if (document.getElementById("year").value === "") {
    setError("year", "Please select a year level.");
    valid = false;
  }

  return valid;
}

function addRow(data) {
  const row = studentBody.insertRow();
  [data.id, data.name, data.email, data.course, data.major, data.year].forEach((text) => {
    row.insertCell().textContent = text; // textContent avoids HTML injection
  });
  studentTable.hidden = false;
  emptyMessage.hidden = true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  successMessage.hidden = true;

  if (!validateForm()) return;

  const val = (id) => document.getElementById(id).value.trim();
  const fullName = [val("prefix"), val("firstName"), val("middleName"), val("lastName"), val("suffix")]
    .filter(Boolean)
    .join(" ");

  addRow({
    id: val("studentId"),
    name: fullName,
    email: val("email"),
    course: val("course"),
    major: val("major") || "N/A",
    year: val("year")
  });

  successMessage.textContent = fullName + " was enrolled successfully.";
  successMessage.hidden = false;

  form.reset();
  majorField.hidden = true;
});