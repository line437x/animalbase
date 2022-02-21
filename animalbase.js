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

  // // TODO: Add event-listeners to filter and sort buttons
  registerButtons();

  loadJSON();
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

// filter allAnimals with the correct filter function and put info filterAnimals
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  // console.log(`user selected ${filter}`);
  filterList(filter);
}

// sort allAnimals with the correct sort function and put info filterAnimals
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  console.log(`user selected ${sortBy} - ${sortDir}`);
  sortList(sortBy, sortDir);
}

//---------- MODEL ----------
// get filter depending on data-filter attribute
function filterList(filterBy) {
  let filteredList = allAnimals;
  if (filterBy === "cat") {
    filteredList = allAnimals.filter(isCat);
  } else if (filterBy === "dog") {
    filteredList = allAnimals.filter(isDog);
  }
  displayList(filteredList);
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
  // call the function which is filtering
  // compareName(displayAnimal);
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

function sortList(sortBy, sortDir) {
  let sortedList = allAnimals;
  let direction = 1;
  if (sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  // closure
  function sortByProperty(a, b) {
    console.log(`sortBy is ${sortBy}`);
    if (a[sortBy] < b[sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  displayList(sortedList);
}
