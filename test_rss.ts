import { GET } from './app/rss.xml/route';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
    try {
        const res = await GET();
        const xml = await res.text();
        console.log("Status:", res.status);
        console.log("Headers:", res.headers);
        console.log("Length of XML:", xml.length);
        if (xml.length < 500) {
            console.log(xml);
        }
    } catch (e) {
        console.error("Error executing GET:", e);
    }
}
run();
