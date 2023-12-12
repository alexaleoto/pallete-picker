// Define an array to store the palettes
let palettes = JSON.parse(localStorage.getItem('palettes')) || examplePalettes;

// Stack to keep track of deleted palettes for undo functionality
let deletedPalettes = [];

function createPaletteCard(palette, index) {
  const paletteDiv = document.createElement('div');
  paletteDiv.className = 'palette';
  paletteDiv.dataset.index = index; // Store the index in the dataset for later reference

  const title = document.createElement('h3');
  title.textContent = palette.title;
  paletteDiv.appendChild(title);

  palette.colors.forEach(color => {
    const colorContainer = document.createElement('div');
    colorContainer.className = 'color-sample';
    colorContainer.style.backgroundColor = color.hex;
    
    const textExample = document.createElement('span');
    textExample.className = 'text-example';
    textExample.textContent = 'Text Example';
    colorContainer.appendChild(textExample);

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = 'Copy ' + color.hex;
    copyButton.onclick = function() { copyToClipboard(color.hex); };
    colorContainer.appendChild(copyButton);

    paletteDiv.appendChild(colorContainer);
  });

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  deleteButton.textContent = 'Delete Palette';
  deleteButton.onclick = function() { deletePalette(index); };
  paletteDiv.appendChild(deleteButton);

  const temperatureBanner = document.createElement('div');
  temperatureBanner.className = 'temperature-banner ' + palette.temperature;
  temperatureBanner.textContent = palette.temperature;
  paletteDiv.appendChild(temperatureBanner);

  return paletteDiv;
}

function copyToClipboard(hex) {
  navigator.clipboard.writeText(hex).then(() => {
    alert(hex + ' copied to clipboard');
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

function renderPalettes() {
  const palettesSection = document.getElementById('palettes-section');
  palettesSection.innerHTML = '';

  palettes.forEach((palette, index) => {
    const paletteCard = createPaletteCard(palette, index);
    palettesSection.appendChild(paletteCard);
  });
}

function deletePalette(index) {
  deletedPalettes.push(palettes[index]);
  palettes.splice(index, 1);
  localStorage.setItem('palettes', JSON.stringify(palettes));
  renderPalettes();
}

function undoDelete() {
  if (deletedPalettes.length > 0) {
    const lastDeleted = deletedPalettes.pop();
    palettes.push(lastDeleted);
    localStorage.setItem('palettes', JSON.stringify(palettes));
    renderPalettes();
  } else {
    alert('No palettes to undo!');
  }
}

document.getElementById('palette-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const title = document.getElementById('palette-title').value;
  const colors = [
    { hex: document.getElementById('color1').value },
    { hex: document.getElementById('color2').value },
    { hex: document.getElementById('color3').value }
  ];
  const temperature = document.querySelector('input[name="temperature"]:checked').value;

  const newPalette = { title, colors, temperature };
  palettes.push(newPalette);
  localStorage.setItem('palettes', JSON.stringify(palettes));
  renderPalettes();

  event.target.reset();
});

// Add undo button to the DOM
const undoButton = document.createElement('button');
undoButton.textContent = 'Undo Delete';
undoButton.id = 'undo-button';
document.getElementById('app').appendChild(undoButton);
undoButton.addEventListener('click', undoDelete);

renderPalettes();

const examplePalettes = [
  {
    title: 'Marcy',
    colors: [
      { hex: '#c92929' }, 
      { hex: '#2f5a8b' },
      { hex: '#327a5f' }],
    temperature: 'neutral'
  },
  { 
    title: 'Sleek and Modern', 
    colors: [
      { hex: '#3A5199' }, 
      { hex: '#3E6990' }, 
      { hex: '#D5D6D2' }
    ], 
    temperature: 'cool' 
  },
  { 
    title: 'Winter Reds', 
    colors: [
      { hex: '#A10115' }, 
      { hex: '#C0B2B5' }, 
      { hex: '#600A0A' }
    ], 
    temperature: 'warm' 
  }

];

examplePalettes.forEach(palette => {
  const paletteCard = createPaletteCard(palette);
  document.getElementById('palettes-section').appendChild(paletteCard);
});


