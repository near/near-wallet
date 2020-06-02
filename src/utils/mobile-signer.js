import { Signer } from 'near-api-js'

export class MobileSigner extends Signer {
    async getPublicKey(accountId, networkId) {
        return callMethod('getPublicKey', { accountId, networkId })
    }

    async signMessage(message, accountId, networkId) {
        const signature = Buffer.from(await callMethod('signMessage', { message, accountId, networkId}), 'base64');
        return {
            signature,
            publicKey: await this.getPublicKey(accountId, networkId)
        }
    }
}

const requests = {}
let requestId = 1;

function callMethod(methodName, args) {
    return new Promise((resolve, reject) => {
        window.webkit.messageHandlers.signer.postMessage({ methodName, args, requestId })
        requests[requestId] = { resolve, reject, methodName, args }
        requestId++;
    });
}

window.__walletCallback = function walletCallback({ requestId, result, error }) {
    const { resolve, reject, methodName, args } = requests[requestId];
    if (error) {
        const wrappedError = new Error(`Error calling ${methodName} with ${args}, requestId = ${requestId}, error = ${JSON.stringify(error)}`);
        wrappedError.data = error;
        return reject(wrappedError);
    }

    return resolve(result);
}