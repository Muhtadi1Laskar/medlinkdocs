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

export const loginService = async ({ email, password }) => {
    const existingUser = await findUser(email);

    if (!existingUser) {
        throw new ApiError(
            404,
            "INVALID_CREDENTIALS",
            "Invalid Email Address"
        );
    }

    if (!await bcrypt.compare(password, existingUser.password)) {
        throw new ApiError(
            403,
            "INVALID_CREDENTIALS",
            "Invalid Password"
        );
    }

    const payload = {
        user: {
            id: existingUser.user_id
        }
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return {
        message: "Login Successful",
        authToken: token,
        users: {
            name: `${existingUser.first_name} ${existingUser.last_name}`,
            email: existingUser.email
        }
    };
}