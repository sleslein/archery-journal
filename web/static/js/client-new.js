// TODO: Convert to modules!
/**
 * @type string[]
 */
const arrows = [];

const getHiddenInputEl = () => document.getElementById("arrows");
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
  const hiddenInputEl = getHiddenInputEl();

  arrows.push(inputEl.value);
  hiddenInputEl.value = arrows.join(" ");
  inputEl.value = "";

  htmx.ajax("post", "/new/calc", {
    target: "#details",
    values: { "arrows": arrows.join(" ") },
  });
}

function editArrow() {
  const hiddenInputEl = getHiddenInputEl();
  const inputEl = getEditArrowEl();

  const editArrowIndexEl = document.getElementById("edit-arrow-index");
  arrows[editArrowIndexEl.value] = inputEl.value;
  hiddenInputEl.value = arrows.join(" ");
  closeEditDialog();
  htmx.ajax("post", "/new/calc", {
    target: "#details",
    values: { "arrows": arrows.join(" ") },
  });
}

function openEditDialog(arrowIndex) {
  const editDialogEl = document.getElementById("edit-dialog");
  editDialogEl.showModal();
  const inputEl = document.getElementById("edit-arrow");
  inputEl.value = arrows[arrowIndex];
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
