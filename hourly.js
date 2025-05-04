import { launchLecture } from "./launch-lecture.js";
import { waitUntil } from "./sleep.js";
import fs from "fs";
import dotenv from 'dotenv';

dotenv.config()

const { LECTURES_FILE } = process.env

export async function hourly() {
    const now = new Date();
    const oneHourLater = new Date(now);
    oneHourLater.setHours(now.getHours() + 1);

    const lectures = JSON.parse(fs.readFileSync(LECTURES_FILE, "utf-8")).map(lecture => ({
        ...lecture,
        start: new Date(lecture.start),
        end: new Date(lecture.end)
    }));
    const lecturesInNextHour = lectures.filter(lecture => lecture.start >= now && lecture.start <= oneHourLater);
    const lecturesInNextHourSorted = lecturesInNextHour.sort((a, b) => a.start - b.start);
    const nextLecture = lecturesInNextHourSorted[0];

    if (nextLecture) {
        console.log(`Next lecture: ${nextLecture.url} at ${nextLecture.start}`);
        await waitUntil(nextLecture.start);
        console.log("Launching lecture...");

        await launchLecture(nextLecture);
    } else {
        console.log("No upcoming lectures.");
    }
}

hourly()