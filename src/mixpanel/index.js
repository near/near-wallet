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
    withTracking: async (name, fn, errorOperation = () => {}, finalOperation = () => {}) => {
        try {
            await fn();
        } catch (e) {
            await errorOperation(e)
        } finally {
            await finalOperation()
        }
    },
    register: () => {}
}

if (process.env.BROWSER_MIXPANEL_TOKEN) {
    mixpanel.init(process.env.BROWSER_MIXPANEL_TOKEN);
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
        withTracking: async (name, fn, errorOperation = () => {}, finalOperation = () => {}) => {
            try {
                mixpanel.track(`${name} start`)
                await fn();
                mixpanel.track(`${name} finish`)
            } catch (e) {
                mixpanel.track(`${name} fail`, {error: e.message})
                await errorOperation(e)
            } finally {
                await finalOperation()
            }
        },
        register: (props) => {
            mixpanel.register(props)
        }
    };
}

export { Mixpanel };