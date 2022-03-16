import BN from 'bn.js';
import { utils } from 'near-api-js';

const {
    format: {
        formatNearAmount
    },
    key_pair: {
        PublicKey,
    },
} = utils;


const formatNear = (amount) => {
    try {
        return formatNearAmount(amount, 4);
    } catch {
        // Near amount may be stored as hex rather than decimal
        return formatNearAmount(new BN(amount, 16).toString(), 4);
    }
};

const rawPublicKeyToString = ({ keyType, data }) => new PublicKey({ keyType, data }).toString();

const parseAndFormatArguments = (argsBuffer) => {
    const args = JSON.parse(Buffer.from(argsBuffer).toString());

    const parsedArgs = {
        ...args,
        ...(args.amount && { amount: formatNear(args.amount) }),
        ...(args.deposit && { deposit: formatNear(args.deposit )}),
    };

    return JSON.stringify(parsedArgs, null, 2);
};

export default function getTranslationsFromMultisigRequest({ actions, receiverId, accountId }) {
    const fullAccessKeyAction = actions.find(({ enum: type, [type]: action }) => type === 'addKey' && !action.accessKey.permission);
    if (fullAccessKeyAction) {
        return [
            {
                id: 'twoFactor.action.addKey.full',
                data: {
                    accountId,
                    publicKey: rawPublicKeyToString(fullAccessKeyAction.addKey.publicKey)
                }
            }
        ];
    }

    return actions
        .map(({ enum: type, [type]: action }) => {
            switch (type) {
                case 'addKey':
                    return {
                        id: 'twoFactor.action.addKey.limited',
                        data: {
                            receiverId,
                            methodNames: action.accessKey.permission.functionCall.methodNames.join(', '),
                            allowance: formatNear(action.accessKey.permission.functionCall.allowance),
                            publicKey: rawPublicKeyToString(action.publicKey),
                        }
                    };
                case 'deleteKey':
                    return {
                        id: 'twoFactor.action.deleteKey',
                        data: {
                            publicKey: rawPublicKeyToString((action.publicKey)),
                        }
                    };
                case 'functionCall':
                    return {
                        id: 'twoFactor.action.functionCall',
                        data: {
                            receiverId,
                            methodName: action.methodName,
                            deposit: formatNear(action.deposit),
                            args: parseAndFormatArguments(action.args),
                        }
                    };
                case 'transfer':
                    return {
                        id: 'twoFactor.action.transfer',
                        data:{
                            receiverId,
                            deposit: formatNear(action.deposit),
                        }
                    };
                default:
                    return {};
            }
        });
};
