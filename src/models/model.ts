import {   clientcon } from "../db/connect";


export async function createUser() {
    const query = `CREATE TABLE IF NOT EXISTS todos_user (
        id SERIAL PRIMARY KEY ,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    try {
    
        const result = await clientcon.query(query)
        console.log(result);
    } catch (error:any) {
        console.log("error in creating the table", error.stack)
    }
}

export async function createTodos(){
    const query = `CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY ,
        uid INTEGER ,
        todo_title VARCHAR(40) ,
        todo_desc VARCHAR(255) ,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uid) REFERENCES todos_user(id) ON DELETE CASCADE

    )`

    try {
    
        const result = await clientcon.query(query)
        console.log(result);
    } catch (error:any) {
        console.log("error in creating the table", error.stack)
    }
}