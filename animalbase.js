"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let filter;
// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
};

function start() {
  console.log("ready");

  // TODO: Add event-listeners to filter and sort buttons
  const filterButtons = document.querySelectorAll("[data-action=filter]");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", filtering);
  });

  loadJSON();
}

//---------- MODEL ----------
// get filter depending on data-filter attribute
function filtering() {
  let filteredAnimals;
  filter = this.dataset.filter;
  switch (filter) {
    case "cat":
      filteredAnimals = filterData(isCat);
      break;
    case "dog":
      filteredAnimals = filterData(isDog);
      break;
    case "*":
      filteredAnimals = filterData(all);
      break;
  }
  // call displayList (filteredAnimals)
  displayList(filteredAnimals);
}

// filter allAnimals with the correct filter function and put info filterAnimals
function filterData(filterFunction) {
  let filteredAnimals = allAnimals.filter(filterFunction);
  return filteredAnimals;
}

// isCat function
function isCat(animal) {
  if (animal.type === "cat") {
    return true;
  } else {
    return false;
  }
}

// isDog function
function isDog(animal) {
  if (animal.type === "dog") {
    return true;
  } else {
    return false;
  }
}

// all function
function all() {
  return true;
}
// -------------------------------------------------------

async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allAnimals = jsonData.map(preapareObject);

  // TODO: This might not be the function we want to call first
  displayList(allAnimals);
}

function preapareObject(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;

  return animal;
}

function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // create clone
  const clone = document.querySelector("template#animal").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
