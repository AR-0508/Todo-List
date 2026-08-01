function createTodo(name, desc, date, priority, notes){
    return {
        id : crypto.randomUUID(),
        title : name,
        description : desc,
        dueDate : date,
        priority : priority,
        notes : notes,
        subtasks : [],
        completed : false,
    }
}

export default createTodo;