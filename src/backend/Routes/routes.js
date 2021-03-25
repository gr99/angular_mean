const express = require('express');
const router = express.Router();
const multer = require("multer");
const authControllers=require("../Controllers/authControllers");
const {store_image} = require("./multer");

router.get("",authControllers.get_orders);
router.post("",multer({storage:store_image}).single('image'),authControllers.post_orders);
router.get("/:id",authControllers.get_post);
router.delete("/:id",authControllers.delete_post);
router.put("/:id",multer({storage:store_image}).single('image'),authControllers.update_Post);

module.exports = router;
