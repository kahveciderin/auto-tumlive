import ICAL from "ical.js";
import { startOfDay, endOfDay } from "date-fns"


export function getTodaysLectures(calendarData) {
    const lectures = ICAL.parse(
        calendarData)[2]
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
        }).sort((a, b) => a.start - b.start)

    const now = new Date()
    const startOfToday = startOfDay(now)
    const endOfToday = endOfDay(now)

    const lecturesToday = lectures.filter(lecture => {
        return lecture.start >= startOfToday && lecture.end <= endOfToday
    })


    return lecturesToday
}