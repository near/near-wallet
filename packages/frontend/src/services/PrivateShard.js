import { CALIMERO_PROTOCOL_ADDRESS } from '../config';
import { wallet } from '../utils/wallet';
// TODO:
// import SDK from 'CalimeroSdk';

export async function getMetaForShard ({ shardId }) {
    const viewFunctionAccount = wallet.getAccountBasic('dontcare');
    return viewFunctionAccount.viewFunction(
        CALIMERO_PROTOCOL_ADDRESS,
        'get_meta',
        { shardId: shardId }
    );
}

export async function signShardTransaction ({ transactions, callbackUrl, privateShardId }) {
    // TODO  
    // return SDK.requestSignedCalimeroTransaction(
    //     transactions,
    //     callbackUrl,
    //     privateShardId
    // );
}
