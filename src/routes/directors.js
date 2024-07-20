import { Router } from "express";
import { promises as fs} from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerDirector = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const directorsFilePath = path.join(_dirname, "../../data/directors.json");

const readDirectorsFs = async () => {
    try{
        const directors =  await fs.readFile(DirectorsFilePath);
        return JSON.parse(directors);
    } catch(err){
        throw new Error(`Error reading directors file: ${err}`);
    };
};

const writeDirectorsFs = async () => {
    await fs.writeFile(DirectorsFilePath, JSON.stringify(directors, null, 2));
};

routerDirector.post('/', async (req, res) => {
    const directors = await readDirectorsFs();
    const newDirector = {
        id: directors.length + 1,
        name: req.body.name,
    };
    directors.push(newDirector);
    await writeDirectorsFs(directors);
    res.status(201).send(`Directors created successfully ${json.stringify(newDirector)}`);
});

routerDirector.get('/', async (req, res) => {
    const directors = await readDirectorsFs();
    res.json(directors);
})

routerDirector.get('/:id', async (req, res) => {
    const directors = await readDirectorsFs();
    const director = directors.find(d => d.id === parseInt(req.params.id));
    if(!director){
        return res.status(404).send(`Directors not found`);
    };
    res.json(director);
});

routerDirector.put('/:id', async (req, res) => {
    const directors = await readDirectorsFs();
    const directorIndex = directors.findIndex(d => d.id === parseInt(req.params.id));
    if(directorIndex === -1){
        return res.status(404).send(`Directors not found`);
    };
    const updateDirector = {
        ...directors[directorIndex],
        name: req.body.name
    };
    directors[directorIndex] = updateDirector;
    await writeDirectorsFs(directors);
    res.send(`Director updated successfully ${JSON.stringify(updateDirector)}`);
});

routerDirector.delete('/:id', async (req, res) => {
    const directors = await readDirectorsFs();
    const directorIndex = directors.findIndex(d => d.id === parseInt(req.params.id));
    if(directorIndex === -1){
        return res.status(404).send(`Director not found`);
    };
    const deleteDirector = directors.splice(directorIndex, 1);
    await writeDirectorsFs(deleteDirector);
    res.send(`Director deleted successfully ${JSON.stringify(deleteDirector)}`);
});

export default routerDirector