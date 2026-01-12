import { pool } from @config / db;
import { RootDataPacket } from 'mysql2';

interface Word extends RowDataPacket {
    id: number;
    word: string;
    meaning: string;
}
export const getWords = async (): Promise<Word[]=> {
    const [rows] = await pool.query < Word[] > {
        'SELECT id, word, meaning FROM words'
    }
    return rows;
}>