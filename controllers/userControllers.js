import asyncMiddleware from "../middlewares/asyncMiddleware.js";

const signup = asyncMiddleware(async (req, res, next) => {});

const logout = asyncMiddleware(async (req, res, next) => {});

const login = asyncMiddleware(async (req, res, next) => {});

export { signup, logout, login };
