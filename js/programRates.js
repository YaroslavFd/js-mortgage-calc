import { percentFormatter } from "./formatters.js";

const programBase = 0.12,
  programIt = 0.047,
  programGov = 0.067,
  programZero = 0.108;

document.querySelector('#base-value').value = programBase;
document.querySelector('#it-value').value = programIt;
document.querySelector('#gov-value').value = programGov;
document.querySelector('#zero-value').value = programZero;

document.querySelector('#base-text').textContent = percentFormatter.format(programBase);
document.querySelector('#it-text').textContent = percentFormatter.format(programIt);
document.querySelector('#gov-text').textContent = percentFormatter.format(programGov);
document.querySelector('#zero-text').textContent = percentFormatter.format(programZero);

const programInputs = document.querySelectorAll('input[name="program"]');
const totalPercent = document.querySelector('#total-percent');

programInputs.forEach(input => {
  if (input.checked) {
    totalPercent.textContent = percentFormatter.format(input.value);
  }

  input.addEventListener('click', function () {
    totalPercent.textContent = percentFormatter.format(this.value);
  });
});