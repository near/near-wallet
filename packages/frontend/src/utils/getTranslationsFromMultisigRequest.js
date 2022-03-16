import BN from 'bn.js';
import { utils } from 'near-api-js';

const {
    format: {
        formatNearAmount
    },
    key_pair: {
        PublicKey,
        KeyType
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

export default function getTranslationsFromMultisigRequest({ actions, receiverId, accountId }) {
    const fullAccessKeyAction = actions.find(({ enum: type, permission }) => type === 'addKey' && !permission);
    if (fullAccessKeyAction) {
        const publicKey = new PublicKey({
            keyType: KeyType.ED25519,
            data: fullAccessKeyAction.addKey.publicKey.data
        });
        return [
            {
                id: 'twoFactor.action.addKey.full',
                data: {
                    accountId,
                    publicKey: publicKey.toString(),
                }
            }
        ];
    }

    return actions
        .map(({ enum: actionType, [actionType]: action }) => {
            switch (actionType) {
                case 'addKey':
                    return {
                        id: 'twoFactor.action.addKey.limited',
                        data: {
                            receiverId,
                            methodNames: action.permission.functionCall.methodNames.join(', '),
                            allowance: formatNear(action.permission.functionCall.allowance),
                            publicKey: new PublicKey({ keyType: KeyType.ED25519, data: action.publicKey.data }).toString(),
                        }
                    };
                case 'deleteKey':
                    return {
                        id: 'twoFactor.action.deleteKey',
                        data: {
                            publicKey: new PublicKey({ keyType: KeyType.ED25519, data: action.publicKey.data }).toString(),
                        }
                    };
                case 'functionCall':
                    return {
                        id: 'twoFactor.action.functionCall',
                        data: {
                            receiverId,
                            methodName: action.methodName,
                            deposit: formatNear(action.deposit),
                            args: JSON.stringify(JSON.parse(Buffer.from(action.args).toString()), null, 2),
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
