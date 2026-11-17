import pool from "../../config/database.js";

export const findUser = async (email) => {
    const queryStr = `
        SELECT * 
        FROM users
        WHERE email = $1
    `;
    const result = await pool.query(queryStr, [email]);

    return result.rows[0] ?? null;
}

export const userExists = async (email) => {
    const queryStr = `
        SELECT 
        EXISTS(SELECT 1 FROM users WHERE emails = $1)
    `;

    const result = await pool.query(queryStr, [email]);

    return result.rows[0].exists;
}

export const createUser = async ({
    email, 
    firstName, 
    lastName, 
    passwordHash
}) => {
    const queryStr = `
        INSERT INTO
        users (first_name, last_name, email, password)
        VALUES($1, $2, $3, $4)
        RETURNING *
    `;
    const result = await pool.query(
        queryStr,
        [firstName, lastName, email, passwordHash]
    );

    return result.rows[0] ?? null;
}