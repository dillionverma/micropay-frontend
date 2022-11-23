import mixpanel, { Dict, Query } from "mixpanel-browser";

const isDev = process.env.NODE_ENV === "development";

mixpanel.init("e275f2a64b7547f6ae37a70f15c214f1", {
  // Use your project's URL, adding a slug for all Mixpanel requests
  // api_host: isDev ? "http://localhost:3002" : "https://micropay.ai/mp",
  debug: isDev,
  ignore_dnt: isDev,
});

export const Mixpanel = {
  identify: (id: string) => {
    mixpanel.identify(id);
  },
  alias: (id: string) => {
    mixpanel.alias(id);
  },
  track: (name: string, props?: Dict) => {
    mixpanel.track(name, props);
  },
  track_links: (query: Query, name: string) => {
    mixpanel.track_links(query, name, {
      referrer: document.referrer,
    });
  },
  people: {
    set: (props: Dict) => {
      mixpanel.people.set(props);
    },
  },
};
