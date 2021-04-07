# LorisJS
##### a small library for creating web pages

**LorisJS** is a small, component-based javascript library for creating web pages, with a focus on reducing boilerplate code without losing simplicity. Written entirely in vanilla javascript (EcmaScript 7), provides action handling, two-way data binding and event emission via the observer design pattern.

## **What is a Component**

A component is a meaningful part of a web page, that contains related logic. A search box, a table, a form, are all examples of what a component can be.

Components generally have three responsibilities (but not mandatory):

- how to take care of their markup (either by rendering them or making good use of pages that came from server)
- how to load and handle their data
- how to handle events (like click a button or change a value in a combo box)

We’re gonna cover these topics later.

### **Components and the ui-component attribute**

In LorisJS, you define a component by marking a html tag with the special attribute **ui-component**. By doing that, everything inside that tag is within the scope of the component.

Next, you create a class to hold all the component’s logic. A component class must inherit **BaseComponent**. You define the component name on constructor, by calling super(). This name must match the value provided in the **ui-component** attribute.

To create a component, you just need to instantiate it (using the new keyword). The constructor then searches, in the entire document, for a html tag whose **ui-component** value matches the name provided in the constructor’s component. It all goes down to a plain querySelector on it, so the first found element is stored in component’s **this.elem** property. All other methods we’re gonna discuss here access and use this property somehow. This is also very handy for the developer, since he has direct access to this html element and can use any javascript operation on it, if needed.

### **Rendering**

One key feature of creating pages is the ability to create dynamic html content and place it in your page when needed. To perform this, LorisJS provides the **render** method, which essentially receives a string html and sets it in the **elem**'s innerHTML attribute, replacing the element's content.

Although there are several different ways of creating dynamic html, EcmaScript 6 introduces new and powerful features to help this task: **template literals** in conjunction with **map** and **join** functions. Please check out this [excellent video](https://youtu.be/DG4obitDvUA) showing how to use them to create dynamic html.

Please note that, when you use **render**, you are actually replacing part of the DOM with new elements. This means that existing data binding and action handling on these previous elements will be lost, and you're gonna have to do it again on the new ones. It's very common to call **bind** and **setupActions** right after **render** to reapply data binding and action handling if your component requires one of them.

By default, **render** acts upon the **this.elem** element. However, if you need more fine-grained control over where the render should happen in, consider using the **renderIn** method. Besides the html string, **renderIn** expects an element where the rendering will take place.

### **Actions and** **ui-action**

Actions are an approach to deal with event handling without its boilerplate code. In LorisJS, you can set up an action to any html element by using the **ui-action** attribute.

Syntax:
**ui-action=”event=method()”**

event: is any valid javascript string event, like click, change, mouseover, and so onmethod(): is a component method, created by you.

Action work is pretty straightforward: it simply creates a javascript event listener using the event you informed, and calls the components’ method by calling **eval** function. Since it’s a plain vanilla eval in the end, the following calls work:

```javascript
// calls the method this.save() on the componentui-action=”click=save()”
// calls the method this.loadItem on the component, passing the attribute 1 into it.ui-action=”click=loadItem(1)”
// calls the method this.showPanel() on the component, passing the fired javascript event *e* into it.ui-action=”change=showPanel(e)”
```

By default, **setupActions** acts upon the **this.elem** element. However, if you need more fine-grained control over where to look for actions to set up, consider using the **setupActionsIn** method. This complementary method expects an element where the action setup will look for.

### **Data Binding and ui-model**

The biggest feature in LorisJs is the **two-day data binding**. That's the ability to bind properties of a plain object to html components like text boxes and drop-downs. When bound, any change you do in code in an object's property value reflects immediately on screen, refreshing the bound html field. And, at any change the user performs on screen, the bound object property gets refreshed automatically (hence the term "two-way data binding").

[to-do]

By default, **bindModel** acts upon the **this.elem** element. However, if you need more fine-grained control over where to look for fields to bind, consider using the **bindModelIn** method. This complementary method expects an element where the binding will take place.

### **Component Granularity**

One common question about component’s is how big or how small they should be. Make them very small, and you end up with dozens of classes for a single page. Make then too big, and they will have hundreds of code and mixed logic, killing the concept itself.

As a rule of thumb,these two guidelines generally help the decision:

* create a component when you have markup and logic that can be reusable in several places. Some examples include modals panels that display and allow selection of common business entities (like contacts in a mail application), or drop-down selectors for master-detail filtering (like a product category combo that is used in several product-related pages).
* create a component when you would need a new ‘page’. Imagine a typical MVC CRUD application, where each entity entry has two very distinctive pages: a listing page with filters and pagination, and a form page for input data. Those two pages are natural candidates to become two different components. You may go even further and create subcomponents for handling with filter data and the listing itself, but that will depend on how complex these implementations would be.



## **LorisJs Cheat-sheet**

### **Core features (BaseComponent)**

#### **constructor(selector)** 

While creating a **BaseComponent** object, searches the entire DOM for an element that has the **ui-component** attribute matching the provided **selector**, and saves the matching element in objects’ **this.elem** property.

#### **render(html)**

Sets the html string passed in **this.elem**, via its innerHTML attribute, replacing any existing elements.

#### **renderIn(element, html)**

Sets the html string passed in the informed element, via its innerHTML attribute, replacing any existing elements.

#### **setupActions()**

Searches in all DOM elements inside **this.elem** having the **ui-action** attribute, and arms the actions accordingly.

#### **setupActionsIn(element)**

Searches in all DOM elements inside the informed element having the **ui-action** attribute, and arms the actions accordingly.

#### **bindModel(model)**

Searches in all DOM elements inside **this.elem** having the **ui-bind** attribute, and performs two-way data binding with the informed model object.

#### **bindModelIn(element, model)**

Searches in all DOM elements inside the informed element having the **ui-bind** attribute, and performs two-way data binding with the informed model object.

### **Observers (****BaseObservable)

#### addObverser(component)**

Adds an object (observer) that can listen to **BaseObservable** notifications.

#### **removeObserver(component)**

Allows an observer previously added to remove itself from the **BaseObservable**'s observers list.

#### **notify(action, object)**

Notify all observers, passing an action name and the object subject of the notification.

#### **listen(action, object)**

Listen notifications emitted by the observable. Must be implemented by the observer in order to receive notifications