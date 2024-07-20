import { Router } from "express";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerAnime = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const animesFilePath = path.join(_dirname, "../../data/animes.json");

const readAnimesFs = async () => {
    try {
        const animes = await fs.readFile(animesFilePath);
        return JSON.parse(animes);
    } catch (err){
        throw new Error(`Error reading animes file: ${err}`);
    };
};

const writeAnimesFs = async (animes) => {
    await fs.writeFile(animesFilePath, JSON.stringify(animes, null, 2));
};

routerAnime.post("/", async (req, res) => {
    const animes = await readAnimesFs();
    const newAnime = {
        id: animes.length + 1,
        name: req.body.name,
        genre: req.body.genre
    };
    animes.push(newAnime);
    await writeAnimesFs(animes);
    res.status(201).send(`Anime created successfully ${json.stringify(newAnime)}`);
});

routerAnime.get("/", async (req, res) => {
    const animes = await readAnimesFs();
    res.json(animes);
});

routerAnime.get("/:id", async (req, res) => {
    const animes = await readAnimesFs();
    const anime = animes.find(e => e.id === parseInt(req.params.id));
    if(!anime){
        return res.status(404).send("Anime not found");
    }
    res.json(anime);
});

routerAnime.put("/:id", async (req, res) => {
    const animes = await readAnimesFs();
    const indexAnime = animes.findIndex(e => e.id === parseInt(req.params.id));
    if(indexAnime === -1){
        return res.status(404).send("Anime not found");
    };
    const updateAnime = {
        ...animes[indexAnime],
        name: req.body.name,
        genre: req.body.genre,
    };
    animes[indexAnime] = updateAnime;
    await writeAnimesFs(animes);
    res.send(`Anime updated successfully ${JSON.stringify(updateAnime)}`);
});

routerAnime.delete('/:id', async (req, res) => {
    const animes = await readAnimesFs();
    const indexAnime = animes.findIndex(e => e.id === parseInt(req.params.id));
    if(animes === -1){
        return res.status(404).send(`Anime not found`);
    };
    const deleteAnime = animes.splice(indexAnime, 1);
    await writeAnimesFs(deleteAnime);
    res.send(`Anime deleted successfully`);
});

export default routerAnime;