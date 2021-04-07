/*!
 * LorisJS - a small library for creating web pages
 * Available at https://github.com/luclorencini/lorisJS
 * Licensed under MIT (https://github.com/luclorencini/lorisJS/blob/main/LICENSE)
 */

/** 
 * Implements the Observer design pattern to any object that extends it.
 * It features both observable and observer parts in a single object.
 */
export default class BaseObservable {

    /**
     * each instance of BaseObservable class stats with an
     * empty array of observers that react to state changes
     */
    constructor() {
        /** @type {BaseObservable[]} */
        this.observers = [];
    }

    /**
     * Add an object (an observer) that can listen to BaseObservable notifications.
     * @param {BaseObservable} component
     */
    addObverser(component) {
        this.observers.push(component);
    }

    /**
     * Allows an observer previously added to remove itself from the BaseObservable's observers list.
     * Once removed, the observer will not receive any further notifications emitted by the observable;
     * @param {*} component 
     */
    removeObserver(component) {
        this.observers.push(component);
    }

    /**
     * Notify all observers, passing an action name and the object subject of the notification.
     * @param {string} action action name
     * @param {Object} object data to the passed on notification
     */
    notify(action, object) {
        if (this.observers != null) {
            for (const obs of this.observers) {
                obs.listen(action, object);
            }
        }
    }

    /**
     * Listen notifications emitted by BaseObservable.
     * Must be implemented by the observer in order to receive notifications
     * @param {string} action action name
     * @param {Object} object data to the passed on notification
     */
    listen(action, object) {
    }
}