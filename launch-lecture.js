import { exec } from 'child_process'
import { createTumlivePage } from './tumlive-login.js';
import { sleep, waitUntil } from './sleep.js';

const execAsync = (command) => {
    return new Promise((resolve) => {
        exec(command, (error) => {
            if (error) return resolve(false)
            resolve(true)
        });
    });
}

export async function launchLecture(lecture) {
    const { IPHONE_HOSTNAME, FIND_IPHONE_SCRIPT, WAKE_SCRIPT } = process.env

    const { end, url } = lecture

    let found = false;
    while (new Date() < end) {
        const script = FIND_IPHONE_SCRIPT + " " + IPHONE_HOSTNAME
        console.log("running script: ", script)
        const result = await execAsync(script)
        if (result) {
            console.log("found iphone")
            found = true
            break
        } else {
            console.log("waiting for iphone")
        }

        await sleep(5000)
    }

    if (!found) return;

    if (WAKE_SCRIPT) {
        console.log("waking up computer")
        await execAsync(WAKE_SCRIPT)
    }

    const { browser, page } = await createTumlivePage(false)

    await page.goto(url)

    await sleep(10000)

    await page.click(".vjs-big-play-button")

    await waitUntil(end)

    await browser.close()
}