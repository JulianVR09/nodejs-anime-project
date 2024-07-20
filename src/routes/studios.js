import { Router } from "express";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerStudio = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const studiosFilePath = path.join(_dirname, "../../data/studios.json");

const readStudiosFs = async () => {
    try{
        const studios = await fs.readFile(studiosFilePath);
        return JSON.parse(studios);
    } catch (err){
        throw new Error(`Error reading studios file: ${err}`);
    };
};

const writeStudiosFs = async (studios) => {
    await fs.writeFile(studiosFilePath, JSON.stringify(studios, null, 2));
};

routerStudio.post("/", async (req, res) => {
    const studios = await readStudiosFs();
    const newStudio = {
        id: studios.length + 1,
        name: req.body.name
    };
    studios.push(newStudio);
    await writeStudiosFs(studios);
    res.status(201).send(`Studio created successfully ${json.stringify(newStudio)}`);
});

routerStudio.get("/", async (req, res) => {
    const studios = await readStudiosFs();
    res.json(studios);
});

routerStudio.get("/:id", async (req, res) => {
    const studios = await readStudiosFs();
    const studio = studios.find(s => s.id === parseInt(req.params.id));
    if(!studio){
        return res.status(404).send({message: "No studio found"});
    };
    res.json(studio);
});

routerStudio.put("/:id", async (req, res) => {
    const studios = await readStudiosFs();
    const indexStudio = studios.findIndex(s => s.id === parseInt(req.params.id));
    if(indexStudio === -1){
        return res.status(404).send({message: "No studio found"});
    };
    const updateStudio = {
        ...studios[indexStudio],
        name: req.body.name
    };
    studios[indexStudio] = updateStudio;
    await writeStudiosFs(studios);
    res.send(`Studio updated successfully ${JSON.stringify(updateStudio)}`);
});

routerStudio.delete("/:id", async (req, res) => {
    const studios = await readStudiosFs();
    const indexStudio = studios.findIndex(s => s.id === parseInt(req.params.id));
    if(indexStudio === -1) {
        return res.status(404).send(`Studio not found`);
    };
    const deleteStudio = animes.splice(indexStudio, 1);
    await writeStudiosFs(deleteStudio);
    res.send(`Studio deleted successfully`);
});

export default routerStudio