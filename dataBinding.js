/*!
 * LorisJS - a small library for creating web pages
 * Available at https://github.com/luclorencini/lorisJS
 * Licensed under MIT (https://github.com/luclorencini/lorisJS/blob/main/LICENSE)
 */

/**
 * 
 * @param {any} elem 
 * @param {any} object 
 */
export function bind(elem, object) {

    if (elem == null) {
        throw new Error('bind - elem cannot be null');
    }

    if (object == null) {
        throw new Error('bind - object cannot be null');
    }

    //these are the elements that will be performed two-way data binding upon
    let elements = elem.querySelectorAll('[ui-bind]');

    elements.forEach(function (element) {

        const uiBindValue = element.getAttribute('ui-bind');

        let obp = parseObjectProperties(object, uiBindValue);
        let obj = obp.object;
        let prop = obp.prop;

        let tmp = obj[prop]; //takes property value before creates getter/setter

        setCustomGetterSetter(obj, elements, prop, uiBindValue);
        setElementListener(obj, element, prop);

        obj[prop] = tmp; //set the same value to the property, in order to call setter method and populate the html component on screen.
    });
}

function parseObjectProperties(object, bindProp) {

    let parts = bindProp.split('.');
    if (parts.length == 1) {
        return { object: object, prop: bindProp };
    }
    else {
        let obj = object[parts[0]];
        let prop = parts[1];
        return parseObjectProperties(obj, prop)
    }
}

function setCustomGetterSetter(object, elements, property, uiBindValue) {

    var value;

    //creates a setter method to the objects' property, so when its value changes, also changes all html elements bound to it
    Object.defineProperty(object, property, {

        set: function (newValue) {

            value = newValue;

            //for each element to bind, check its type to set the value accordingly
            elements.forEach(function (element) {

                if (element.getAttribute('ui-bind') === uiBindValue) {

                    switch (element.tagName.toLowerCase()) {

                        case 'input':

                            switch (element.type) {
                                case 'text':
                                case 'hidden':
                                    element.value = newValue;
                                    break;

                                case 'checkbox':
                                    element.checked = object[property];
                                    break;

                                case 'radio':
                                    //TODO
                                    break;

                                default:
                                    //other input types - don't do anything
                                    break;
                            }

                            break;

                        case 'textarea':
                            element.value = newValue;
                            break;

                        case 'select': // drop-downs
                            element.value = newValue;
                            break;

                        default:
                            //other tags - changes via innerHTML
                            element.innerHTML = newValue;
                            break;
                    }
                }
            });
        },

        get: function () {
            return value;
        },

        enumerable: true
    });
}

function setElementListener(object, element, property) {

    switch (element.tagName.toLowerCase()) {

        case 'input':

            switch (element.type) {
                case 'text':
                case 'hidden':
                    element.addEventListener('keyup', () => {
                        object[property] = element.value;
                    });
                    break;

                case 'checkbox':
                    element.addEventListener('click', () => {
                        object[property] = element.checked;
                    });
                    break;

                case 'radio':
                    //TODO
                    break;

                default:
                    //other input types - don't do anything
                    break;
            }

            break;

        case 'textarea':
            element.addEventListener('keyup', () => {
                object[property] = element.value;
            });
            break;

        case 'select': // drop-downs
            element.addEventListener('change', () => {
                object[property] = element.value;
            });
            break;
    }
}