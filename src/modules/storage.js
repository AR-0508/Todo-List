import {projects, currentProjectID, selectedTodoID} from "./appState.js"

const STORAGE_KEY = "syncflow-data";

function saveData(){
    let jsObject = {
        projects,
        currentProjectID,
        selectedTodoID,
    }

    let jsonString = JSON.stringify(jsObject);

    localStorage.setItem(STORAGE_KEY, jsonString);
}

function loadData(){
    let jsonString = localStorage.getItem(STORAGE_KEY);

    if(!jsonString)
    return;

    let jsObject = JSON.parse(jsonString);

    return jsObject;
}

export {saveData, loadData};