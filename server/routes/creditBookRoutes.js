const express = require("express");

const router = express.Router();

const {

    getAllCreditEntries,
    getCreditEntryById

} = require("../controllers/creditBookController");

const {

    verifyToken,
    isAdmin

} = require("../middleware/authMiddleware");

// Get All Credit Entries
router.get(
    "/",
    verifyToken,
    isAdmin,
    getAllCreditEntries
);

// Get Credit Entry By Id
router.get(
    "/:id",
    verifyToken,
    isAdmin,
    getCreditEntryById
);

module.exports = router;