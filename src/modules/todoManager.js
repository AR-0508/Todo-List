import {projects, currentProjectID, selectedTodoID, setSelectedTodoID} from "./appState.js";
import {saveData, loadData} from "./storage.js";
import { getCurrentProject } from "./projectManager.js";
import createTodo from "./todo.js";

function addTodo(name, desc, date, priority, notes){
    let currentProject = getCurrentProject();

    const newTodo = createTodo(name, desc, date, priority, notes);
    currentProject.todos.push(newTodo);

    saveData();
}

function getTodoByID(todoID){
    let currentProject = getCurrentProject();

    for(let i = 0; i < currentProject.todos.length; i++){
        if(currentProject.todos[i].id === todoID)
            return currentProject.todos[i];
    }

    return undefined;
}

function getSelectedTodo(){
    return getTodoByID(selectedTodoID);
}

function setSelectedTodo(todoID){
    let todo = getTodoByID(todoID);

    if(todo)
    setSelectedTodoID(todoID);

    saveData();
}

function deleteTodo(todoID){
    let todo = getTodoByID(todoID);
    let currentProject = getCurrentProject();

    if(!todo)
        return;

    const todoIndex = currentProject.todos.findIndex(todo => todo.id === todoID);
    currentProject.todos.splice(todoIndex, 1);

    if(todoID === selectedTodoID)
    setSelectedTodoID(null);

    saveData();
}

function updateTodo(todoID, name, desc, date, priority, notes){
    let todo = getTodoByID(todoID);

    if(!todo)
    return;

    todo.title = name;
    todo.description = desc;
    todo.dueDate = date;
    todo.priority = priority;
    todo.notes = notes;

    saveData();
}

function toggleTodoCompleted(todoID){
    let todo = getTodoByID(todoID);

    if (!todo)
    return;

    todo.completed = !todo.completed;

    saveData();
}

function addSubtask(name){
    let selectedTodo = getSelectedTodo();

    if (!selectedTodo)
    return;

    selectedTodo.subtasks.push({
        id : crypto.randomUUID(),
        name : name, 
        completed : false,
    });

    saveData();
}

function deleteSubtask(id){
    let selectedTodo = getSelectedTodo();

    if (!selectedTodo)
    return;

    let subtaskIndex = selectedTodo.subtasks.findIndex(subtask => subtask.id === id);

    if(subtaskIndex === -1)
    return;

    selectedTodo.subtasks.splice(subtaskIndex, 1);

    saveData();
}

function toggleSubtaskCompleted(id){
    let todo = getSelectedTodo();

    if(!todo)
    return;

    let subtask = todo.subtasks.find(subtask => subtask.id === id);

    if(!subtask)
    return;

    subtask.completed = !subtask.completed;

    saveData();
}

export {addTodo, getTodoByID, toggleTodoCompleted, getSelectedTodo, setSelectedTodo, deleteTodo, updateTodo, addSubtask, deleteSubtask, toggleSubtaskCompleted};