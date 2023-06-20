const navBtn = document.querySelectorAll(".navigation .navBtn");
const indicator = document.querySelectorAll(".indicator");
const page = document.querySelectorAll(".page");

// ////// Function For navigation /////////////////////
// ////////////////////////////////////////////////////
function navigate() {
  navBtn.forEach((btn) => {
    btn.classList.remove("active");
    this.classList.add("active");
  });

  for (let i = 0; i < navBtn.length; i++) {
    indicator.forEach((ind) => {
      ind.classList.remove(`p-${i}`);
    });
    page[i].style.display = `none`;

    if (navBtn[i] == this) {
      indicator.forEach((ind) => {
        ind.classList.add(`p-${i}`);
        page[i].style.display = `flex`;
      });
    }
  }
}
navBtn.forEach((btn) => btn.addEventListener("click", navigate));

// ///////// Function For edit budget ////////////////////
// ///////////////////////////////////////////////////////
const amountArray = [1300, 1400];
const btnEdit = document.querySelectorAll(".budgetPage .edit");
const btnSubmit = document.querySelectorAll(".budgetPage .submit");
const btnDiscard = document.querySelectorAll(".budgetPage .discard");
const inputField = document.querySelectorAll(".amountField");

// ///////////// Auto expand input field ////////////
function autoExpand(x) {
  let length = x.value.length;
  if (length <= 4) {
    x.style.width = `4rem`;
  } else {
    x.style.width = `${length}rem`;
  }
}

// ///// Set value from array //////////////////
function setInputValue() {
  for (let i = 0; i < amountArray.length; i++) {
    inputField[i].value = amountArray[i];
    inputField[i].disabled = true;
  }
}
setInputValue();

// ///// Click event on edit button ////////////
btnEdit.forEach((btn) => {
  btn.addEventListener("click", function () {
    for (let i = 0; i < btnEdit.length; i++) {
      if (btnEdit[i] == this) {
        btnEdit[i].parentElement.classList.add("open");
        inputField[i].removeAttribute("disabled");
        inputField[i].focus();
      }
    }
  });
});

// ///// Click event on submit button ////////////
btnSubmit.forEach((btn) => {
  btn.addEventListener("click", function () {
    for (let i = 0; i < btnSubmit.length; i++) {
      if (btnSubmit[i] == this) {
        btnSubmit[i].parentElement.classList.remove("open");
        amountArray[i] = inputField[i].value;
        autoExpand(inputField[i]);
        inputField[i].disabled = true;
      }
    }
  });
});

// ///// Click event on discard button ////////////
btnDiscard.forEach((btn) => {
  btn.addEventListener("click", function () {
    for (let i = 0; i < btnDiscard.length; i++) {
      if (btnDiscard[i] == this) {
        btnDiscard[i].parentElement.classList.remove("open");
        inputField[i].value = amountArray[i];
        autoExpand(inputField[i]);
        inputField[i].disabled = true;
      }
    }
  });
});

// ///////// Function For add new budget ////////////////////
// //////////////////////////////////////////////////////////
