// A utility function to handle asynchronous route handlers in Express.js
const asyncHandler = (fn) => (req, res, next) => {
    // Wrap the async function and catch any errors
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;