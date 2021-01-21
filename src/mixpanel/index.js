import mixpanel from 'mixpanel-browser'

if (process.env.MIXPANEL_TOKEN) {
  mixpanel.init(process.env.MIXPANEL_TOKEN, {'property_blacklist': ['$current_url']})
  //user profile setting
  let id = mixpanel.get_distinct_id();
  mixpanel.identify(id);
  mixpanel.people.set_once({'first_touch_source': document.referrer, 'date_of_first_touch': new Date().toString()});

  // track and get duration for all pages
  mixpanel.register({'timestamp': new Date().toString(), '$referrer': document.referrer});
  mixpanel.track('Viewed Page', {'page': window.location.pathname});
  mixpanel.time_event('Viewed Page');

  // track links
  mixpanel.track_links("a", "Link Click", {'page': window.location.pathname});
}

