import {testCronJob} from './test.cron';
import {removeOldTokensCronJob} from './remove-old-tokens.cron';
import {removeOldPasswordsCronJob} from './remove-old-passwords.cron';
import {oldVisitorCronJob} from './old-visitor.crone';

export const cronRunner = () => {
    testCronJob.start();
    removeOldTokensCronJob.start();
    removeOldPasswordsCronJob.start();
    oldVisitorCronJob.start();

};