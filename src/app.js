import express from 'express';
import routerAnime from './routes/animes.js';
import routerStudio from './routes/studios.js';
import errorHandler from './middlewares/errorHandler.js';
import routerDirector from './routes/directors.js';
import routerCharacter from './routes/characters.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/animes", routerAnime);
app.use("/studios", routerStudio);
app.use("/directors", routerDirector)
app.use("/characters", routerCharacter);
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
});