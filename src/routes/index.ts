import { Router } from "express";
import userRoutes from "./userRoutes"; // Assuming this is in the same folder
import todosRoutes from "./todosRoutes"

const router = Router();

// Use the userRoutes for routes starting with '/user'
router.use('/user', userRoutes);

router.use('/todos',todosRoutes );

export default router;
