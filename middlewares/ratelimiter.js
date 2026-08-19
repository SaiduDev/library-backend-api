import rateLimit from "express-rate-limit";

export let studentLoginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many login attempt "
    }
});

export let adminLoginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 4,
    message: {
        success: false,
        message: "Too many login attempt"
    }
})