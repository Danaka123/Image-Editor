const fileInput = document.querySelector(".file-input");
filterOptions = document.querySelectorAll(".filter button");
prewiewImg = document.querySelector(".preview-img img");
filterSlider = document.querySelector(".slider input");
filterName = document.querySelector(".filter-info .name");
chooseImgBtn = document.querySelector(".choose-img");
resetFilterBtn = document.querySelector(".reset-filters");
saveImgBtn = document.querySelector(".save-img");
filterValue = document.querySelector(".filter-info .value");
rotateOptions = document.querySelectorAll(".rotate button");

let brightness = 100, //яркость
  saturation = 100, //насыщенность
  inversion = 0, //инверсия
  grayscale = 0; //оттенки серого
let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

const applyFilter = () => {
  prewiewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal} , ${flipVertical})`;
  prewiewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

const loadImage = () => {
  let file = fileInput.files[0];
  if (!file) return;
  prewiewImg.src = URL.createObjectURL(file);
  prewiewImg.addEventListener("load", () => {
    resetFilterBtn.click(); //clicked reset btn
    document.querySelector(".container").classList.remove("disable");
  });
};
//Выбор кнопки Filter
filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;
    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active");

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilter();
};

rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      //if clicked img rotate left
      rotate -= 90;
    } else if (option.id === "right") {
      //if clicked img rotate right
      rotate += 90;
    } else if (option.id === "horizontal") {
      //if flip is 1, or -1
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilter();
  });
});

const resetFilter = () => {
  //reseting all value to default
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click(); //clickng brightness btn, brightness selected by default
  applyFilter();
};

const saveImage = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = prewiewImg.naturalWidth;
  canvas.height = prewiewImg.naturalHeight;

  ctx.translate(canvas.width / 2, canvas.height / 2); //translating to center
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipHorizontal, flipVertical); //flip
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.drawImage(
    prewiewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );
  // document.body.appendChild(canvas);

  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  link.click();
};

fileInput.addEventListener("change", loadImage);

filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
