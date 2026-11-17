import { successResponse } from "../../utils/response.js";
import { signupService } from "./auth.service.js";

export const SignupController = async (req, res, next) => {
    try {
        const response = await signupService({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });
        successResponse(res, response, 201);
    } catch (error) {
        next(error);
    }
}