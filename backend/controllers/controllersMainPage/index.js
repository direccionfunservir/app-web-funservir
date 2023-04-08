const registerUser = require("./authentication/registerUser")
const registerOwner = require("./authentication/registerOwner")
const login = require("./authentication/login")
const getUserById = require("./getUserById")
const getAllSites = require("./sites/getAllSites")
const searchSites = require("./sites/searchSites")
const logout = require("./authentication/logout")
const tokenStatus = require("./authentication/tokenStatus")
const uniqueEmailValidator = require("./authentication/uniqueEmailValidator")

module.exports = {
    registerUser,
    registerOwner,
    login,
    getUserById,
    getAllSites,
    searchSites,
    logout,
    tokenStatus,
    uniqueEmailValidator,
}