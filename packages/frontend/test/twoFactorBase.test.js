const nearApiJs = require('near-api-js');

const { TwoFactorBase } = require('../src/utils/twoFactor/twoFactorBase');

const {
    KeyPair,
    multisig: { MULTISIG_CHANGE_METHODS }
} = nearApiJs;

function mock2faLimitedAccessKeys(keysToReturn) {
    return new Array(keysToReturn)
        .fill()
        .map(() => ({
            public_key: KeyPair.fromRandom('ed25519').publicKey.toString(),
        }));
}

describe('2fa batch key conversion', () => {
    let sender;
    beforeEach(async () => {
        sender = new TwoFactorBase({ connection: {} });
        sender.disable = async () => {};
    });

    test('get2faLimitedAccessKeys filters out full access keys', async() => {
        sender.getAccessKeys = async () => [{
            access_key: { permission: 'FullAccess' },
            public_key: KeyPair.fromRandom('ed25519').publicKey.toString(),
        }];

        expect(await sender.get2faLimitedAccessKeys()).toHaveLength(0);
    });

    test('get2faLimitedAccessKeys filters out LAKs with only the `confirm` method', async() => {
        sender.getAccessKeys = async () => [{
            access_key: {
                permission: {
                    FunctionCall: {
                        method_names: ['confirm'],
                        receiver_id: sender.accountId,
                    },
                },
            },
            public_key: KeyPair.fromRandom('ed25519').publicKey.toString(),
        }];

        expect(await sender.get2faLimitedAccessKeys()).toHaveLength(0);
    });

    test('get2faLimitedAccessKeys includes LAKs for requesting multisig signing', async() => {
        sender.getAccessKeys = async () => [{
            access_key: {
                permission: {
                    FunctionCall: {
                        method_names: MULTISIG_CHANGE_METHODS,
                        receiver_id: sender.accountId,
                    },
                },
            },
            public_key: KeyPair.fromRandom('ed25519').publicKey.toString(),
        }];

        expect(await sender.get2faLimitedAccessKeys()).toHaveLength(1);
    });

    test('isConversionRequiredForDisable returns false for accounts with fewer than 48 LAKs to convert', async() => {
        await Promise.all([0, 1, 2, 48].map(async (n) => {
            sender.get2faLimitedAccessKeys = async () => mock2faLimitedAccessKeys(n);
            expect(await sender.isKeyConversionRequiredForDisable()).toEqual(false);
        }));
    });

    test('isConversionRequiredForDisable returns true for accounts with 48 or more LAKs to convert', async() => {
        await Promise.all([49, 100].map(async (n) => {
            sender.get2faLimitedAccessKeys = async () => mock2faLimitedAccessKeys(n);
            expect(await sender.isKeyConversionRequiredForDisable()).toEqual(true);
        }));
    });

    test('batchConvertKeysAndDisable throws an exception for empty signing keys', async() => {
        await expect(async () => {
            await sender.batchConvertKeysAndDisable({});
        }).rejects.toBeTruthy();

        await expect(async () => {
            await sender.batchConvertKeysAndDisable({ signingPublicKey: '' });
        }).rejects.toBeTruthy();
    });

    test('batchConvertKeysAndDisable signs the expected number of transactions', async() => {
        const batches = [
            // no batches for cardinality <= 48 since these can be disabled directly
            { numberOfLaks: 1, numberOfBatches: 0 },
            { numberOfLaks: 48, numberOfBatches: 0 },
            { numberOfLaks: 49, numberOfBatches: 1 },
            { numberOfLaks: 98, numberOfBatches: 1 },
            { numberOfLaks: 99, numberOfBatches: 2 },
        ];

        await Promise.all(batches.map(async ({ numberOfLaks, numberOfBatches }) => {
            let batchesSigned = 0;
            let disableMultisigCalled = false;
            const laks = mock2faLimitedAccessKeys(numberOfLaks);
            const account = {
                ...sender,
                checkMultisigCodeAndStateStatus: async () => ({ stateStatus: 1 }),
                get2faLimitedAccessKeys: async () => laks,
                signAndSendTransaction: async () => batchesSigned++,
                disableMultisig: async () => disableMultisigCalled = true,
            };
            account.batchConvertKeysAndDisable = sender.batchConvertKeysAndDisable.bind(account);

            const signingPublicKey = (await account.get2faLimitedAccessKeys())[0];
            await account.batchConvertKeysAndDisable({
                signingPublicKey: signingPublicKey.public_key,
                contractBytes: [],
                cleanupContractBytes: [],
            });
            expect(batchesSigned).toEqual(numberOfBatches);
            expect(disableMultisigCalled).toBe(true);
        }));
    });
});
