
// TODO: Convert to modules!
/**
 * @type string[]
 */
const arrows = [];

const getHiddenInputEl = () => document.getElementById('arrows'); 
const getEditArrowEl = () => document.getElementById('edit-arrow'); 

function handleArrowAdd(e) {
  // e.preventDefault();
  const hiddenInputEl = getHiddenInputEl();
  const inputEl = document.getElementById('arrowInput');

  arrows.push(inputEl.value);
  hiddenInputEl.value = arrows.join(' ');
  inputEl.value = '';

  htmx.ajax('post', '/new/calc', {target: '#details', values: {'arrows': arrows.join(' ') }});
}

function editArrow(idx) {
  const hiddenInputEl = getHiddenInputEl();
  const inputEl = getEditArrowEl();

  const editArrowIndexEl = document.getElementById('edit-arrow-index');
  arrows[editArrowIndexEl.value] = inputEl.value;
  hiddenInputEl.value = arrows.join(' ');
  closeEditDialog();
  htmx.ajax('post', '/new/calc', {target: '#details', values: {'arrows': arrows.join(' ') }});
}

function openEditDialog(arrowIndex) {
  const editDialogEl = document.getElementById('edit-dialog');
  editDialogEl.showModal();
  const inputEl = document.getElementById('edit-arrow');
  inputEl.value = arrows[arrowIndex];
  const editArrowIndexEl = document.getElementById('edit-arrow-index');
  editArrowIndexEl.value = arrowIndex;
}

function closeEditDialog() {
  const editDialogEl = document.getElementById('edit-dialog');
  editDialogEl.close();

  const inputEl = document.getElementById('edit-arrow');
  inputEl.value = '';
}
