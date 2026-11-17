import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApiError } from "../../utils/error.js";
import {
    createUser,
    findUser,
    userExists
} from "./auth.repository.js";

export const signupService = async ({
    firstName,
    lastName,
    email,
    password
}) => {
    console.log("SALT: ", typeof process.env.PASSWORD_SALT);
    const salt = +process.env.PASSWORD_SALT;
    const existing = await userExists(email);


    if (existing) {
        throw new ApiError(
            409,
            "DATA_EXISTS",
            "User already exists"
        );
    }

    const passwordHash = await bcrypt.hash(password, salt);
    console.log("Password: ", passwordHash);
    const user = await createUser({
        firstName,
        lastName,
        email,
        passwordHash
    });

    if (!user) {
        throw new ApiError(
            200,
            "FAIL_DATA_CREATION",
            "Failed to create the user"
        );
    }

    return {
        message: "Successfully create the user",
        data: {
            user: {
                userId: user.user_id, 
                firstName: user.first_name, 
                lastName: user.last_name, 
                email: user.email
            }
        }
    };
}