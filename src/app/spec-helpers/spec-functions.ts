export async function sleepyTime(duration: number) {
    await new Promise(resolve => setTimeout(resolve, duration));
    return;
}