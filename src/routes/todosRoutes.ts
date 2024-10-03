import { Request, Response, Router } from "express";
import { clientcon } from "../db/connect";

const router = Router()

enum statusCode {
    "badRequest" = 400,
    "serverError" = 500,
    "success" = 200,
    "successCreation" = 201

}

router.post("/newtodos", async (req: Request, res: Response) => {
    const { uid, todo_title, todo_desc } = req.body

    if (!uid || !todo_title || !todo_desc) {
        return res.status(statusCode.badRequest).json({ message: "all fields are required" })
    }

    const query = `INSERT INTO todos (uid ,todo_title , todo_desc) VALUES ($1 , $2 , $3) RETURNING *`

    const values = [uid, todo_title, todo_desc]

    try {
        const result = await clientcon.query(query, values)

        res.status(statusCode.successCreation).json({ user: result.rows[0] });

    } catch (error: any) {

        if (error.code === '23503') {
            return res.status(statusCode.badRequest).json({ error: "User does not exist" });
        }

        console.error("Error inserting user", error);


        res.status(statusCode.serverError).json({ error: "Error inserting todos" });
    }
})

router.get("/get/:uid", async (req: Request, res: Response) => {
    const uid  = req.params.uid

    if (!uid) {
        return res.status(statusCode.badRequest).json({ message: "User ID is required" });
    }

    const query = `SELECT * FROM todos WHERE uid = $1`

    try {
        const result = await clientcon.query(query, [uid])

        res.status(statusCode.success).json({ todos: result.rows })
    } catch (error: any) {
        console.error("Error fetching todos", error.stack)

        res.status(statusCode.serverError).json({ message: "error in fetching todos" })
    }
})

router.delete("/del/:id", async (req: Request, res: Response) => {
    const id = req.params.id

    if (!id) {
        return res.status(statusCode.badRequest).json({ message: "User ID is required" });
    }

    try {
        const query = `DELETE FROM todos WHERE id = $1 RETURNING *`

        const values = [id]
        const result = await clientcon.query(query, values)

        if (result.rowCount && result.rowCount > 0) {
            console.log(`todos '${id}' deleted successfully.`);
            return res.status(statusCode.success).json({ message: `todos '${id}' deleted successfully.`, user: result.rows[0] });
        }
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return res.status(statusCode.serverError).json({ error: "Error deleting user" });
    }

})

router.put("/update/:id", async (req:Request , res:Response) => {
    const id = req.params.id 

    const {todo_title , todo_desc} = req.body

    if (!id){
        return res.status(statusCode.badRequest).json({ message: "User ID is required" });
    }

    try {
        const query = `UPDATE todos SET todo_title = $1 , todo_desc = $2 WHERE id = $3 RETURNING *`

        const values = [todo_title , todo_desc , id] 

        const result = await clientcon.query(query , values)

        return res.status(statusCode.success).json({ message : "todos updated successfully" , todos : result.rows[0] })
    } catch (error) {
        console.log(error)
        res.status(statusCode.serverError).json({ message : "Internal server error"})
    }
})


export default router;