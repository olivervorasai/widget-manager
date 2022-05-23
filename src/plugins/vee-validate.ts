import { defineRule, configure } from 'vee-validate';
import AllRules from '@vee-validate/rules';

function isKeyOfObject<T>(
    key: string | number | symbol,
    obj: T
): key is keyof T {
    return key in obj;
}

export default {
    install: () => {
        Object.keys(AllRules).forEach((rule) => {
            defineRule(rule, AllRules[rule]);
        });

        const errorMessages = {
            required: 'This field is required',
        };

        configure({
            generateMessage: (context) => {
                const ruleName = context.rule?.name;

                if (ruleName && isKeyOfObject(ruleName, errorMessages)) {
                    return errorMessages[ruleName];
                } else {
                    return 'This field is invalid';
                }
            },
        });
    },
};
