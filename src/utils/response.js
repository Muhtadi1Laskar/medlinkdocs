export const successResponse = (res, body, statusCode) => {
    return res.status(statusCode).json(body);
}

export const errorResponse = (res, body, statusCode) => {
    return res.status(statusCode).json(body);
}