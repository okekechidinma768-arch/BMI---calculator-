const form = document.querySelector("#bmi-form");
const unitRadios = document.querySelectorAll('input[name="unit"]');
const fields = document.querySelector("#measurement-fields");
const errorMessage = document.querySelector("#error-message");
const resultIntro = document.querySelector("#result-intro");
const resultContent = document.querySelector("#result-content");
const bmiNumber = document.querySelector("#bmi-number");
const resultDescription = document.querySelector("#result-description");
const healthyRange = document.querySelector("#healthy-range");

let currentUnit = "metric";

function renderFields() {
  if (currentUnit === "metric") {
    fields.innerHTML = `
      <div class="field-group">
        <label for="height-cm">Height</label>
        <div class="input-wrap">
          <input id="height-cm" name="height" type="number" min="1" step="any" placeholder="e.g. 175" inputmode="decimal" required>
          <span class="unit-label">cm</span>
        </div>
      </div>
      <div class="field-group">
        <label for="weight-kg">Weight</label>
        <div class="input-wrap">
          <input id="weight-kg" name="weight" type="number" min="1" step="any" placeholder="e.g. 70" inputmode="decimal" required>
          <span class="unit-label">kg</span>
        </div>
      </div>`;
  } else {
    fields.innerHTML = `
      <div class="field-group">
        <label for="height-ft">Height</label>
        <div class="input-wrap">
          <input id="height-ft" name="heightFt" type="number" min="0" step="1" placeholder="ft" inputmode="numeric" aria-label="Height in feet" required>
          <span class="unit-label">ft</span>
          <input id="height-in" name="heightIn" type="number" min="0" max="11.99" step="any" placeholder="in" inputmode="decimal" aria-label="Height in inches">
          <span class="unit-label">in</span>
        </div>
      </div>
      <div class="field-group">
        <label for="weight-st">Weight</label>
        <div class="input-wrap">
          <input id="weight-st" name="weightSt" type="number" min="0" step="1" placeholder="st" inputmode="numeric" aria-label="Weight in stones">
          <span class="unit-label">st</span>
          <input id="weight-lb" name="weightLb" type="number" min="0" max="13.99" step="any" placeholder="lbs" inputmode="decimal" aria-label="Weight in pounds" required>
          <span class="unit-label">lbs</span>
        </div>
      </div>`;
  }

  fields.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", calculateBMI);
  });
}

function getMeasurements() {
  if (currentUnit === "metric") {
    const height = Number(document.querySelector("#height-cm").value) / 100;
    const weight = Number(document.querySelector("#weight-kg").value);
    if (!height || !weight || height <= 0 || weight <= 0) return null;
    return { height, weight };
  }

  const feet = Number(document.querySelector("#height-ft").value || 0);
  const inches = Number(document.querySelector("#height-in").value || 0);
  const stones = Number(document.querySelector("#weight-st").value || 0);
  const pounds = Number(document.querySelector("#weight-lb").value || 0);
  const totalInches = feet * 12 + inches;
  const totalPounds = stones * 14 + pounds;
  if (totalInches <= 0 || totalPounds <= 0) return null;
  return { height: totalInches * 0.0254, weight: totalPounds * 0.45359237 };
}

function getCategory(bmi) {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "a healthy weight";
  if (bmi < 30) return "overweight";
  return "obese";
}

function calculateBMI() {
  const measurements = getMeasurements();
  if (!measurements) {
    resultIntro.hidden = false;
    resultContent.hidden = true;
    errorMessage.hidden = true;
    return;
  }

  const { height, weight } = measurements;
  const bmi = weight / (height * height);
  const lowerWeight = 18.5 * height * height;
  const upperWeight = 24.9 * height * height;
  const category = getCategory(bmi);

  resultIntro.hidden = true;
  resultContent.hidden = false;
  errorMessage.hidden = true;
  bmiNumber.textContent = bmi.toFixed(1);
  resultDescription.textContent = `Your BMI suggests you're ${category}.`;
  const lower = currentUnit === "metric"
    ? `${lowerWeight.toFixed(1)}kgs`
    : `${(lowerWeight / 0.45359237).toFixed(1)}lbs`;
  const upper = currentUnit === "metric"
    ? `${upperWeight.toFixed(1)}kgs`
    : `${(upperWeight / 0.45359237).toFixed(1)}lbs`;
  healthyRange.innerHTML = `A healthy weight range for your height is <strong>${lower} – ${upper}</strong>.`;
}

unitRadios.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    currentUnit = event.target.value;
    errorMessage.hidden = true;
    resultIntro.hidden = false;
    resultContent.hidden = true;
    renderFields();
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const measurements = getMeasurements();
  if (!measurements) {
    errorMessage.hidden = false;
    return;
  }
  calculateBMI();
});

renderFields();
