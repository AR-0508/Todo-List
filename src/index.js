import "./styles.css";
import "./modules/dom.js";
import { setState } from "./modules/appState.js";
import { loadData } from "./modules/storage.js";
import {renderAll} from "./modules/dom.js"
const savedData = loadData();

if(savedData)
setState(savedData);

renderAll();


