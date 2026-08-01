import {projects, currentProjectID, selectedTodoID, setCurrentProjectID, setSelectedTodoID} from "./appState.js"
import {addProject, deleteProject, getCurrentProject, setCurrentProject} from "./projectManager.js";
import {addTodo, getTodoByID, getSelectedTodo, setSelectedTodo, toggleTodoCompleted, deleteTodo, updateTodo, addSubtask, deleteSubtask, toggleSubtaskCompleted} from "./todoManager.js";
import {saveData } from "./storage.js";
import { add } from "date-fns";

let editingTodoID = null;
let projectHeader = document.querySelector("#project-header");
let currentProjectTitle = document.querySelector("#current-project-title");

let newProjectBtn = document.querySelector("#new-project-btn");
let addTaskBtn = document.querySelector("#add-task-btn");
let deleteProjectBtn = document.querySelector("#delete-project-btn");
let cancelBtns = document.querySelectorAll(".form-cancel-btn");
let addSubtaskBtn = document.querySelector("#add-subtask-btn");

let projectDialog = document.querySelector("#project-dialog");
let addTaskDialog = document.querySelector("#add-task-dialog");
let editTaskDialog = document.querySelector("#edit-task-dialog");
let subtaskDialog = document.querySelector("#subtask-dialog");

let editTaskForm = document.querySelector("#edit-task-dialog .edit-dialog-form");
let addTaskForm = document.querySelector("#add-task-dialog .task-dialog-form");
let addProjectForm = document.querySelector("#project-dialog .project-dialog-form");
let addSubtaskForm = document.querySelector("#subtask-dialog .subtask-dialog-form");

let addTaskName = document.querySelector("#task-name");
let addTaskDesc = document.querySelector("#task-description");
let addTaskDate = document.querySelector("#due-date");
let addTaskPriority = document.querySelector("#form-priority");
let addTaskNotes = document.querySelector("#notes");

let editTaskName = document.querySelector("#edit-task-name");
let editTaskDesc = document.querySelector("#edit-task-description");
let editTaskDate = document.querySelector("#edit-due-date");
let editTaskPriority = document.querySelector("#edit-form-priority");
let editTaskNotes = document.querySelector("#edit-notes");

let addProjectName = document.querySelector("#project-name");
let addSubtaskName = document.querySelector("#subtask-name");

const projectList = document.querySelector("#project-list");
const todoList = document.querySelector("#todo-list");
const subtaskList = document.querySelector("#subtask-list");

const emptyDetails = document.querySelector("#empty-details");
const todoDetails = document.querySelector("#todo-details");

const detailTitle = document.querySelector("#detail-title");
const detailDesc = document.querySelector("#detail-description");
const detailDate = document.querySelector("#detail-due-date");
const detailPriority = document.querySelector("#detail-priority");
const detailNotes = document.querySelector("#detail-notes");

function renderProjects(){
    projectList.innerHTML = "";

    for(const project of projects){
    const projectBtn = document.createElement("button");

    projectBtn.dataset.id = project.id;
    projectBtn.textContent = project.name;
    projectBtn.classList.add("project-item");

    if(project.id === currentProjectID)
    projectBtn.classList.add("active");

    projectList.appendChild(projectBtn);
    }

    const defaultProject = projects.find(
        project => project.name === "Default"
    );

    if(
        defaultProject &&
        currentProjectID === defaultProject.id
    ){
        deleteProjectBtn.classList.add("hidden");
    }
    else{
        deleteProjectBtn.classList.remove("hidden");
    }
}

function renderTodos(){
    todoList.innerHTML = "";

    let currentProject = getCurrentProject();

    if(!currentProject)
    return;

    for(const todo of currentProject.todos){
        const todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");
        todoItem.dataset.id = todo.id;

        const todoMain = document.createElement("div");
        todoMain.classList.add("todo-main");

        const todoActions = document.createElement("div");
        todoActions.classList.add("todo-actions");
        
        const checkBox = document.createElement("input");
        checkBox.classList.add("todo-checkbox");
        checkBox.setAttribute("type", "checkbox");
        checkBox.checked = todo.completed;

        const todoTitle = document.createElement("span");
        todoTitle.classList.add("todo-title");
        todoTitle.textContent = todo.title;

        const deleteTaskBtn = document.createElement("button");
        deleteTaskBtn.classList.add("delete-task-btn");
        deleteTaskBtn.textContent = "Delete Task";

        const editTaskBtn = document.createElement("button");
        editTaskBtn.classList.add("edit-task-btn");
        editTaskBtn.textContent = "Edit Task";

        if(todo.completed){
        todoTitle.classList.add("completed");
        editTaskBtn.disabled = true;
        }

        todoMain.appendChild(checkBox);
        todoMain.appendChild(todoTitle);

        todoActions.appendChild(deleteTaskBtn);
        todoActions.appendChild(editTaskBtn);

        todoItem.appendChild(todoMain);
        todoItem.appendChild(todoActions);

        todoList.appendChild(todoItem);
    }
}

