import { formatNearAmount } from '../components/common/balance/helpers';

const parseAndFormatArguments = (encodedArgs) => {
    const argsBuffer = Buffer.from(encodedArgs, 'base64');
    const args = JSON.parse(argsBuffer.toString('utf-8'));

    const parsedArgs = {
        ...args,
        ...(args.amount && { amount: formatNearAmount(args.amount) }),
        ...(args.deposit && { deposit: formatNearAmount(args.deposit )}),
    };

    return JSON.stringify(parsedArgs, null, 2);
};

export default function getTranslationsFromMultisigRequest({ actions, receiver_id, account_id }) {
    const fullAccessKeyAction = actions.find(({ type, permission }) => type === 'AddKey' && !permission);
    if (fullAccessKeyAction) {
        return [
            {
                id: 'twoFactor.action.addKey.full',
                data: {
                    accountId: account_id,
                    publicKey: fullAccessKeyAction.public_key,
                }
            }
        ];
    }

    return actions
        .map((action) => {
            switch (action.type) {
                case 'AddKey':
                    return {
                        id: 'twoFactor.action.addKey.limited',
                        data: {
                            receiverId: receiver_id,
                            methodNames: action.permission.method_names.join(', '),
                            allowance: formatNearAmount(action.permission.allowance),
                            publicKey: action.public_key,
                        }
                    };
                case 'DeleteKey':
                    return {
                        id: 'twoFactor.action.deleteKey',
                        data: {
                            publicKey: action.public_key,
                        }
                    };
                case 'FunctionCall':
                    return {
                        id: 'twoFactor.action.functionCall',
                        data: {
                            receiverId: receiver_id,
                            methodName: action.method_name,
                            deposit: formatNearAmount(action.deposit),
                            args: parseAndFormatArguments(action.args),
                        }
                    };
                case 'Transfer':
                    return {
                        id: 'twoFactor.action.transfer',
                        data:{
                            receiverId: receiver_id,
                            amount: formatNearAmount(action.amount),
                        }
                    };
                default:
                    return {};
            }
        });
};
