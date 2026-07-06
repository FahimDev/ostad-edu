/**
 * src/events/appEvents.js
 * -----------------------------------------------------------------------------
 * Event module theory:
 * - Node.js has a built-in "events" module.
 * - EventEmitter allows one part of the app to emit an event.
 * - Other parts of the app can listen to that event and react.
 *
 * Why this is useful:
 * - Route handler can focus on HTTP request/response.
 * - Listener can handle side effects like logging, email, notifications, audit trail.
 * - This creates loose coupling between business action and background reaction.
 */

const EventEmitter = require("events");

class AppEvents extends EventEmitter {}

const appEvents = new AppEvents();

module.exports = appEvents;
