import {CronJob} from 'cron';
import {configs} from '../configs/config';
import {timeHelper} from '../helpers/time.helper';
import {tokenRepository} from '../repositores/token.repository';

// const handler = async () => {
//     console.log('removeOldTokensCron is running');
// };
//
// export const removeOldTokensCronJob = new CronJob('0,10,20,30 * * * * *', handler);
//

// const handler = async () => {
//     console.log(configs.JWT_REFRESH_EXPIRATION);
//     // await tokenRepository.deleteByParams({})
// };
//
// export const removeOldTokensCronJob = new CronJob('0,10,20,30 * * * * *', handler);
//




const handler = async () => {
    try {
        const { value, unit } = timeHelper.parseConfigString(
            configs.JWT_REFRESH_EXPIRATION,
        );

        const date = timeHelper.subtractByParams(value, unit);
        const deletedCount = await tokenRepository.deleteBeforeDate(date);
        console.log(`Deleted ${deletedCount} old tokens`);
    } catch (error) {
        console.error(error);
    }
};

export const removeOldTokensCronJob = new CronJob('* 1 * * * *', handler);