/* Grocery Item */

class Grocery {
  constructor(title, id){
    this.title = title;
    this.id = id;
  }
}


/* Local Storage */

class Storage {

  static getGroceries(){
    let groceries;
    
    if(localStorage.getItem('groceries')===null){
      groceries = [];
    }else{
      groceries = JSON.parse(localStorage.getItem('groceries'));
    }

    return groceries;
  }

  static getLastId(){
    let lastId; 
    if(localStorage.getItem('id')===null){
      lastId = 0;
    }else{
      lastId = JSON.parse(localStorage.getItem('id'));
    }

    return lastId;
  }

  static addGrocery(grocerie) {
    let groceries = Storage.getGroceries();

    groceries.push(grocerie);

    const id = ++grocerie.id;

    localStorage.setItem('groceries', JSON.stringify(groceries));
    localStorage.setItem('id', JSON.stringify(id));
  }

  static deleteGrocery(groceryId) {
    let groceries = Storage.getGroceries();
    
    for(let i=0;i<groceries.length;i++){
      if(groceries[i].id==groceryId){
        // Remove this grocery in the array and update it again
        groceries.splice(i, 1);
      }
    }
    localStorage.setItem('groceries', JSON.stringify(groceries));
  }

  static editGrocery(newTitle) {
    let groceries = Storage.getGroceries();
    
    groceries.forEach((grocery) => {
      if(grocery.id==liEdit.id){
        grocery.title = newTitle;
      }
    });

    localStorage.setItem('groceries', JSON.stringify(groceries));
  }

  static getTitleByID(id){
    let groceryList = Storage.getGroceries();

    let title;
    groceryList.forEach( (grocery) => {
      if(grocery.id == id){
        title = grocery.title;
      }
    });

    return title;
  }

  static isGroceryListEmpty(){
    if(JSON.parse(localStorage.getItem('groceries')).length < 1) return true;
    return false;
  }

  static clearList(){
    localStorage.setItem('groceries',JSON.stringify([]));
  }
}

/* UI Class */

class UI {
  static displayGroceries(){
      // In here I want to get the tasks from local storage and add them to the ul.
      
      const groceryList = Storage.getGroceries();

      groceryList.forEach((grocery) => {
        this.addListItem(grocery);
      }); 

      if(groceryList.length > 0){
        clearItemsDiv = document.createElement('div');

        clearItemsDiv.className = 'clear-items';

        clearItemsDiv.appendChild(document.createTextNode('Clear All Items'));

        contentCard.appendChild(clearItemsDiv);

        addListenerClearItems();
      }
  }

  static addListItem(grocery){
    // Creating the list item to add to the list
        let li = document.createElement('li');
        li.className = 'grocery-item';
        li.id = `${grocery.id}`;
        li.innerHTML = `<div class="grocery-title-container">
            <p id="grocery-title">${grocery.title}</p>
          </div>
          <div class="icon-container">
            <i id="edit-btn" class="fas fa-edit"></i>
            <i id="delete-btn" class="fas fa-trash"></i>
          </div>`;
        
        ul.appendChild(li);
  }

  static addGrocery(grocery) {
    // Whenever a grocery is added an alert is displayed
    this.showAlert('Item Added To The List', 'success');

    // Add it to the UI
    this.addListItem(grocery);

    // Update the storage
    Storage.addGrocery(grocery);

    // Clear the form
    this.clearInput();

    // Create the clear items div
    if(Storage.getGroceries().length == 1) this.createClearItemsDiv();
  }

  static removeGrocery(listItem) {
    // Show Removing alert
    this.showAlert('Item has been removed', 'delete');

    // Update the UI
    
    listItem.remove();
    
    // Update the Storage
    Storage.deleteGrocery(listItem.id);

    console.log(Storage.isGroceryListEmpty());
    // Check if Empty. If so then remove the "clear all items" div
    if(Storage.isGroceryListEmpty()){
      clearItemsDiv.remove();
      clearItemsDiv = null;
    }
  }

