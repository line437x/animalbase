"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];

// The prototype for all animals:
//---------- MODEL ----------
const Animal = {
  winner: false,
  star: false,
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
};

const settings = {
  filterBy: "all",
  sortBy: "name",
  sortDir: "asc",
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
  // filterList(filter);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

// sort allAnimals with the correct sort function and put info filterAnimals
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //find old sortBy element
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");

  //indicate active sort
  event.target.classList.add("sortby");

  //toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  console.log(`user selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;

  buildList();
}

// get filter depending on data-filter attribute
function filterList(filteredList) {
  // let filteredList = allAnimals;
  if (settings.filterBy === "cat") {
    filteredList = allAnimals.filter(isCat);
  } else if (settings.filterBy === "dog") {
    filteredList = allAnimals.filter(isDog);
  }
  return filteredList;
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  // closure
  function sortByProperty(a, b) {
    // console.log(`sortBy is ${sortBy}`);
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
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

  //fixed so we filter and sort on the first load
  buildList();
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

  //-------stars------
  // append clone to list
  clone.querySelector("[data-field=star]").dataset.star = animal.star;
  // Make stars clickable
  clone.querySelector("[data-field=star]").addEventListener("click", selectStar);

  function selectStar() {
    if (animal.star === true) {
      animal.star = false;
    } else {
      animal.star = true;
    }
    buildList();
  }

  //-------winners------
  // append clone to list
  clone.querySelector("[data-field=winner]").dataset.winner = animal.winner;
  // Make trophy clickable
  clone.querySelector("[data-field=winner]").addEventListener("click", selectWinner);

  function selectWinner() {
    if (animal.winner === true) {
      animal.winner = false;
    } else {
      animal.winner = true;
    }
    buildList();
  }

  document.querySelector("#list tbody").appendChild(clone);
}

function buildList() {
  const currentList = filterList(allAnimals);
  const sortedList = sortList(currentList);

  displayList(sortedList);
}
