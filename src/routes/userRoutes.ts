import { Router, Request, Response } from "express";
import { clientcon } from "../db/connect";

const router = Router()

enum statusCode {
    "badRequest" = 400,
    "serverError" = 500,
    "success" = 200

}

router.post("/newuser", async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(statusCode.badRequest).json({ message: "all fields are required" })
    }
    try {
        const query = "INSERT INTO todos_user (username, email, password) VALUES ($1, $2, $3) RETURNING *";
        const values = [username, email, password];

        const result = await clientcon.query(query, values)
        res.status(201).json({ user: result.rows[0] });

    } catch (error) {
        console.error("Error inserting user", error);
        res.status(statusCode.serverError).json({ error: "Error inserting user" });
    }
})


router.get("/", async (req: Request, res: Response) => {
    const { username } = req.query

    if (!username) {
        return res.status(statusCode.badRequest).json({ message: "Username is required" });
    }
    try {
        const query = `SELECT * FROM todos_user WHERE username ILIKE $1`

        const values = [`%${username}%`]

        const result = await clientcon.query(query, values)

        if (result.rows.length === 0) {
            return res.status(statusCode.badRequest).json({ message: "No user were found" })
        }

        return res.status(statusCode.success).json(result.rows)
    } catch (error) {
        console.error("Error in fetching users", error)
        res.status(statusCode.serverError).json({ message: "Inernal server error" })
    }

})

router.put("/update", async (req: Request, res: Response) => {
    const { username } = req.query

    const { newname } = req.body

    if (!username) {
        return res.status(statusCode.badRequest).json({ message: "Username is required" });
    }
    try {
        const query = `UPDATE todos_user SET username = $1 WHERE username = $2 RETURNING *`

        const values = [newname, username]

        const result = await clientcon.query(query, values)

            return res.status(statusCode.success).json({message : `User ${username} updated successfully` , user : result.rows[0]})
        } catch (error) {
        console.error("Error in updating users", error)

        res.status(statusCode.serverError).json({ message: "Inernal server error" })
    }
})

router.delete("/delete", async (req: Request, res: Response) => {
    const { username } = req.query

    if (!username) {
        return res.status(statusCode.badRequest).json({ message: "Username is required" });
    }

    try {
        const query = `DELETE FROM todos_user WHERE username = $1 RETURNING *` //RETURNING *: This clause returns the deleted row(s)
        const values = [username]

        const result = await clientcon.query(query, values)

        if (result.rowCount && result.rowCount > 0) {
            console.log(`User '${username}' deleted successfully.`);
            return res.status(200).json({ message: `User '${username}' deleted successfully.`, user: result.rows[0] });
        } else {
            console.log(`User '${username}' not found.`);
            return res.status(404).json({ message: `User '${username}' not found.` });
        }
    } catch (error: any) {
        console.error("Error deleting user:", error.stack);
        return res.status(500).json({ error: "Error deleting user" });
    }
})

export default router;