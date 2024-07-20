import { Router } from "express";
import { promises as fs} from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerCharacter = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const characterFilePath = path.join(_dirname, "../../data/characters.json");

const readCharactersFs = async () => {
    try {
        const characters = await fs.readFile(characterFilePath);
        return JSON.parse(characters);
    } catch (err){
        throw new Error(`Error reading characters file: ${err}`);
    };
};

const writeCharactersFs = async (characters) => {
    await fs.writeFile(characterFilePath, JSON.stringify(characters, null, 2));
};

routerCharacter.post("/", async (req, res) => {
    const characters = await readCharactersFs();
    const newCharacter = {
        id: characters.length + 1,
        name: req.body.name,
    };
    characters.push(newCharacter);
    await writeCharactersFs(characters);
    res.status(201).send(`Character created successfully ${newCharacter}`);
});

routerCharacter.get("/", async (req, res) => {
    const characters = await readCharactersFs();
    res.json(characters);
});

routerCharacter.get("/:id", async (req, res) => {
    const characters = await readCharactersFs();
    const character = characters.find(c => c.id === parseInt(req.params.id));
    if(!character){
        return res.status(404).send(`Character not found`)
    };
    res.json(character);
});

routerCharacter.put("/:id", async (req, res) => {
    const characters = await readCharactersFs();
    const indexCharacter = characters.findIndex(c => c.id === parseInt(req.params.id));
    if(indexCharacter === -1){
        return res.status(404).send(`Character not found`);
    };
    const updatedCharacter = {
       ...characters[indexCharacter],
        name: req.body.name 
    };
    characters[indexCharacter] = updatedCharacter;
    await writeCharactersFs(characters);
    res.send(`Character updated successfully ${JSON.stringify(updatedCharacter)}`);
});

routerCharacter.delete("/:id", async (req, res) => {
    const characters = await readCharactersFs();
    const indexCharacter = characters.findIndex(c => c.id === parseInt(req.params.id));
    if(indexCharacter === -1){
        return res.status(404).send(`Character not found`);
    };
    const deleteCharacter = characters.splice(indexCharacter, 1);
    await writeCharactersFs(deleteCharacter);
    res.send(`Character deleted successfully`);
});

export default routerCharacter