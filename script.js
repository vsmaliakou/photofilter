const inputs = document.querySelectorAll(".main input[type='range']");
const presets = document.querySelector(".presets");
const reset = document.querySelector(".btn-reset");
const loadInput = document.querySelector(".btn-load");
const images = document.querySelectorAll("img");
const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");
const save = document.querySelector(".btn-save");
const image = document.querySelector(".main-photo");
const style = document.documentElement.style;

function handleUpdate() {
  const suffix = this.dataset.sizing || "";
  const output = document.querySelector(`output[name=${this.name}]`);

  document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
  output.innerHTML = this.value;
}

const defaultFilters = {
  blur: "0px",
  invert: "0%",
  sepia: "0%",
  saturate: "100%",
  "hue-rotate": "0deg",
  contrast: "100%",
  brightness: "100%",
  grayscale: "0%",
};

function setPreset(e) {
  if (!e.target.matches(".presetImg")) return;

  const filters = {};

  if (e.target.style["filter"]) {
    e.target.style["filter"].split(" ")?.forEach((el) => {
      filters[el.match(/^[a-zA-Z\-]+/)] = el.match(/\d+[^\)]+/)?.pop();
    });
  } else {
    filters = { ...defaultFilters };
  }

  setFilters(filters);
}

function setFilters(filters) {
  filters = { ...defaultFilters, ...filters };

  for (const key in filters) {
    style.setProperty(`--${key}`, filters[key]);

    const input = document.querySelector(`input[name=${key}]`);
    const output = document.querySelector(`output[name=${key}]`);

    input.value = filters[key].match(/\d+/);
    output.value = input.value;
  }
}

function resetFilters() {
  setFilters(defaultFilters);
}

function loadImage(e) {
  if (!e.target.files[0]) return;

  let reader = new FileReader();

  reader.onload = function () {
    images.forEach((image) => image.src = reader.result);
  };

  reader.readAsDataURL(e.target.files[0]);
}

function saveImage() {
  const filters = {};
  const link = document.createElement("a");
  let sumFilters = "";

  for (let key in defaultFilters) {
    let filterValue = style.getPropertyValue(`--${key}`) || defaultFilters[key];

    if (key === "blur") {
      const coefficient = image.naturalHeight / image.height;
      filterValue = filterValue.match(/\d+/) * coefficient + "px";
    }

    filters[key] = filterValue;
  }

  for (let key in filters) {
    sumFilters += `${key}(${filters[key]})`;
  }

  canvas.width = image.width;
  canvas.height = image.height;
  context.filter = sumFilters;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  link.download = "photofilter-image.png";
  link.href = canvas.toDataURL();
  link.click();
}

inputs.forEach((input) => input.addEventListener("change", handleUpdate));
inputs.forEach((input) => input.addEventListener("mousemove", handleUpdate));
presets.addEventListener("click", setPreset);
reset.addEventListener("click", resetFilters);
loadInput.addEventListener("change", loadImage);
save.addEventListener("click", saveImage);