function renderTodoDetails(){
    const currentProject = getCurrentProject();

    if(!currentProject)
    return;

    let selectedTodo = currentProject.todos.find(todo => todo.id === selectedTodoID);

    if(!selectedTodo){
    emptyDetails.classList.remove("hidden");
    todoDetails.classList.add("hidden");
    addSubtaskBtn.disabled = true;
    return;
    }

    emptyDetails.classList.add("hidden");
    todoDetails.classList.remove("hidden");

    addSubtaskBtn.disabled = selectedTodo.completed; 

    detailTitle.textContent = `${selectedTodo.title}`;
    detailDesc.textContent = `${selectedTodo.description}`;
    detailDate.textContent = `${selectedTodo.dueDate}`;
    detailPriority.textContent = `${selectedTodo.priority}`;

    if(selectedTodo.priority === "low"){
    detailPriority.classList.add("priority-low");
    detailPriority.classList.remove("priority-medium");
    detailPriority.classList.remove("priority-high");
    }

    if(selectedTodo.priority === "medium"){
    detailPriority.classList.remove("priority-low");
    detailPriority.classList.add("priority-medium");
    detailPriority.classList.remove("priority-high");
    }

    if(selectedTodo.priority === "high"){
    detailPriority.classList.remove("priority-low");
    detailPriority.classList.remove("priority-medium");
    detailPriority.classList.add("priority-high");
    }
    

    detailNotes.textContent = `${selectedTodo.notes}`;
}

function renderSubtasks(){
    subtaskList.innerHTML = "";

    const currentProject = getCurrentProject();

    if(!currentProject)
    return;

    let selectedTodo = currentProject.todos.find(todo => todo.id === selectedTodoID);

    if(!selectedTodo)
    return;

    for(const subtask of selectedTodo.subtasks){
        const subtaskItem = document.createElement("div");
        subtaskItem.classList.add("subtask-item");
        subtaskItem.dataset.id = subtask.id;

        const checkBox = document.createElement("input");
        checkBox.classList.add("subtask-checkbox");
        checkBox.setAttribute("type", "checkbox");
        checkBox.checked = subtask.completed;

        const title = document.createElement("span");
        title.textContent = subtask.name;

        if(subtask.completed)
        title.classList.add("completed");     
        
        const deleteSubtaskBtn = document.createElement("button");
        deleteSubtaskBtn.classList.add("delete-subtask-btn");
        deleteSubtaskBtn.textContent = "Delete";

        subtaskItem.appendChild(checkBox);
        subtaskItem.appendChild(title);
        subtaskItem.appendChild(deleteSubtaskBtn);

        subtaskList.appendChild(subtaskItem);
    }
}

function renderAll(){
    renderProjects();
    renderTodos();
    renderTodoDetails();
    renderSubtasks();
}

function handleProjectClick(e){
    const projectID = e.target.dataset.id;
    
    if(!projectID)
    return;

    setCurrentProject(projectID);
    setSelectedTodo(null);

    let currentProject = getCurrentProject();
    currentProjectTitle.textContent = currentProject.name;

    renderAll();
}

function handleTodoClick(e){
    if(!e.target.classList.contains("todo-title"))
    return;

    const todoItem = e.target.closest(".todo-item");

    if(!todoItem)
    return;

    const todoID = todoItem.dataset.id;

    if(!todoID)
    return;

    setSelectedTodo(todoID);
    
    renderAll();
}

function handleTodoCheckbox(e){
    if(!e.target.classList.contains("todo-checkbox"))
    return;

    const todoItem = e.target.closest(".todo-item");

    if(!todoItem)
    return;

    const todoID = todoItem.dataset.id;

    if(!todoID)
    return;

    toggleTodoCompleted(todoID);

    renderAll();
}

function handleDeleteTodo(e){
    if(!e.target.classList.contains("delete-task-btn"))
    return;

    const todoItem = e.target.closest(".todo-item");

    if(!todoItem)
    return;

    const todoID = todoItem.dataset.id;

    if(!todoID)
    return;

    deleteTodo(todoID);

    renderAll();
}

