import {testCronJob} from './test.cron';
import {removeOldTokensCronJob} from './remove-old-tokens.cron';

export const cronRunner = () => {
    testCronJob.start();
    removeOldTokensCronJob.start();

};