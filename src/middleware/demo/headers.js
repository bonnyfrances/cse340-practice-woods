// Route-specific middleware that sets custom headers
const addDemoHeaders = (req, res, next) => {
    // Your task: Set custom headers using res.setHeader()

    // Add a header called 'X-Demo-Page' with value 'true'
    res.set('X-Demo-Page', 'true');
    // Add a header called 'X-Middleware-Demo' with any message you want
    res.set('X-Middleware-Demo', 'any message you want');

    next();
};

export { addDemoHeaders };