function handleEditTodo(e){
    if(!e.target.classList.contains("edit-task-btn"))
    return;

    const todoItem = e.target.closest(".todo-item");

    if(!todoItem)
    return;

    const todoID = todoItem.dataset.id;

    if(!todoID)
    return;

    const todo = getTodoByID(todoID);
    if(!todo)
    return;

    editingTodoID = todoID;

    editTaskName.value = todo.title;
    editTaskDesc.value = todo.description;
    editTaskDate.value = todo.dueDate;
    editTaskPriority.value = todo.priority;
    editTaskNotes.value = todo.notes;

    editTaskDialog.showModal();
}

function handleEditFormSubmit(e){
    e.preventDefault();

    if(!e.submitter.classList.contains("form-create-btn"))
    return;

    const todo = getTodoByID(editingTodoID);
    if(!todo)
    return;

    updateTodo(editingTodoID, editTaskName.value, editTaskDesc.value, editTaskDate.value, editTaskPriority.value, editTaskNotes.value);

    editTaskForm.reset();
    editTaskDialog.close();
    editingTodoID = null;

    renderAll();
}

function handleAddProject(e){
    e.preventDefault();

    addProject(addProjectName.value);

    projectDialog.close();
    addProjectForm.reset();

    renderAll();
}

function handleAddTodo(e){
    e.preventDefault();

    addTodo(addTaskName.value, addTaskDesc.value, addTaskDate.value, addTaskPriority.value, addTaskNotes.value);
    
    addTaskForm.reset();
    addTaskDialog.close();
    renderAll();
}

function handleDeleteProject(){
    let currentProject = getCurrentProject();
    if(!currentProject)
    return;

    const defaultProject = projects.find(project => project.name === "Default");
    if(!defaultProject)
    return;

    if(currentProject.id === defaultProject.id)
    return;

    deleteProject(currentProject.id);

    setCurrentProject(defaultProject.id);
    setSelectedTodo(null);

    saveData();
    renderAll();
}

function handleAddSubtask(e){
    e.preventDefault();

    if(!e.submitter.classList.contains("form-create-btn"))
    return;

    addSubtask(addSubtaskName.value);

    addSubtaskForm.reset();
    subtaskDialog.close();

    renderAll()
}

function handleDeleteSubtask(e){
    if(!e.target.classList.contains("delete-subtask-btn"))
    return;

    const subtask = e.target.closest(".subtask-item");
    if(!subtask)
    return;

    const subtaskID = subtask.dataset.id;
    if(!subtaskID)
    return;

    deleteSubtask(subtaskID);

    renderAll();
}

function handleSubtaskCheckbox(e){
    if(!e.target.classList.contains("subtask-checkbox"))
    return;

    const subtask = e.target.closest(".subtask-item");
    if(!subtask)
    return;

    const subtaskID = subtask.dataset.id;
    if(!subtaskID)
    return;

    toggleSubtaskCompleted(subtaskID);

    renderAll();
}

projectList.addEventListener("click", (e) => {
    handleProjectClick(e);
});

todoList.addEventListener("click", (e) => {
    handleTodoClick(e);
}); 

todoList.addEventListener("click", (e) => {
    handleTodoCheckbox(e);
}); 

todoList.addEventListener("click", (e) => {
    handleDeleteTodo(e);
}); 

todoList.addEventListener("click", (e) => {
    handleEditTodo(e);
}); 

subtaskList.addEventListener("click", (e) => {
    handleDeleteSubtask(e);
});

subtaskList.addEventListener("click", (e) => {
    handleSubtaskCheckbox(e);
});

editTaskForm.addEventListener("submit", (e) => {
    handleEditFormSubmit(e);
}); 

addTaskForm.addEventListener("submit", (e) => {
    handleAddTodo(e);
});

addProjectForm.addEventListener("submit", (e) => {
    handleAddProject(e);
});

addSubtaskForm.addEventListener("submit", (e) => {
    handleAddSubtask(e);
});


newProjectBtn.addEventListener("click", () => {
    projectDialog.showModal();
});

deleteProjectBtn.addEventListener("click", () => {
    handleDeleteProject();
});

addTaskBtn.addEventListener("click", () => {
   addTaskDialog.showModal(); 
});

addSubtaskBtn.addEventListener("click", () => {
    subtaskDialog.showModal();
});

for(let btn of cancelBtns){
    btn.addEventListener("click", () => {
        projectDialog.close();
        addTaskDialog.close();
        editTaskDialog.close();
        subtaskDialog.close();
    });
}

export {renderAll};