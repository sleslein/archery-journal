// TODO: Convert to modules!

const getHiddenInputEl = () => document.getElementById("arrows");
function getHiddenInputValue() {
  return getHiddenInputEl().value;
}
function setHiddenInputValue(val) {
  const hiddenInputEl = getHiddenInputEl();
  hiddenInputEl.value = val;
}
const getEditArrowEl = () => document.getElementById("edit-arrow");
const getArrowInputEl = () => document.getElementById("arrowInput");

const inputEl = getArrowInputEl();
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleArrowAdd();
    e.preventDefault();
  }
});

function handleArrowAdd() {
  const arrowArray = getHiddenInputValue().split(" ");

  arrowArray.push(inputEl.value);
  setHiddenInputValue(arrowArray.join(" "));
  inputEl.value = "";

  htmx.ajax("post", "/new/calc", {
    target: "#details",
    values: { "arrows": arrowArray.join(" ") },
  });
}

function editArrow() {
  const arrowArray = getHiddenInputValue().split(" ");
  const inputEl = getEditArrowEl();

  const editArrowIndexEl = document.getElementById("edit-arrow-index");
  arrowArray[editArrowIndexEl.value] = inputEl.value;
  setHiddenInputValue(arrowArray.join(" "));
  closeEditDialog();
  htmx.ajax("post", "/new/calc", {
    target: "#details",
    values: { "arrows": arrowArray.join(" ") },
  });
}

function openEditDialog(arrowIndex) {
  const editDialogEl = document.getElementById("edit-dialog");
  editDialogEl.showModal();

  const hiddenArrowVal = getHiddenInputEl().value;
  const hiddenArrows = hiddenArrowVal.split(" ");
  const inputEl = document.getElementById("edit-arrow");
  inputEl.value = hiddenArrows[arrowIndex];
  const editArrowIndexEl = document.getElementById("edit-arrow-index");
  editArrowIndexEl.value = arrowIndex;
}

function closeEditDialog() {
  const editDialogEl = document.getElementById("edit-dialog");
  editDialogEl.close();

  const inputEl = document.getElementById("edit-arrow");
  inputEl.value = "";
}

document.getElementById("edit-arrow").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    editArrow();
  }
});
