import mixpanel from 'mixpanel-browser';

import CONFIG from '../config';

function buildTrackingProps() {
    const sanitizedUrl = decodeURI(window.location.href)
        .split('#')[0]
        .replace(/(?:\w{3,12} ){11}(?:\w{3,12})/gi, 'REDACTED')
        .replace(/[\w\d]{64,}/gi, 'REDACTED')
        .replace(/ed25519.+/gi, 'REDACTED');

    return {
        $current_url: encodeURI(sanitizedUrl),
    };
}

let Mixpanel = {
    get_distinct_id: () => {},
    identify: (id) => {},
    alias: (id) => {},
    track: (eventName) => {},
    people: {
        set: (props) => {},
        set_once: (props)  => {}
    },
    withTracking: async (name, fn, errorOperation, finalOperation) => {
        try {
            await fn();
        } catch (e) {
            if (errorOperation) {
                await errorOperation(e);
            } else {
                throw e;
            }
        } finally {
            if (finalOperation) {
                await finalOperation();
            }
        }
    },
    register: () => {}
};

if (CONFIG.BROWSER_MIXPANEL_TOKEN) {
    mixpanel.init(CONFIG.BROWSER_MIXPANEL_TOKEN);
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
            mixpanel.track(name, {
                ...props,
                ...buildTrackingProps(),
            });
        },
        people: {
            set: (props) => {
                mixpanel.people.set(props);
            },
            set_once: (props)  => {
                mixpanel.people.set_once(props);
            }
        },
        withTracking: async (name, fn, errorOperation, finalOperation) => {
            try {
                mixpanel.track(`${name} start`, buildTrackingProps());
                await fn();
                mixpanel.track(`${name} finish`, buildTrackingProps());
            } catch (e) {
                mixpanel.track(`${name} fail`, {
                    error: e.message,
                    ...buildTrackingProps(),
                });
                if (errorOperation) {
                    await errorOperation(e);
                } else {
                    throw e;
                }
            } finally {
                if (finalOperation) {
                    await finalOperation();
                }
            }
        },
        register: (props) => {
            mixpanel.register(props);
        }
    };
}

export { Mixpanel };
