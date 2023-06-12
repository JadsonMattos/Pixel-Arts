const title = document.createElement('h1');
title.id = 'title';
title.innerText = 'Paleta de Cores';
document.body.appendChild(title);

const palette = document.createElement('div');
palette.id = 'color-palette';
palette.style.display = 'flex';

const selectColor = (event) => {
  const selected = document.querySelector('.selected');
  if (selected) {
    selected.classList.remove('selected');
  }
  event.target.classList.add('selected');
};

const makeColor = () => {
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  return randomColor;
};

const saveColors = (colors) => {
  localStorage.setItem('colorPalette', JSON.stringify(colors));
};

const getColors = () => {
  const colors = JSON.parse(localStorage.getItem('colorPalette'));
  return colors;
};

const savedColors = Array.isArray(getColors()) ? getColors() : ['black', makeColor(), makeColor(), makeColor()];
saveColors(savedColors);

savedColors.forEach((color, index) => {
  const itemColor = document.createElement('div');
  itemColor.classList.add('color');
  itemColor.style.backgroundColor = color;
  itemColor.style.border = '1px solid black';
  itemColor.style.width = '50px';
  itemColor.style.height = '50px';
  itemColor.style.display = 'inline-block';
  if (index === 0) {
    itemColor.classList.add('selected');
  }
  itemColor.addEventListener('click', selectColor);
  palette.appendChild(itemColor);
});
document.body.appendChild(palette);

const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';

const buttonRandomColor = document.createElement('button');
buttonRandomColor.id = 'button-random-color';
buttonRandomColor.innerText = 'Cores aleatórias';
buttonContainer.appendChild(buttonRandomColor);

buttonRandomColor.addEventListener('click', () => {
  const itemColor = document.querySelectorAll('.color');
  const newColors = ['black'];
  for (let i = 1; i < itemColor.length; i += 1) {
    const newColor = makeColor();
    itemColor[i].style.backgroundColor = newColor;
    newColors.push(newColor);
  }
  saveColors(newColors);
});

const board = document.createElement('div');
board.id = 'pixel-board';

const createPixel = () => {
  const pixel = document.createElement('div');
  pixel.classList.add('pixel');
  pixel.style.backgroundColor = 'white';
  pixel.style.border = '1px solid black';
  pixel.style.width = '40px';
  pixel.style.height = '40px';
  return pixel;
};

const createRow = (size) => {
  const row = document.createElement('div');
  row.style.display = 'flex';
  for (let j = 0; j < size; j += 1) {
    const pixel = createPixel();
    row.appendChild(pixel);
  }
  return row;
};

const fillPixel = (event) => {
  const selectedColor = document.querySelector('.selected').style.backgroundColor;
  event.target.style.backgroundColor = selectedColor;
};

const clearBoard = () => {
  const pixels = document.querySelectorAll('.pixel');
  pixels.forEach((pixel) => {
    pixel.style.backgroundColor = 'white';
  });
};

const setBoard = () => {
  const pixels = document.querySelectorAll('.pixel');
  const atual = {};
  pixels.forEach((pixel, index) => {
    atual[index] = pixel.style.backgroundColor;
  });
  localStorage.setItem('pixelBoard', JSON.stringify(atual));
};

const getBoard = () => {
  const atual = JSON.parse(localStorage.getItem('pixelBoard'));
  if (atual) {
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach((pixel, index) => {
      pixel.style.backgroundColor = atual[index];
    });
  }
};

const storedBoardSize = localStorage.getItem('boardSize');
const boardSize = storedBoardSize ? parseInt(storedBoardSize, 10) : 5;

const limitBoardSize = (size) => {
  if (size < 5) {
    return 5;
  } else if (size > 50) {
    return 50;
  }
  return size;
};

const createInitialBoard = () => {
  const limitedSize = limitBoardSize(boardSize);
  for (let i = 0; i < limitedSize; i += 1) {
    const row = createRow(limitedSize);
    board.appendChild(row);
    row.querySelectorAll('.pixel').forEach((pixel) => {
      pixel.addEventListener('click', fillPixel);
      pixel.addEventListener('click', setBoard);
    });
  }
};

const makeBoard = () => {
  const size = input.value;
  if (size === '' || size < 1) {
    alert('Board inválido!');
    return;
  }
  const limitedSize = limitBoardSize(Number(size));
  clearBoard();
  localStorage.removeItem('pixelBoard');
  board.innerHTML = '';
  for (let i = 0; i < limitedSize; i++) {
    const row = createRow(limitedSize);
    board.appendChild(row);
    row.querySelectorAll('.pixel').forEach((pixel) => {
      pixel.addEventListener('click', fillPixel);
      pixel.addEventListener('click', setBoard);
    });
  }
  localStorage.setItem('boardSize', limitedSize.toString());
};

document.body.appendChild(board);

const buttonClear = document.createElement('button');
buttonClear.id = 'clear-board';
buttonClear.innerText = 'Limpar';
buttonClear.style.display = 'inline-block';
buttonContainer.appendChild(buttonClear);

buttonClear.addEventListener('click', clearBoard);

document.body.insertBefore(buttonContainer, board);

const divSizeBoard = document.createElement('div');
const label = document.createElement('label');
label.setAttribute('for', 'board-size');
label.textContent = 'Tamanho do Quadro:';
divSizeBoard.appendChild(label);

const input = document.createElement('input');
input.setAttribute('type', 'number');
input.setAttribute('id', 'board-size');
input.setAttribute('min', '1');
divSizeBoard.appendChild(input);

const buttonGenerateBoard = document.createElement('button');
buttonGenerateBoard.setAttribute('id', 'generate-board');
buttonGenerateBoard.textContent = 'VQV';
divSizeBoard.appendChild(buttonGenerateBoard);

palette.insertAdjacentElement('afterend', divSizeBoard);

buttonGenerateBoard.addEventListener('click', makeBoard);

window.addEventListener('load', () => {
  createInitialBoard();
  getBoard();
});
