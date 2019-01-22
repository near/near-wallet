const WALLET_URL = "/login/";
const WALLET_CREATE_NEW_ACCOUNT_URL = '/create/';

const CONTRACT_CREATE_ACCOUNT_URL = 'https://studio.nearprotocol.com/contract-api/account';
const NODE_URL = "https://studio.nearprotocol.com/devnet";

const KEY_WALLET_ACCOUNTS = "wallet:accounts";
const KEY_WALLET_TOKENS = "wallet:tokens";
const KEY_ACTIVE_ACCOUNT_ID = "wallet:active_account_id";

const ACCOUNT_ID_REGEX = /^[a-z0-9@._\-]{5,32}$/;

function sleep(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, time);
  });
}

class Wallet {
  constructor() {
    this.key_store = new nearLib.BrowserLocalStorageKeystore();
    this.near = window.nearLib.Near.createDefaultConfig(NODE_URL);
    this.accounts = JSON.parse(localStorage.getItem(KEY_WALLET_ACCOUNTS) || "{}");
    this.tokens = JSON.parse(localStorage.getItem(KEY_WALLET_TOKENS) || "{}");
    this.account_id = localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID) || "";
    $('body').append(
      $('<div/>').addClass("container").attr('role', 'footer').css('margin-top', '50px').append(
        $('<div/>').append(
          $("<small/>").addClass("text-muted").text("DISCLAIMER: This is a developers' preview Wallet. It should be used for NEAR Protocol DevNet only. Learn more at ").append(
            $("<a/>").attr("href", "https://nearprotocol.com").text("nearprotocol.com")
          )
        )
      )
    );
  }

  save() {
    localStorage.setItem(KEY_ACTIVE_ACCOUNT_ID, this.account_id);
    localStorage.setItem(KEY_WALLET_ACCOUNTS, JSON.stringify(this.accounts));
    localStorage.setItem(KEY_WALLET_TOKENS, JSON.stringify(this.tokens));
  }

  get_account_id() {
    return this.account_id;
  }

  select_account(account_id) {
    if (!(account_id in this.accounts)) {
      return false;
    }
    this.account_id = account_id;
    this.save();
  }

  new_access_token(app_url, app_title, contract_id) {
    var token = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 32; i++) {
      token += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    if (!this.is_legit_account_id(contract_id)) {
      contract_id = '';
    }

    this.tokens[token] = {
        app_url,
        app_title,
        contract_id,
        account_id: this.account_id,
    };
    this.save();
    return token;
  }

  is_legit_account_id(account_id) {
    return ACCOUNT_ID_REGEX.test(account_id);
  }

  async send_transaction(sender_id, receiver_id, method_name, amount, args) {  
    return await this.near.scheduleFunctionCall(
      amount,
      sender_id,
      receiver_id,
      method_name,
      args || {},
    );
  }

  redirect_to_create_account() {
    let url = WALLET_CREATE_NEW_ACCOUNT_URL + "?" + $.param({
      next_url: window.location.href,
    })
    window.location.replace(url);
  }

  is_empty() {
    return !this.accounts || !Object.keys(this.accounts).length;
  }

  redirect_if_empty() {
    if (this.is_empty()) {
      this.redirect_to_create_account();
    }
  }

  async load_account(account_id) {
    if (!(account_id in this.accounts)) {
      throw "Account " + account_id + " doesn't exists.";
    }
    return await this.near.nearClient.viewAccount(account_id);
  }

  async create_new_account(account_id) {
    // TODO: Check account doesn't exists on devnet
    if (account_id in this.accounts) {
      throw "Account " + account_id + " already exists."; 
    }
    let thisWallet = this;
    let keyPair = await nearLib.KeyPair.fromRandomSeed();
    return new Promise(function (resolve, reject) {
      let data = JSON.stringify({
        newAccountId: account_id,
        newAccountPublicKey: keyPair.getPublicKey(),
      });

      $.post(CONTRACT_CREATE_ACCOUNT_URL, data)
        .done((d) => {
          thisWallet.key_store.setKey(account_id, keyPair).catch(console.log);
          thisWallet.accounts[account_id] = true;
          thisWallet.account_id = account_id;
          thisWallet.save();
          resolve(d);
        })
        .fail((e) => {
          reject(e.responseText)
        })
    });
  }

  subscribe_for_messages() {
    window.addEventListener("message", $.proxy(this.receive_message, this), false);
  }

  receive_message(event) {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch (e) {
      // Silently dying.
      return;
    }
    if (data['action'] !== 'send_transaction') {
      // Unknown action.
      return;
    }
    let token = data['token'] || '';
    if (!(token in this.tokens)) {
      console.warn("Wallet: TX denied. The token " + token + " is not found ");
      // Unknown token.
      return;
    }
    let app_data = this.tokens[token];
    let account_id = app_data['account_id'];
    if (!(account_id in this.accounts)) {
      console.warn("Wallet: TX denied. The account " + account_id + " is not part of the wallet anymore.");
      // Account is no longer authorized.
      return;
    }
    let contract_id = app_data['contract_id'];
    let receiver_id = data['receiver_id'] || contract_id;
    if (receiver_id !== contract_id || !this.is_legit_account_id(receiver_id)) {
      console.warn("Wallet: TX denied. Bad receiver's account ID ('" + receiver_id + "') or it doesn't match the authorized contract id");
      // Bad receiver account ID or it doesn't match contract id.
      return;
    }
    let amount = parseInt(data['amount']) || 0;
    if (amount !== 0) {
      console.warn("Wallet: TX denied. Transaction amount should be 0.");
      // Automatic authorization denied since for amounts greater than 0.
    }
    let method_name = data['method_name'] || '';
    if (!method_name) {
      console.warn("Wallet: TX denied.  Method name can't be empty since the amount is 0");
      // Method name can't be empty since the amount is 0.
      return;
    }
    let args = data['args'] || {};
    // Sending the transaction on behalf of the account_id
    this.send_transaction(account_id, receiver_id, method_name, amount, args)
      .catch(console.log);
  }
}

