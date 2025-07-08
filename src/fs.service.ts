import * as fs from 'node:fs/promises';

import path from 'node:path';
import {IUser} from "./interfaces/user.interface.js";

const read = async () => {
    try{
        const pathToFile = path.join (process.cwd(), 'db.json');
        const data = await fs.readFile(pathToFile, 'utf8');
        return data? JSON.parse(data) : [];
    } catch(err) {
        console.log('write error', err.message);
    }
};
const write = async (users:IUser) => {
    try{
        const pathToFile = path.join (process.cwd(), 'db.json');
        await fs.writeFile(pathToFile, JSON.stringify(users), 'utf8');
    }catch(err) {
        console.log('write error', err.message);
    }
}
export {read, write}