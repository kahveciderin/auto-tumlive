export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export function waitUntil(targetDate, maxChunkMs = 60 * 60 * 1000) {
    return new Promise((resolve) => {
        const targetTs = targetDate.getTime();

        function check() {
            const now = Date.now();
            if (now >= targetTs) {
                return resolve();
            }
            const remaining = targetTs - now;
            const delay = Math.min(remaining, maxChunkMs);
            setTimeout(check, delay);
        }

        check();
    });
}