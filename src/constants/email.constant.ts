import { EmailTypeEnum } from '../enums/email-type.enum';

export const emailConstants = {
    [EmailTypeEnum.WELCOME]: {
        subject: 'Welcome to our platform',
        template: 'welcome',
    },
    [EmailTypeEnum.FORGOT_PASSWORD]: {
        subject: 'Forgot password',
        template: 'forgot-password',
    },
    [EmailTypeEnum.OLD_VISIT]: {
        subject: 'Old visit',
        template: 'old-visit',
    },
    [EmailTypeEnum.LOGOUT_ALL]: {
        subject: 'You are signed out of all devices',
        template: 'logout-all'
},
    [EmailTypeEnum.VERIFY_EMAIL]: {
        subject: 'Verify email',
        template: 'verify-email'
},
};


