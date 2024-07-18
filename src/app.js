const express = require('express');
const taskskRoutes = require('./routes/tasks');
const errorHandler = require('./moddlewares/errorsHandler');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/task", taskskRoutes);
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});