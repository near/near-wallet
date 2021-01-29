import mixpanel from 'mixpanel-browser';

const BROWSER_MIXPANEL_TOKEN = '9edede4b70de19f399736d5840872910';

mixpanel.init(BROWSER_MIXPANEL_TOKEN);
mixpanel.register({'timestamp': new Date().toString(), '$referrer': document.referrer})
export const Mixpanel = {
  get_distinct_id: () => {
    return mixpanel.get_distinct_id();
  },
  identify: (id) => {
    mixpanel.identify(id);
  },
  alias: (id) => {
    mixpanel.alias(id);
  },
  track: (name, props) => {
    mixpanel.track(name, props);
  },
  people: {
    set: (props) => {
      mixpanel.people.set(props);
    },
  },
};
