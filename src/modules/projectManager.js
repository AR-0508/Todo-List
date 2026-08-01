import {projects, currentProjectID, setCurrentProjectID} from "./appState.js";
import {saveData, loadData} from "./storage.js";
import createProject from "./project.js";

function getProjectByID(id){
    for(let i = 0; i < projects.length; i++)
        if(id === projects[i].id)
            return projects[i];
    
    return undefined;
}

function getCurrentProject(){
    return getProjectByID(currentProjectID);
}

function setCurrentProject(projectID){
    const project = getProjectByID(projectID);

    if(project)
    setCurrentProjectID(projectID);

    saveData();
}

function addProject(name){
    let newProject = createProject(name);
    projects.push(newProject);

    saveData();
}

function deleteProject(projectID){
    let project = getProjectByID(projectID);

    if(!project)
        return;

    if(project.name === "Default")
        return;

    const projectIndex = projects.findIndex(project => project.id === projectID);
    projects.splice(projectIndex, 1);

    if(projectID === currentProjectID){
       const defaultProject = projects.find(project => project.name === "Default");

       setCurrentProject(defaultProject.id)
    }

    saveData();
}

export {
    getProjectByID,
    getCurrentProject,
    setCurrentProject,
    addProject,
    deleteProject
};
