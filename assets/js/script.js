const list = document.querySelectorAll(".f-list");
const l0 = document.querySelector(".l-0");
const l1 = document.querySelector(".l-1");
const l2 = document.querySelector(".l-2");
const l3 = document.querySelector(".l-3");
const indicator = document.querySelector(".indicator");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("active");
    this.classList.add("active");
  });
  if (l0.classList.contains("active")) {
    indicator.classList.add("p-0");
    indicator.classList.remove("p-2");
    indicator.classList.remove("p-3");
    indicator.classList.remove("p-1");
  }
  if (l1.classList.contains("active")) {
    indicator.classList.add("p-1");
    indicator.classList.remove("p-2");
    indicator.classList.remove("p-3");
    indicator.classList.remove("p-0");
  }
  if (l2.classList.contains("active")) {
    indicator.classList.add("p-2");
    indicator.classList.remove("p-1");
    indicator.classList.remove("p-3");
    indicator.classList.remove("p-0");
  }
  if (l3.classList.contains("active")) {
    indicator.classList.add("p-3");
    indicator.classList.remove("p-2");
    indicator.classList.remove("p-1");
    indicator.classList.remove("p-0");
  }
}

list.forEach((item) => item.addEventListener("click", activeLink));

// ////////////// Dropdown list /////////////////////
// //////////////////////////////////////////////////
const search = document.querySelector(".cat-search");
const catBox = document.querySelector(".bForm-box");

// Array of categories. it has to be taken from database
let categories = ["Salary", "Pocket money", "Real estate", "Business", "Rent"];
const catList = document.querySelector(".cat-list");

// Function to add categories /////////////////////
function addCategory() {
  categories.forEach((item) => {
    let li = document.createElement("li");
    li.textContent = item;

    catList.appendChild(li);
  });
}
addCategory();

// Implementing search functionality /////////////////////
search.addEventListener("keyup", function () {
  const searchTerm = search.value.toLowerCase();
  const listItem = document.querySelectorAll(".cat-list li");

  if (searchTerm == "") {
    listItem.forEach((item) => {
      item.remove();
    });

    addCategory();
    selectList();
  }

  categories.forEach((category) => {
    if (category.toLowerCase().startsWith(searchTerm) & (searchTerm != "")) {
      const searchedArr = [];
      searchedArr.push(category);

      listItem.forEach((item) => {
        item.remove();
      });

      searchedArr.forEach((item) => {
        let li = document.createElement("li");
        li.textContent = item;
        catList.appendChild(li);
        selectList();
      });
    }
  });
});

search.addEventListener("click", function () {
  catBox.classList.add("list-open");
  search.placeholder = "Search";
});

// Function to close list and add text into search box
function selectList() {
  const listItem = document.querySelectorAll(".cat-list li");
  listItem.forEach((item) => {
    item.addEventListener("click", function () {
      search.value = item.innerHTML;
      catBox.classList.remove("list-open");
      search.placeholder = "Category";
    });
  });
}
selectList();
