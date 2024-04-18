function clearResult() {
  var resultTable = document.getElementById('result');
  resultTable.innerHTML = '';

  var colorPreviewContainer = document.getElementById('colorPreviewContainer');
  colorPreviewContainer.classList.add('hidden');
}

document.getElementById('colorForm').addEventListener('submit', function(event) {
  event.preventDefault();
  clearResult();

  var desiredColor = document.getElementById('desiredColor').value;
  var totalGram = parseFloat(document.getElementById('totalGram').value); // Menggunakan parseFloat
  var colorType = document.querySelector('input[name="colorType"]:checked').value;

  // Validasi input gram
  if (totalGram <= 0 || isNaN(totalGram)) {
    alert('Total gram harus lebih besar dari nol.');
    return;
  }

  var tempDiv = document.createElement('div');
  tempDiv.style.backgroundColor = desiredColor;
  document.body.appendChild(tempDiv);
  var computedStyle = window.getComputedStyle(tempDiv);
  var colorValues = computedStyle.backgroundColor;
  document.body.removeChild(tempDiv);

  var colorGrams;
  if (colorType === 'rgb') {
    colorGrams = calculateRgbColor(colorValues, totalGram);
    displayColor('result', colorGrams.red.toFixed(2), 'red');
    displayColor('result', colorGrams.green.toFixed(2), 'green');
    displayColor('result', colorGrams.blue.toFixed(2), 'blue');
  } else {
    colorGrams = calculateCmykColor(colorValues, totalGram);
    displayColor('result', colorGrams.c.toFixed(2), 'cyan');
    displayColor('result', colorGrams.m.toFixed(2), 'magenta');
    displayColor('result', colorGrams.y.toFixed(2), 'yellow');
    displayColor('result', colorGrams.k.toFixed(2), 'black');
  }

  showResult();
  displayColorPreview(desiredColor);
});

function calculateRgbColor(colorValues, totalGram) {
  var rgbValues = {
    r: parseInt(colorValues.substring(colorValues.indexOf('(') + 1, colorValues.indexOf(','))),
    g: parseInt(colorValues.substring(colorValues.indexOf(',') + 1, colorValues.lastIndexOf(','))),
    b: parseInt(colorValues.substring(colorValues.lastIndexOf(',') + 1, colorValues.indexOf(')')))
  };

  var redGram = Math.round(rgbValues.r / 255 * totalGram);
  var greenGram = Math.round(rgbValues.g / 255 * totalGram);
  var blueGram = Math.round(rgbValues.b / 255 * totalGram);

  // Perbaikan total berat agar sesuai dengan input
  var totalRgb = redGram + greenGram + blueGram;
  var ratio = totalGram / totalRgb;
  redGram *= ratio;
  greenGram *= ratio;
  blueGram *= ratio;

  return { red: redGram, green: greenGram, blue: blueGram };
}

function calculateCmykColor(colorValues, totalGram) {
  var rgbValues = {
    r: parseInt(colorValues.substring(4, colorValues.indexOf(','))),
    g: parseInt(colorValues.substring(colorValues.indexOf(',') + 1, colorValues.lastIndexOf(','))),
    b: parseInt(colorValues.substring(colorValues.lastIndexOf(',') + 1, colorValues.indexOf(')')))
  };

  var r = rgbValues.r / 255;
  var g = rgbValues.g / 255;
  var b = rgbValues.b / 255;

  var k = 1 - Math.max(r, g, b);
  var c = (1 - r - k) / (1 - k);
  var m = (1 - g - k) / (1 - k);
  var y = (1 - b - k) / (1 - k);

  var cGram = Math.round(c * totalGram);
  var mGram = Math.round(m * totalGram);
  var yGram = Math.round(y * totalGram);
  var kGram = Math.round(k * totalGram);

  // Perbaikan total berat agar sesuai dengan input
  var totalCmyk = cGram + mGram + yGram + kGram;
  var ratio = totalGram / totalCmyk;
  cGram *= ratio;
  mGram *= ratio;
  yGram *= ratio;
  kGram *= ratio;

  return { c: cGram, m: mGram, y: yGram, k: kGram };
}

function showResult() {
  var resultTable = document.getElementById('result');
  resultTable.classList.remove('hidden');
}

function displayColorPreview(color) {
  var colorPreview = document.getElementById('colorPreview');
  colorPreview.style.backgroundColor = color;
}

function displayColor(tableId, grams, color) {
  var resultTable = document.getElementById(tableId);
  var row = resultTable.insertRow(-1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);

  cell1.innerHTML = '<div class="colorContainer"><div class="colorPreview" style="background-color:' + color + '"></div></div>';
  cell2.innerHTML = grams + ' g';
}