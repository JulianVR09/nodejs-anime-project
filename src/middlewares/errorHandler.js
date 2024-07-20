const errorHandler = (err, req, res) => {
    console.error(err.stack);
    res.status(500).json({ "error": err.message, "message": "ocurrio un error"});
}

export default errorHandler;