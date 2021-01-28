import mixpanel from 'mixpanel-browser';
import {twoFactorTracking} from "./TwoFactor"

const BROWSER_MIXPANEL_TOKEN = '9edede4b70de19f399736d5840872910';

mixpanel.init(BROWSER_MIXPANEL_TOKEN, {'property_blacklist': ['$current_url']})

function tracking() {
  //user profile setting
  let id = mixpanel.get_distinct_id();
  mixpanel.identify(id);
  mixpanel.people.set({'Enable 2FA': false});
  let account_id = document.querySelector('.user-name').textContent
  mixpanel.alias(account_id, id)

  //tracking properties
  mixpanel.register({'$referrer': document.referrer, pathname: document.location.pathname});
  mixpanel.track('View Page');
  mixpanel.time_event('View Page')

  if(document.location.pathname === "/enable-two-factor"){
    twoFactorTracking(mixpanel)
  }
}

setTimeout(tracking, 2000)
