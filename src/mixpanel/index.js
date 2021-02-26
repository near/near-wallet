import mixpanel from 'mixpanel-browser';

let Mixpanel = {
    get_distinct_id: () => {},
    identify: () => {},
    alias: () => {},
    track: () => {},
    people: {
        set: () => {},
        set_once: ()  => {}
    },
    withTracking: () => {}
};

if (process.env.BROWSER_MIXPANEL_TOKEN) {
    mixpanel.init(BROWSER_MIXPANEL_TOKEN);
    mixpanel.register({'timestamp': new Date().toString(), '$referrer': document.referrer});
    Mixpanel = {
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
            set_once: (props)  => {
                mixpanel.people.set_once(props)
            }
        },
        withTracking: async (name, fn, errorOpration = () => {}, finalOperation = () => {}) => {
            try {
                mixpanel.track(`${name} start`)
                await fn();
                mixpanel.track(`${name} finish`)
            } catch (e) {
                mixpanel.track(`${name} fail`, {error: e.message})
                errorOpration(e)
            } finally {
                await finalOperation()
            }
      }
    };
}

export { Mixpanel };