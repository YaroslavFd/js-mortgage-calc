import { priceFormatter, priceFormatterDecimals } from "./formatters.js";

const maxPrice = 100000000,
  percentMin = 0.15,
  percentMax = 0.9;

const inputCost = document.querySelector('#input-cost'),
  inputDownPayment = document.querySelector('#input-downpayment'),
  inputTerm = document.querySelector('#input-term'),
  form = document.querySelector('#form'),
  totalCost = document.querySelector('#total-cost'),
  totalMonthPayment = document.querySelector('#total-month-payment');

const cleavePriceSetting = {
  numeral: true,
  numeralThousandsGroupStyle: 'thousand',
  delimiter: ' '
};

const cleaveCost = new Cleave(inputCost, cleavePriceSetting);
const cleaveDownPayment = new Cleave(inputDownPayment, cleavePriceSetting);
const cleaveTerm = new Cleave(inputTerm, cleavePriceSetting);

calcMortgage();

form.addEventListener('input', () => {
  calcMortgage();
});

function calcMortgage() {
  let cost = +cleaveCost.getRawValue();
  if (cost > maxPrice) {
    cost = maxPrice;
  }

  const totalAmount = cost - +cleaveDownPayment.getRawValue();
  totalCost.textContent = priceFormatter.format(totalAmount);

  const creditRate = +document.querySelector('input[name="program"]:checked').value;
  const monthRate = (creditRate * 100) / 12;

  const years = +cleaveTerm.getRawValue();
  const months = years * 12;

  const monthPayment = (totalAmount * monthRate) / (1 - (1 + monthRate) * (1 - months));
  totalMonthPayment.textContent = priceFormatterDecimals.format(monthPayment);
}

const sliderCost = document.querySelector('#slider-cost');

noUiSlider.create(sliderCost, {
  start: 12000000,
  connect: 'lower',
  step: 100000,
  range: {
    min: 375000,
    '50%': [10000000, 1000000],
    max: 100000000,
  },
});

sliderCost.noUiSlider.on('slide', function () {
  const sliderValue = parseInt(sliderCost.noUiSlider.get(true));
  cleaveCost.setRawValue(sliderValue);
  calcMortgage();
});

const sliderDownpayment = document.querySelector('#slider-downpayment');

noUiSlider.create(sliderDownpayment, {
  start: 6000000,
  connect: 'lower',
  step: 100000,
  range: {
    min: parseInt(sliderCost.noUiSlider.get(true)) * percentMin,
    max: parseInt(sliderCost.noUiSlider.get(true)) * percentMax,
  },
});

sliderDownpayment.noUiSlider.on('slide', function () {
  const sliderValue = parseInt(sliderDownpayment.noUiSlider.get(true));
  cleaveDownPayment.setRawValue(sliderValue);
  calcMortgage();
});

const sliderTerm = document.querySelector('#slider-term');

noUiSlider.create(sliderTerm, {
  start: 12,
  connect: 'lower',
  step: 1,
  range: {
    min: 1,
    max: 30,
  },
});

sliderTerm.noUiSlider.on('slide', function () {
  const sliderValue = parseInt(sliderTerm.noUiSlider.get(true));
  cleaveTerm.setRawValue(sliderValue);
  calcMortgage();
});

inputCost.addEventListener('input', () => {
  const value = +cleaveCost.getRawValue();

  sliderCost.noUiSlider.set(value);

  if (value > maxPrice) inputCost.closest('.param__details').classList.add('param__details--error');

  if (value <= maxPrice) inputCost.closest('.param__details').classList.remove('param__details--error');

});

sliderCost.noUiSlider.on('update', () => {
  sliderDownpayment.noUiSlider.updateOptions({
    range: {
      min: parseInt(sliderCost.noUiSlider.get(true)) * percentMin,
      max: parseInt(sliderCost.noUiSlider.get(true)) * percentMax,
    }
  });
});

inputCost.addEventListener('change', () => {
  inputCost.closest('.param__details').classList.remove('param__details--error');

  if (+cleaveCost.getRawValue() > maxPrice) {
    cleaveCost.setRawValue(maxPrice);
  }
});