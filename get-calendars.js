import { getTodaysLectures } from "./parse-calendars.js";
import { sleep } from "./sleep.js";
import { createTumlivePage } from "./tumlive-login.js";
import fs from "fs"

export async function fetchCalendars() {
    const { LECTURES_FILE } = process.env

    const { browser, page } = await createTumlivePage()

    await page.waitForSelector("#side-navigation > article:nth-child(4) > a")

    const links = await page.evaluate(() => {
        return [...document.querySelectorAll("#side-navigation > article:nth-child(4) > a")].map(aHref => aHref.href)
    })

    const todaysLectures = []

    for (const link of links) {
        await page.goto(link)
        await page.waitForSelector("a.tum-live-button")

        await sleep(1000)

        const icalLink = await page.evaluate(() => {
            return document.querySelector("a.tum-live-button").href
        })

        const response = await fetch(icalLink)
        const data = await response.text()

        const lectures = getTodaysLectures(data)

        lectures.forEach(lecture => {
            lecture.url = link
        })

        todaysLectures.push(...lectures)
    }

    fs.writeFileSync(LECTURES_FILE, JSON.stringify(todaysLectures, null, 2))

    await browser.close()
}