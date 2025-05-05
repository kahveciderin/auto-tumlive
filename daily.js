import { fetchCalendars } from "./get-calendars.js";
import dotenv from 'dotenv';

dotenv.config()

export async function runDaily() {

    await fetchCalendars()

    console.log("done")
}


await runDaily()