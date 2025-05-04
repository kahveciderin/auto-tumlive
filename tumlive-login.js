import puppeteer from "puppeteer";
import { sleep } from "./sleep.js";

export async function createTumlivePage(headless = true) {
    const { TUM_USERNAME, TUM_PASSWORD } = process.env

    const browser = await puppeteer.launch({
        headless,
        args: ['--start-fullscreen'],
        defaultViewport: null,
    })

    const page = await browser.newPage()

    await page.goto("https://tum.live/login")

    await page.waitForSelector(".tum-live-button")

    await page.click(".tum-live-button")

    await page.waitForSelector("#username")
    await page.waitForSelector("#password")
    await page.waitForSelector("#btnLogin")

    await page.type("#username", TUM_USERNAME)
    await page.type("#password", TUM_PASSWORD)

    await page.click("#btnLogin")

    await page.waitForNavigation()

    await sleep(1000)

    return { browser, page }
}