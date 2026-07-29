(() => {
  "use strict";

  const trackedLinkSelector = "[data-analytics-event]";

  document.addEventListener(
    "click",
    (event) => {
      const link =
        event.target instanceof Element
          ? event.target.closest(trackedLinkSelector)
          : null;

      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      const eventName = link.dataset.analyticsEvent;

      if (!eventName) {
        return;
      }

      const parameters = {
        link_url: link.href,
        link_text: (link.textContent ?? "")
          .trim()
          .replace(/\s+/g, " ")
          .slice(0, 100),
        link_location: link.dataset.analyticsLocation || "unknown"
      };

      const optionalParameters = {
        project_name: link.dataset.analyticsProject,
        destination_type: link.dataset.analyticsDestination,
        contact_method: link.dataset.analyticsContactMethod,
        profile_name: link.dataset.analyticsProfile
      };

      for (const [name, value] of Object.entries(optionalParameters)) {
        if (value) {
          parameters[name] = value;
        }
      }

      window.dataLayer = window.dataLayer || [];

      window.dataLayer.push({
        event: "portfolio_interaction",
        analytics_event_name: eventName,
        ...parameters
      });

      if (typeof window.clarity === "function") {
        window.clarity("event", eventName);
      }
    },
    { capture: true }
  );
})();