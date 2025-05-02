const express = require("express");
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/userControllers");

const router = express.Router();

/**
 * @swagger
 * /users:
 *  get:
 *    summary: Get all users
 *    description: Retrieve a list of all users
 *    responses:
 *      200:
 *        description: A list of users
 *      500:
 *        description: Internal server error
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    summary: Get a user by ID
 *    description: Retrieve a user by its ID
 *    responses:
 *      200:
 *        description: A user object
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal server error
 */
router.get("/:id", getUserById);

/**
 * @swagger
 * /users:
 *  post:
 *    summary: Create a new user
 *    description: Create a new user in the system
 *    responses:
 *      201:
 *        description: User created successfully
 *      400:
 *        description: Bad request
 */
router.post("/", createUser);

/**
 * @swagger
 * /users/{id}:
 *  put:
 *    summary: Update a user by ID
 *    description: Update a user by its ID
 *    responses:
 *      200:
 *        description: User updated successfully
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal server error
 */
router.put("/:id", updateUser);

/**
 * @swagger
 * /users/{id}:
 *  delete:
 *    summary: Delete a user by ID
 *    description: Delete a user by its ID
 *    responses:
 *      200:
 *        description: User deleted successfully
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal server error
 */
router.delete("/:id", deleteUser);

module.exports = router;