  static startEditGrocery(listItem) {
    
    // Change the input's text to the title of the grocerie to be edited
    titleInput.value = Storage.getTitleByID(listItem.id);

    // Change the submit button's text to "edit"

    // Change to edit mode
    isEditing = true;
    liEdit = listItem;
  }

  static finishEditGrocery(newTitle){
      // Reset the form
      this.clearInput();
      // Make the text in the submit button back to "submit"

      // Update the storage
      Storage.editGrocery(newTitle);
      // Update the UI by transversing through the child nodes of the ul and finding which one is the one with the same id
      this.changeItemListTitle(liEdit, newTitle);
      // Exit Edit mode
      isEditing = false;
      liEditID = null;

      // Show alert
      this.showAlert('Value Changed', 'edit');
    }
  
  static changeItemListTitle(li, newTitle){
    li.innerHTML = `<div class="grocery-title-container">
            <p id="grocery-title">${newTitle}</p>
          </div>
          <div class="icon-container">
            <i id="edit-btn" class="fas fa-edit"></i>
            <i id="delete-btn" class="fas fa-trash"></i>
          </div>`;
  }
  static showAlert(message, type){
    const alert = document.createElement('div');
    
    alert.className = `alert ${type}-alert`;

    const text = document.createTextNode(message);
    
    alert.appendChild(text);

    contentCard.insertBefore(alert, title);

    setTimeout(() => document.querySelector('.alert').remove(), 2000);
  }

  static clearInput(){
    form.reset();
  }

  static clearList(){
    // Rid of the clearItemsDiv
    clearItemsDiv.remove();
    clearItemsDiv = null;

    // Show Clear Alert
    this.showAlert('Items Cleared', 'clear');
    // Clear the UI
    ul.remove();
    ul = document.createElement('ul');
    ul.className = 'grocery-list';
    contentCard.appendChild(ul);
    // Clear Storage
    Storage.clearList();
  }

  static createClearItemsDiv(){
    clearItemsDiv = document.createElement('div');

    clearItemsDiv.className = 'clear-items';

    clearItemsDiv.appendChild(document.createTextNode('Clear All Items'));

    contentCard.appendChild(clearItemsDiv);

    addListenerClearItems();
  }
}

// Variables
let isEditing = false;

let liEdit;

let clearItemsDiv;

const contentCard = document.querySelector('.content-card');

const title = document.querySelector('#title');

const form = document.querySelector('.grocery-form');

const formContainer = document.querySelector('.form-container');

const titleInput = document.querySelector('.grocery-input');

let ul = document.querySelector('.grocery-list');

const li = document.querySelector('.grocery-item');

const alert = document.querySelector('.alert');

// As soon as the project is launched fill the ul

document.addEventListener('DOMContentLoaded', UI.displayGroceries());

// Event Listeners

form.addEventListener('submit', (e) => {
  
  e.preventDefault();

  if(!isEditing){
    const inputtedTitle = titleInput.value;
    
    if(inputtedTitle!==''){
      // Id will work as a primary key for the groceries and its list item will have an id equal to the grocery's id
      const grocery = new Grocery(inputtedTitle, Storage.getLastId());

      console.log(grocery.id + "New grocery ID");
      // This function also updates the UI and Storage at the same time
      UI.addGrocery(grocery);
    }
  }else{
    const newTitle = titleInput.value;

    UI.finishEditGrocery(newTitle);
  }
});

ul.addEventListener('click', (e) => {
  const target = e.target;

  switch(target.id){
    case 'edit-btn':
      const listItem = target.parentElement.parentElement;
      
      liEditID = listItem.id;

      UI.startEditGrocery(listItem);
      break;
    case 'delete-btn':
      // Get the list item clicked
      UI.removeGrocery(target.parentElement.parentElement);
      break;  
  }
});

function addListenerClearItems(){
  clearItemsDiv.addEventListener('click', () => {
    UI.clearList();
  });
}


