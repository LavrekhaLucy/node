import {CronJob} from 'cron';
import {timeHelper} from '../helpers/time.helper';
import {oldPasswordRepository} from '../repositores/old-password.repository';

const handler = async () => {
    try {

        const date = timeHelper.subtractByParams(180, 'day');
        const deletedCount = await oldPasswordRepository. deleteByParams({createdAt: {$lt: date}});
        console.log(`Deleted ${deletedCount} old passwords`);
    } catch (error) {
        console.error(error);
    }
};

export const removeOldPasswordsCronJob = new CronJob('* * * * 1 *', handler);
