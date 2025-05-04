import ICAL from "ical.js";
import fs from "fs";
import { startOfDay, endOfDay } from "date-fns"


export function getTodaysLectures() {
    const { CALENDARS_DIR } = process.env

    const files = fs.readdirSync(CALENDARS_DIR);

    const lectures = files.map(file => ICAL.parse(
        fs.readFileSync(`${CALENDARS_DIR}/${file}`, "utf-8"))[2]
        .filter(v => v[0] === "vevent")
        .map(v => {
            const dataFilter = (label) => {
                return v[1].find(([key]) => key === label)[3]
            }

            return {
                start: new Date(dataFilter("dtstart")),
                end: new Date(dataFilter("dtend")),
                url: dataFilter("url"),
            }
        })
    ).flat().sort((a, b) => a.start - b.start)

    // todo: remove setDate, that's only for testing
    const now = new Date().setDate(5)
    const startOfToday = startOfDay(now)
    const endOfToday = endOfDay(now)

    const lecturesToday = lectures.filter(lecture => {
        return lecture.start >= startOfToday && lecture.end <= endOfToday
    })


    return lecturesToday
}