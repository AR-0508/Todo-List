import { set } from "date-fns";
import createProject from "./project.js";

let  projects = [];
let selectedTodoID = null;
let currentProjectID = null;

projects.push(createProject("Default"));
currentProjectID = projects[0].id;

function setCurrentProjectID(projectID) {
    currentProjectID = projectID;
}

function setSelectedTodoID(todoID) {
    selectedTodoID = todoID;
}

function setState(savedData){
    if(!savedData)
    return;

    projects = savedData.projects;
    currentProjectID = savedData.currentProjectID;
    selectedTodoID = savedData.selectedTodoID;
}

function getState(){
    return {
        projects,
        currentProjectID,
        selectedTodoID,
    };
}

export {projects, currentProjectID, selectedTodoID, setCurrentProjectID, setSelectedTodoID, setState, getState};