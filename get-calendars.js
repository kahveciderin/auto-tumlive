import fs from "fs";
import { v4 } from "uuid";
import { sleep } from "./sleep.js";
import { createTumlivePage } from "./tumlive-login.js";

export async function fetchCalendars() {
    const { browser, page } = await createTumlivePage()

    await page.waitForSelector("#side-navigation > article:nth-child(4) > a")

    const links = await page.evaluate(() => {
        console.log("here")
        return [...document.querySelectorAll("#side-navigation > article:nth-child(4) > a")].map(aHref => aHref.href)
    })

    const icalLinks = new Set()

    for (const link of links) {
        await page.goto(link)
        await page.waitForSelector("a.tum-live-button")

        await sleep(1000)

        const icalLink = await page.evaluate(() => {
            return document.querySelector("a.tum-live-button").href
        })

        icalLinks.add(icalLink)
    }

    const icalUrls = [...icalLinks].map(link => new URL(link))

    console.log(icalUrls)

    await browser.close()

    const { CALENDARS_DIR } = process.env

    if (fs.existsSync(CALENDARS_DIR)) {
        fs.rmSync(CALENDARS_DIR, { recursive: true })
    }
    fs.mkdirSync(CALENDARS_DIR);

    await Promise.all(icalUrls.map(async (url) => {
        const response = await fetch(url)
        const data = await response.text()
        fs.writeFileSync(`${CALENDARS_DIR}/${v4()}.ics`, data)
    }))

    console.log("done")

    await browser.close()
}