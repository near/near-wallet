const WALLET_URL = "/login/";
const WALLET_CREATE_NEW_ACCOUNT_URL = '/create/';

const CONTRACT_CREATE_ACCOUNT_URL = 'https://studio.nearprotocol.com/contract-api/account';
const NODE_URL = "https://studio.nearprotocol.com/devnet";

const KEY_WALLET_USERS = "wallet:users";
const KEY_WALLET_TOKENS = "wallet:tokens";
const KEY_ACTIVE_USER = "wallet:active_user";

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
    this.users = JSON.parse(localStorage.getItem(KEY_WALLET_USERS) || "{}");
    this.tokens = JSON.parse(localStorage.getItem(KEY_WALLET_TOKENS) || "{}");
    this.active_user = localStorage.getItem(KEY_ACTIVE_USER) || "";
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
    localStorage.setItem(KEY_WALLET_USERS, JSON.stringify(this.users));
    localStorage.setItem(KEY_WALLET_TOKENS, JSON.stringify(this.tokens));
    localStorage.setItem(KEY_ACTIVE_USER, this.active_user);
  }

  get_username() {
    return this.active_user;
  }

  select_user(username) {
    if (!(username in this.users)) {
      return false;
    }
    this.active_user = username;
    this.save();
  }

  new_access_token(app_url, app_title) {
    var token = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 32; i++) {
      token += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    this.tokens[token] = {
        app_url,
        app_title,
        username: this.active_user,
    };
    this.save();
    return token;
  }

  is_legit_account_id(account_id) {
    return ACCOUNT_ID_REGEX.test(account_id);
  }

  async send_transaction(username, receiver_id, method_name, amount, args) {  
    return await this.near.scheduleFunctionCall(
      amount,
      username,
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
    return !this.users || !Object.keys(this.users).length;
  }

  redirect_if_empty() {
    if (this.is_empty()) {
      this.redirect_to_create_account();
    }
  }

  async load_account(username) {
    if (!(username in this.users)) {
      throw "Account " + username + " doesn't exists."; 
    }
    return await this.near.nearClient.viewAccount(username);
  }

  async create_new_account(username) {
    if (username in this.users) {
      throw "Account " + username + " already exists."; 
    }
    let thisWallet = this;
    let keyPair = await nearLib.KeyPair.fromRandomSeed();
    return new Promise(function (resolve, reject) {
      let data = JSON.stringify({
        "newAccountId": username,
        "newAccountPublicKey": keyPair.getPublicKey(),
      });

      $.post(CONTRACT_CREATE_ACCOUNT_URL, data)
        .done((d) => {
          thisWallet.key_store.setKey(username, keyPair).catch(console.log);
          thisWallet.users[username] = true;
          thisWallet.active_user = username;
          thisWallet.save();
          resolve(d);
        })
        .fail((e) => {
          reject(e.responseText)
        })
    });
  }
}

