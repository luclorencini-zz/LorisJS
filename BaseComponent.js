/*!
 * LorisJS - a small library for creating web pages
 * Available at https://github.com/luclorencini/lorisJS
 * Licensed under MIT (https://github.com/luclorencini/lorisJS/blob/main/LICENSE)
 */

import BaseObservable from "./BaseObservable.js";
import { bind } from "./dataBinding.js";

/**
 * **BaseComponent** is the superclass that represents a component.
 * It provides methods for page rendering, action handling and two-way data binding
 */
export default class BaseComponent extends BaseObservable {

    /**
     * While creating a BaseComponent object, searches the entire DOM for an element that has 
     * the **ui-component** attribute matching the provided selector, 
     * and saves the matching element in objects’ **this.elem** property.
     * @param {string} selector 
     */
    constructor(selector) {
        super();

        /** @type {any} */
        this.elem = (
            selector != null && selector.trim() != ''
                ? window.document.querySelector(`[ui-component="${selector}"]`)
                : null
        );

        /** @type {BaseComponent | null} */
        this.parent = null;
    }

    /**
     * Sets the html string passed in **this.elem**, via its *innerHTML* attribute, replacing any existing elements.
     * @param {string} html 
     */
    render(html) {
        this.renderIn(this.elem, html);
    }

    /**
     * Sets the html string passed in the informed element, via its *innerHTML* attribute, replacing any existing elements.
     * @param {any} element 
     * @param {string} html 
     */
    renderIn(element, html) {
        element.innerHTML = html;
    }

    /**
     * Searches in all DOM elements inside **this.elem** having the **ui-bind** attribute, and performs two-way data binding with the informed model object.
     * @param {Object} model 
     */
    bindModel(model) {
        this.bindModelIn(this.elem, model);
    }

    /**
     * Searches in all DOM elements inside the informed element having the **ui-bind** attribute, and performs two-way data binding with the informed model object.
     * @param {any} element 
     * @param {Object} model 
     */
    bindModelIn(element, model) {
        bind(element, model);
    }

    /**
     * Searches in all DOM elements inside **this.elem** having the **ui-action** attribute, and arms the actions accordingly.
     */
    setupActions() {
        this.setupActionsIn(this.elem);
    }

    /**
     * Searches in all DOM elements inside the informed element having the **ui-action** attribute, and arms the actions accordingly.
     * @param {any} element
     */
    setupActionsIn(element) {
        if (element == null) {
            throw new Error('setupActions - element cannot be null');
        }

        let elements = element.querySelectorAll('[ui-action]');

        for (const el of elements) {

            /** @type {string} */
            let attrValue = el.getAttribute('ui-action');

            if (attrValue == null || attrValue.length == 0) {
                console.error(`ui-action - empty attribute`);
                break;
            }

            let values = attrValue.split('=');

            if (values == null || values.length != 2) {
                console.error(`ui-action - sintax error - expected: event=function() - informed: ${attrValue}`);
                break;
            }

            //this is a special attribute to mark if this listener is already 'armed', so further calls to 'setupActions' won't create the same listener again
            let attrArmed = el.getAttribute('ui-action-armed');
            if (attrArmed == null) {
                let event = values[0];
                let callback = values[1];
                el.addEventListener(event, e => { eval(`this.${callback}`); });
                el.setAttribute('ui-action-armed', '');
            }
            else {
                console.warn(`ui-action - action already armed - this will be ignored: ${attrValue}`)
            }
        }
    }




    /**
     * @param {any} errorhandler 
     * @param {any} promiseHandler 
     */
    setGlobalErrorHandler(errorhandler, promiseHandler) {

        if (errorhandler == null) {
            errorhandler = event => {
                alert(`ERROR: something unexpected has happened: ${event.error.message}`);
                console.error(event.stack);
            };
        }

        window.addEventListener('error', errorhandler);


        if (promiseHandler == null) {
            promiseHandler = event => {
                alert(`ERROR: something unexpected has happened: ${event.reason}`);
                console.error(event.promise);
            };
        }

        window.addEventListener('unhandledrejection', promiseHandler);
    }

    /**
     * @returns {Object}
     * @deprecated
     */
    loadModelFromJson() {
        let model = (
            this.elem != null
                ? JSON.parse(this.elem.querySelector(`[ui-model]`).getAttribute('ui-model'))
                : null

        );
        return model;
    }
}