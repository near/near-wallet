export function buildFtxPayLink(accountId) {
    return `https://ftx.us/pay/request?coin=NEAR&address=${accountId}&tag=&wallet=near&memoIsRequired=false&memo=&allowTip=false&fixedWidth=true`;
}
