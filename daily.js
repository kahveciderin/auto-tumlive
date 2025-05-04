import { fetchCalendars } from "./get-calendars.js";
import { getTodaysLectures } from "./parse-calendars.js";
import fs from "fs";
import dotenv from 'dotenv';

dotenv.config()
const { LECTURES_FILE } = process.env

export async function runDaily() {

    await fetchCalendars()

    const lectures = getTodaysLectures()

    fs.writeFileSync(LECTURES_FILE, JSON.stringify(lectures, null, 2))

    console.log("done")
}


await runDaily()