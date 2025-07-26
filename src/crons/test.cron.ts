import { CronJob } from 'cron';

// class testCron {
//     public static async run() {
//         console.log("TestCron is running");
//     }
// }
// export const testCronJob = new CronJob("0,10,20,30 * * * * *", testCron.run);

const handler = async () => {
    console.log('TestCron is running');
};

export const testCronJob = new CronJob('* 1 * * * *', handler);