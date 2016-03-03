
// START VoEventEmitter

/**
 * VoEventEmitter is a minimalist version of EventEmitter. It enables any
 * constructor that inherits EventEmitter to emit events and trigger
 * listeners that have been added to the event through the on(event, callback) method
 * 
 * TODO this should be fixed to provide better async implementation
 * @constructor
 */
function VoEventEmitter() { }

/**
 * @prop Events property is a hashmap, with each property being an array of callbacks
 */
VoEventEmitter.prototype.events = {};

/**
 * @prop on(eventName, listener) - adds a listener to the queue of callbacks associated to an event
 * @returns {int} the index of the callback in the array of listeners for a particular event
 */
VoEventEmitter.prototype.on = function (eventName, target, listener) {
    var event = this.events[eventName];
    if (!event) {
        event = this.events[eventName] = [];
    }
    var eventData = { target: target, listener: listener };
    event.push(eventData);
    return listener;
};

/**
 * @propt emit(eventName, data) - emits a particular event
 * with the option of passing optional parameters which are going to be processed by the callback
 * provided signatures match (i.e. if passing emit(event, arg0, arg1) the listener should take two parameters)
 * 
 * TODO this need a more robust async implementation
 *
 * @param {string} eventName - the name of the event
 * @param {object} data - optional object passed with the event
 * @param {Array} promises - optional array to hold all promises that are generated
 */
VoEventEmitter.prototype.emit = function (eventName, data, promises) {
    var p;
    var self = this;
    p = new Promise(function (resolve, reject) {
        try {
            if (eventName && self.events[eventName]) {
                self.events[eventName].forEach(function (eventData) {
                    eventData.listener.call(eventData.target, data);
                    resolve();
                });
                if (promises)
                    promises.push(p);
                return p;
            } else {
                console.log("no event defined for " + eventName);
            }
        }
        catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

/**
 * @promot removeListener() - removes the listener at position 'index' from the event 'eventName'
 */
VoEventEmitter.prototype.removeListener = function (eventName, target, listener) {
    if (this.events[eventName]) {
        var listeners = this.events[eventName];
        var deleteItem = null;
        if (listeners) {
            listeners.forEach(function (eventData) {
                if (eventData.target === target && eventData.listener === listener)
                    deleteItem = eventData;
            });
        }
        listeners.splice(listeners.indexOf(deleteItem), 1);
    }
};

/**
 * @propt emitSync(eventName, data) - emits a particular event syncronously
 * with the option of passing optional parameters which are going to be processed by the callback
 * provided signatures match (i.e. if passing emit(event, arg0, arg1) the listener should take two parameters)
 * 
 * TODO this need a more robust async implementation
 *
 * @param {string} eventName - the name of the event
 * @param {object} data - optional object passed with the event
 */
VoEventEmitter.prototype.emitSync = function (eventName, data) {
    if (eventName && this.events[eventName]) {
        this.events[eventName].forEach(function (eventData) {
            eventData.listener.call(eventData.target, data);
        });
    } else {
        throw new Error('No event ' + eventName + ' defined');
    }
};

// END VoEventEmitter

// START PropArgs

/**
 * @propt VoArgs(eventSource, selectedItems, sourceKey) - base argument object for propagated events
ODO this need a more robust async implementation
 *
 * @constructor
 * @param {object} eventType - the type of event that is being broadcast
 * @param {object} eventSource - the sender of the event
 * @param {object} selectedItems - the items in the selection set
 * @param {object} sourceKey - the property used as the primary key by the sender
 */
function VoArgs(eventType, eventSource, selectedItems, sourceKey) {
    this.type = eventType;
    this.source = eventSource;
    this.selections = selectedItems;
    this.key = sourceKey
}

var VoEventTypes = {
    '$propagation': "propagation",
    '$resize': "resize",
    '$masterchanged': 'master',
    '$sourceschanged': 'sources'
};

var VoPropTypes = {
    '$select': "select",
    '$highlight': "highlight"
};

// END PropArgs

// START UiDataViewer

/**
 * Wrapper for a control that will participate in event propagation amoung views
 *
 * TODO we need a more generic version of this
 * @constructor
 * @param {string} elementId - the DOM element id of the control associated with this wrapper
 * @param {object} collection - the data that is used to populate the control
 * @param {object} key - the property used as the primary key for the collection
 * @param {Function} selectionProc - function used to determine selections
 */
function UiDataViewer(elementId, collection, key, selectionProc) {
    this.id = elementId;
    this.selectionProc = (selectionProc) ? selectionProc.bind(this) : null;
    this.key = key;
    this.data = collection;
}


/**
 * @promot resize() - resizes the DOM control
 */
UiDataViewer.prototype.resize = function () {
    $$(this.id).resize();
};

/**
 * @propt selectionUpdate(args) - updates the selection of the view based on a selection elsewhere
 *
 * @param {VoArgs} args - a instance of a VoArgs object
 */
UiDataViewer.prototype.selectionUpdate = function (args) {
    if (args.source === this)
        return;


    if (!selectedItems.hasOwnProperty('tag') && !selectedItems.hasOwnProperty('acad'))
        var result = false;
    var data = app_ui.mv_tree.find(function (obj) {

        if (selectedItems.hasOwnProperty('acad')) {
            for (var i = 0; i < selectedItems.acad.length; i++) {
                var a = selectedItems.acad[i];
                if (obj.acad === a) {
                    result = true;
                    i = 1000000;
                }
            }
        }
        else if (selectedItems.hasOwnProperty('tag')) {
            for (var i = 0; i < selectedItems.tag.length; i++) {
                var a = selectedItems.tag[i];
                if (obj.tag === a) {
                    result = true;
                    i = 1000000;
                }
            }
        }
        return result;
    });
    if (data.length > 0) {
        var cntrl = $$(this.id);
        var id = data[0].id;
        var itemId = id;
        while (id) {
            cntrl.open(id);
            id = cntrl.getParentId(id);
        }
        cntrl.showItem(itemId);
        cntrl.select(itemId);
    }
};

UiDataViewer.prototype.color = function (ids, color) {
};

UiDataViewer.prototype.addToselect = function (ids) {
};

UiDataViewer.prototype.select = function (ids) {
};

UiDataViewer.prototype.fit = function (ids) {
};

UiDataViewer.prototype.isolate = function (ids) {
};

UiDataViewer.prototype.hide = function (ids) {
};

// END UiDataViewer


// START AppReferences

function RefEntry(name, path) {
    this.name = name;
    this.path = path;
}

function AppRefs() {

}

AppRefs.prototype.addRef = function (dictionary, prop, id, ref) {
    if (!this.hasOwnProperty(dictionary)) {
        this[dictionary] = {};
    }
    var dict = this[dictionary];
    if (!dict.hasOwnProperty(prop)) {
        dict[prop] = {};
    }
    var proplist = dict[prop];
    if (!proplist.hasOwnProperty(id)) {
        proplist[id] = [];
    }
    var refs = proplist[id];
    refs.push(ref);
};

AppRefs.prototype.getRefs = function (dictionary, prop, id) {
    if (!this.hasOwnProperty(dictionary)) {
        return [];
    }
    var dict = this[dictionary];
    if (!dict.hasOwnProperty(prop)) {
        return [];
    }
    var proplist = dict[prop];
    if (!proplist.hasOwnProperty(id)) {
        return [];
    }
    return proplist[id];
};
//AppLists.prototype.getItems = function (prop, dictionary) {
//    var promise = new Promise(function(resolve, reject) {
//        if (!this.hasOwnProperty(dictionary) {
//            this[dictionary] = {};
//        }
//        var dict = this[dictionary];
//        if (!dict.hasOwnProperty(prop)){

//        } else {
//            resolve(dict[prop]);
//        }
//    });
//    return promise;
//}

//AppLists.prototype.getRefData = function (props, item) {

//    var self = this;
//    var promises = [];
//    props.forEach((prop)=>{
//        var promise = new Promise(function(resolve, reject) {


//            if (true) {
//                resolve("Stuff worked!");
//            } else {
//                reject(Error("It broke"));
//            }
//        });
//        propmises.push(promise);
//    });

//}

// END AppReferences

//// START AppLists
//
//function AppLists() {
//    this.all = [];
//    this.filtered = [];
//    this.lineDictionary = {};
//    this.tagDictionary = {};
//    this.idDictionary = {};
//    this.acadDictionary = {};
//    this.guidDictionary = {};
//}
//
//AppLists.prototype.extract = function (view) {
//    this.all = view.all.slice();
//    this.lineDictionary = view.lineDictionary;
//    this.tagDictionary = view.tagDictionary;
//    this.idDictionary = view.idDictionary;
//    this.acadDictionary = view.acadDictionary;
//    this.guidDictionary = view.guidDictionary;
//};
//
//AppLists.prototype.getFromDictionary = function (dict, id) {
//    if (!!id && dict.hasOwnProperty(id))
//        return dict[id];
//    else
//        return null;
//};
//
//AppLists.prototype.getFilteredList = function (db, categories, excludeFunction) {
//    var resultArrary = [];
//    var containingArray = [];
//    var copyArray = null;
//
//    function PFolder(cat, parent) {
//        this.value = cat;
//        this.children = [];
//        this.cCopy =[];
//        this.properties = [];
//        this.dbId = -1;
//        this.guid = "";
//        this.line = "";
//        this.fullLine = "";
//        this.acad = "";
//        this.layer = "";
//        this.clss = "";
//        this.type = "folder";
//        if (parent)
//            parent.addChild.call(parent, this);
//    }
//
//    PFolder.prototype.addChild = function (child, parent) {
//        this.children.push(child);
//        this.cCopy.push(child);
//        if (parent)
//            parent.addChild(this);
//    };
//
//    var root = new PFolder("root");
//
//    for (var j = 0; j < this.all.length; j++) {
//        var testParent = root;
//        var currentParent = null;
//        var currentItem = this.all[j];
//        // if not filtered then collect
//        if (!excludeFunction(currentItem)) {
//
//            categories.forEach(function (propName) {
//                // get the category
//                var cat = "";
//                if (currentItem.hasOwnProperty(propName))
//                    cat = currentItem[propName];
//                if (!cat)
//                    cat = "Undefined";
//
//                for (i = 0; i < testParent.children.length; i++) {
//                    var tmpItem = testParent.children[i];
//                    var test = tmpItem.value;
//                    if (test === cat) {
//                        currentParent = testParent.children[i];
//                        i = 1000000;
//                    }
//                }
//
//                if (!currentParent) {
//                    currentParent = new PFolder(cat, testParent);
//                }
//                testParent = currentParent
//            });
//            currentParent.addChild(currentItem);
//        }
//    }
//    return root.children;
//};
//
//// END AppLists

// START EventDispatcher

function EventDispatcher() {
    this.stack = {};
}

EventDispatcher.prototype.add = function (event, callback) {
    if (!this.stack.hasOwnProperty(event)) {
        this.stack[event] = []
    }
    this.stack[event].push(callback)
};

EventDispatcher.prototype.remove = function (event, callback) {
    if (! event in this.stack) return false;
    this.stack[event] = this.stack[event].filter(function (item) {
        if (item !== callback) {
            return item
        }
    });
    return true
};
EventDispatcher.prototype.fire = function (context, event, data) {
    data = (typeof data === 'undefined') ? {} : data;
    if (!this.stack.hasOwnProperty(event)) return false;
    for (var i = 0; i < this.stack[event].length; i++) {
        var proc = this.stack[event][i];
        proc.call(context, event, data);
    }
    return true
};

// END EventDispatcher

// START UiMap
//
//function UiMap(name, propertyName, filter, isArray) {
//    this.dictionary = {};
//    this.property = propertyName;
//    this.name = name;
//    this.filter = filter;
//    this.isArrary = isArray;
//    this.type = "map"
//}
//
//UiMap.prototype.getItem = function (id) {
//    if (!!id && this.dictionary.hasOwnProperty(id))
//        return this.dictionary[id];
//    else
//        return null;
//};
//
//UiMap.prototype.addItem = function (id, item) {
//    if (!!id) {
//        if (this.isArrary) {
//            var a = this.getItem(dict, id);
//            if (a === null) {
//                a = [];
//                this._dictionary[id] = a;
//            }
//            a.push(obj);
//        }
//        else {
//            this.dictionary[id] = obj;
//        }
//    }
//};
//
//UiMap.prototype.check = function (item, property) {
//    var result = { hit: false, addItem: false };
//    if (property.displayName === this.propertyName) {
//        if (property.displayValue) {
//            item.properties.push(property);
//            result.hit = true;
//            if (filter(property.displayValue)) {
//                result.addItem = true;
//                this.addItem(property.displayValue, item);
//            }
//        }
//    }
//    return result;
//};
//
//UiMap.prototype.clear = function () {
//    this.dictionary = {};
//};

// END UiMap


// START UiGraph

/**
 * object used to hold information about the appilcation
 * @constructor 
 */
function UiGraph() {
}

// UI Graph is used as a container for various controls and as a container for graphicviews and dataviews
UiGraph.prototype = new VoEventEmitter();

UiGraph.prototype.mv_tree = null;
// grids
UiGraph.prototype.prop_grid = null;
UiGraph.prototype.prop_tree = null;
UiGraph.prototype.equip_grid = null;
UiGraph.prototype.loto_grid = null;
UiGraph.prototype.loto_tree = null;
UiGraph.prototype.iso_grid = null;
UiGraph.prototype.names = [];
UiGraph.prototype.selections = [];

UiGraph.prototype._masterData = null;
UiGraph.prototype.setMasterData = function (master) {
    if (master !== this._masterData) {
        this._masterData = master;
        this.emit(VoEventTypes.$masterchanged, this, null);
    }
};
UiGraph.prototype.getMasterData = function () {
    return this._masterData;
};

// recursion prevention
UiGraph.prototype.selection_block = false;
UiGraph.prototype.loto = null;
UiGraph.prototype.block = {};
UiGraph.prototype.storageLists = null;
UiGraph.prototype.serverModels = [];

UiGraph.prototype.dataList = function () {
    var ldata = this.storageLists.getCollection("datalist");
    if (!ldata || ldata === null) ldata = self.storageLists.addCollection("datalist");
    return ldata;
};

UiGraph.prototype.modelList = function () {
    var ldata = this.storageLists.getCollection("modellist");
    if (!ldata || ldata === null) ldata = self.storageLists.addCollection("modellist");
    return ldata;
};

/**
 * @propt initializeRegistries() -used to register any data that is in local storage (or indexdb...) 
 */
UiGraph.prototype.initializeRegistries = function () {
    // try to get the data registry
    var prom;
    var self = this;
    self.storageLists = new loki('storageLists');
    prom = new Promise(function (resolve, reject) {
        localforage.getItem('storageLists').then(function (value) {
            try {
                if (value !== null)
                    self.storageLists.loadJSON(value);
                // initialize the collections
                self.dataList();
                self.modelList();
                self.emit(VoEventTypes.$sourceschanged, self, null);
                resolve();
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    });
    return prom;
};

/**
 * @propt saveModelDataAsLocal(newName, db) -takes the data extracted from the model file and copeies
 * it to a new loki db.  The new loki db is stored in local storage and added to the index of locally 
 * stored items.
 *
 * Is implemented as a Promise
 *
 * @param {string} newName - the name if the new database
 * @param {object} db - the loki database to be copied
 * @returns {object} - the newly copied database
 */
UiGraph.prototype.saveModelDataAsLocal = function (newName, db) {
    var self = this;
    return new Promise(function (resolve, reject) {
        var newDb = new loki(db.name);
        var json = db.db.serialize();
        newDb.loadJSON(json);
        newDb.name = newName;
        var newjson = newDb.serialize();
        localforage.setItem(newName, newjson).then(function () {
            var ldata = self.storageLists.getCollection("datalist");
            var result = ldata.find({ value: newName });
            if (result.length === 0) {
                ldata.insert({ value: newName, id: newName });
            }
            var listJson = self.storageLists.serialize();
            localforage.setItem('storageLists', listJson).then(function () {
                self.emit(VoEventTypes.$sourceschanged, self);
                resolve(newDb);
            }).catch(function (e) {
                console.log(e);
                reject(e);
            });
        }).catch(function (e) {
            console.log(e);
            reject(e);
        });
    });
};

/**
 * @propt loadDbFromStorage(dbName) -creates a new loki db and loads it from local storage
 *
 * Is implemented as a Promise
 *
 * @param {string} dbName - the name if the new database and the key for locating in storage
 * @returns {object} - the newly created database
 */
UiGraph.prototype.loadDbFromStorage = function (dbName) {
    return new Promise(function (resolve, reject) {
        var newDb = new loki(dbName);
        localforage.getItem(dbName).then(function (result) {
            if (result) {
                newDb.loadJSON(result);
                resolve(newDb);
            }
            else {
                reject("Error loading database");
            }
        }).catch(function (e) {
            reject(e);
        });
    });
};

/**
 * @propt loadDbFromStorage(dbName) -creates a new loki db and loads it from local storage
 *
 * Is implemented as a Promise
 *
 * @param {string} name - the name if the new database and the key for locating in storage
 * @returns {object} - the newly created database
 */
UiGraph.prototype.registerName = function (name) {
    var self = this;
    var fixName = false;
    var result = name;
    var nameCounter = 2;
    self.names.forEach(function (nm) {
        if (name === nm)
            fixName = true;
    });

    while (fixName) {
        result = name + " (" + nameCounter + ")";
        fixName = false;
        self.names.forEach(function (nm) {
            if (result === nm)
                fixName = true;
        });
        nameCounter++;
    }

    self.names.push(result);
    return result;
};

/**
 * @propt propagateEvents(event, args) -used to fire events to registered listeners.  Has some logic to prevent recursion
 *
 * @param {string} event - the name of the event
 * @param {object} args - event arguments
 */
UiGraph.prototype.propagateEvents = function (event, args) {
    var self = this;
    if (!self.block.hasOwnProperty(args.type))
        self.block[args.type] = false;
    if (self.block[args.type] === true)
        return;
    self.block[args.type] = true;

    var promises = [];
    self.emit(event, args, promises);
    Promise.all(promises).then(function () {
        self.block[args.type] = false;
    }).catch(function (e) {
        self.block[args.type] = false;
        console.log(e);
    });
};

/**
 * @propt getModelLists(updateSelf) -request lists of available models from server
 *
 * @param {boolean} updateSelf if true will update the serverModels array and emit event
 * @returns {Promise} promise - successful resolve of promise will return result of query
 */
UiGraph.prototype.getModelLists = function (updateSelf) {
    var self = this;
    var update = function (result) {
        if (result && result.hasOwnProperty('views')) {
            self.serverModels = result.views;

        } else {
            self.serverModels = [];
        }
        self.emit(VoEventTypes.$sourceschanged, self);
    };
    var prom = $.ajax({
        type: "GET",
        url: "api/v2/views",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{}"
    });
    if (updateSelf === true)
        prom.done(update);
    return prom;
};

/**
 * @propt categorizeLData(arrayOfData, categories, excludeFunction) -groups data into a hierarchy
 *
 * @param {Array} arrayOfData of all the data items that need to be grouped
 * @param {Array} categories of strings that represent properties that will be grouping properties
 * @param {Function} excludeFunction that will be used to filter elements (true = item is filtered)
 * @returns {Array} - array containing the new grouped hierarchy
 */
UiGraph.prototype.categorizeLData = function (arrayOfData, categories, excludeFunction) {

    function PFolder(cat, parent) {
        this.value = cat;
        this.children = [];
        this.cCopy = [];
        this.properties = [];
        this.dbId = -1;
        this.guid = "";
        this.line = "";
        this.fullLine = "";
        this.acad = "";
        this.layer = "";
        this.clss = "";
        this.type = "folder";
        if (parent)
            parent.addChild.call(parent, this);
    }

    PFolder.prototype.addChild = function (child, parent) {
        this.children.push(child);
        this.cCopy.push(child);
        if (parent)
            parent.addChild(this);
    };

    var data = arrayOfData;

    var root = new PFolder("root");

    for (var j = 0; j < data.length; j++) {
        var testParent = root;
        var currentParent = null;
        var currentItem = data[j];
        // if not filtered then collect
        if (!excludeFunction(currentItem)) {

            categories.forEach(function (propName) {
                // get the category
                var cat = "";
                if (currentItem.hasOwnProperty(propName))
                    cat = currentItem[propName];
                if (!cat)
                    cat = "Undefined";

                for (i = 0; i < testParent.children.length; i++) {
                    var tmpItem = testParent.children[i];
                    var test = tmpItem.value;
                    if (test === cat) {
                        currentParent = testParent.children[i];
                        i = 1000000;
                    }
                }

                if (!currentParent) {
                    currentParent = new PFolder(cat, testParent);
                }
                testParent = currentParent
            });
            currentParent.addChild(currentItem);
        }
    }
    return root.children;
};


UiGraph.prototype.propagateHighlights = function (arrayofSelections, dictionaryName) {
    if (this.selection_block)
        return;
    var eventTargets = this.selections.slice();
    for (var i = 0; i < eventTargets.length; i++) {
        try {
            var view = eventTargets[i];
            var all = [];
            arrayofSelections.forEach(function (selectionData) {
                if (view.hasOwnProperty(dictionaryName)) {
                    var dict = view[dictionaryName];
                    var ids = [];
                    for (j = 0; j < selectionData.ids.length; j++) {
                        var id = selectionData.ids[j];
                        var obj = view.getFromDictionary(dict, id);
                        if (obj) {
                            ids.push(obj.dbId);
                            all.push(obj.dbId);
                        }
                    }
                    if (ids.length > 0) {
                        app_colors.setColors(ids, view, selectionData.color);
                    }
                }
            });
            view.viewer.fitToView(all);
            view.viewer.isolate(all);
        } catch (e) { }
    }
};

UiGraph.prototype.color = function (view, ids, color) {

};

UiGraph.prototype.addToselect = function (view, ids) {
    view.addToselect(ids, true);
};

UiGraph.prototype.select = function (view, ids) {
    view.select(ids);
};

UiGraph.prototype.fit = function (view, ids) {
    view.fitToView(ids);

};

UiGraph.prototype.isolate = function (view, ids) {
    view.isolate(ids);
};

UiGraph.prototype.hide = function (view, ids) {
    view.hide(ids);
};


UiGraph.prototype.propagateAction = function (source, arrayofSelections, actionName) {
    if (this.selection_block)
        return;
    var eventTargets = this.selections.slice();
    for (var i = 0; i < eventTargets.length; i++) {
        try {
            var view = eventTargets[i];
            if (view[actionName]) {
                view[actionName].call(view, source, arrayofSelections);
            }
        } catch (e) { }
    }
};


UiGraph.prototype.getSelectionTarget = function (id) {
    var result = null;
    for (var i = 0; i < this.selections.length; i++) {
        try {
            var itm = this.selections[i];
            if (itm.hasOwnProperty("id")) {
                if (itm.id === id) {
                    result = itm;
                    i = 1000;
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
    return result;
};

// END UiGraph


function ErrHandler() {
    this.errors = "";

    this.addError = function (msg) {
        this.errors = this.errors + "<p>" + msg + "</p>";
    };

    this.hasErrors = function () {
        return (this.errors == "" || this.errors == null)
    };

    this.validate = function () {
        if (this.hasErrors()) {
            throw this.errors;
        }
    }
}

// START OverlayColors

function OverlayColors() {
    this.red = "LmvDbgRedOverlay";
    this.green = "LmvDbgGreenOverlay";
    this.blue = "LmvDbgBlueOverlay";
    this.yellow = "LmvDbgYellowOverlay";
    this.orange = "LmvDbgOrangeOverlay";
    this.white = "LmvDbgWhiteOverlay";
    this.purple = "LmvDbgPurpleOverlay";
    this.black = "LmvDbgBlackOverlay";


}

OverlayColors.prototype.initOverlays = function (viewer) {
    // create Color overlay for Red and assign to all even objects
    var matRed = new THREE.MeshBasicMaterial({ color: 'red' });
    viewer.impl.createOverlayScene(this.red, matRed);
    // create Color overlay for Green and assign to all odd objects
    var matGreen = new THREE.MeshBasicMaterial({ color: 'green' });
    viewer.impl.createOverlayScene(this.green, matGreen);
    // create Color overlay for Green and assign to all odd objects
    var matBlue = new THREE.MeshBasicMaterial({ color: 'blue' });
    viewer.impl.createOverlayScene(this.blue, matBlue);
    var matYellow = new THREE.MeshBasicMaterial({ color: 'yellow' });
    viewer.impl.createOverlayScene(this.yellow, matYellow);

    var matOrange = new THREE.MeshBasicMaterial({ color: 'orange' });
    viewer.impl.createOverlayScene(this.orange, matOrange);

    var matWhite = new THREE.MeshBasicMaterial({ color: 'white' });
    viewer.impl.createOverlayScene(this.white, matWhite);

    var matPurple = new THREE.MeshBasicMaterial({ color: 'violet' });
    viewer.impl.createOverlayScene(this.purple, matPurple);

    var matBlack = new THREE.MeshBasicMaterial({ color: 'black' });
    viewer.impl.createOverlayScene(this.black, matBlack);

};

OverlayColors.prototype.setColors = function (entities, viewer, color) {
    if (!viewer.overlayInitialized) {
        this.initOverlays(viewer.viewer);
        viewer.overlayInitialized = true;
    }


    // don't add these overlays twice
    // if (viewer.meshes.length > 0) {
    //  clearColors(viewer);
    //   }

    this.colorOverrideOnEntity(entities, color, viewer);

};

OverlayColors.prototype.clearColorsNew = function (viewer) {
    for (var i = 0; i < viewer.meshArray.length; i++) {
        var frags = viewer.meshArray[i];
        for (var p in frags) {
            var mesh = frags[p];
            if (mesh) {
                viewer.viewer.impl.removeOverlay(this.red, mesh);
                viewer.viewer.impl.removeOverlay(this.green, mesh);
                viewer.viewer.impl.removeOverlay(this.blue, mesh);
                viewer.viewer.impl.removeOverlay(this.yellow, mesh);
                viewer.viewer.impl.removeOverlay(this.white, mesh);
                viewer.viewer.impl.removeOverlay(this.black, mesh);
                viewer.viewer.impl.removeOverlay(this.purple, mesh);
                viewer.viewer.impl.removeOverlay(this.orange, mesh);
            }
        }
    }
    viewer.meshArray = [];
};


OverlayColors.prototype.clearColors = function (viewer) {
    var frags = viewer.meshes;
    for (var p in frags) {
        var mesh = frags[p];
        if (mesh) {
            viewer.viewer.impl.removeOverlay(this.red, mesh);
            viewer.viewer.impl.removeOverlay(this.green, mesh);
            viewer.viewer.impl.removeOverlay(this.blue, mesh);
            viewer.viewer.impl.removeOverlay(this.yellow, mesh);
            viewer.viewer.impl.removeOverlay(this.white, mesh);
            viewer.viewer.impl.removeOverlay(this.black, mesh);
            viewer.viewer.impl.removeOverlay(this.purple, mesh);
            viewer.viewer.impl.removeOverlay(this.orange, mesh);
        }
    }
    viewer.meshes = {};
};

// walk the list of objects that have geometry and get their fragments.
OverlayColors.prototype.colorOverrideOnEntity = function (entiies, colorOverlayName, viewer) {
    var callbackThis = this;
    viewer.viewer.getObjectTree(function (objTree) {
        for (i = 0; i < entiies.length; i++) {
            var frags = [];
            objTree.enumNodeFragments(entiies[i], function (fragId) {
                frags.push(fragId);
            });
            callbackThis.colorOverrideOnFrags(frags, colorOverlayName, viewer);
        }
    });
};

// walk the list of fragments and add the overlay to its geometry
OverlayColors.prototype.colorOverrideOnFrags = function (fragIds, overlayName, viewer) {
    for (j = 0; j < fragIds.length; j++) {
        var mesh = viewer.viewer.impl.getRenderProxy(viewer.viewer.impl.model, fragIds[j]);

        var myProxy = new THREE.Mesh(mesh.geometry, mesh.material);
        myProxy.matrix.copy(mesh.matrixWorld);
        myProxy.matrixAutoUpdate = false;
        myProxy.matrixWorldNeedsUpdate = true;
        myProxy.frustumCulled = false;
        viewer.viewer.impl.addOverlay(overlayName, myProxy);
        viewer.meshes[fragIds[j]] = myProxy;  // keep track of the frags so that we can remove later
    }
};

// END OverlayColors

// START ModelView

function ModelView(title, view, doc, key) {
    this.type = "View";
    this.key = key;
    this.title = title;
    this.view = view;
    this.modelDoc = doc;
    this.LeafIds = null;
    this.all = [];
    this.filtered = [];
    this.lineDictionary = {};
    this.tagDictionary = {};
    this.idDictionary = {};
    this.acadDictionary = {};
    this.guidDictionary = {};
    this.views = [];
    this.frags = [];
    this.loadView = function (ui_refs, targetView) {
        args = new LoadViewFromViewStack(ui_refs, this, targetView);
        if (args.isMainView)
            args.onLoadViewCompleted = ui_mvLoadCompleted.bind(args);
        else
            args.onLoadViewCompleted = ui_svLoadCompleted.bind(args);
        if (args.isMainView) {
            args.ui.mv_item = args.item;
        }
        else {
            args.ui.sv_item = args.item;
        }
        args.initializeView(args);
        args.loadView(args, args.item.view);
        if (args.onLoadViewCompleted != null) {
            args.onLoadViewCompleted(args);
        }
    }
}
// END ModelView

function LotoStep(idnumber, instructions, tag, line, equipment) {
    this.id = idnumber;
    this.step = instructions;
    this.tag = tag;
    this.line = line;
    this.equipment = equipment;
}
function LotoProcedure(id, title, equipment) {
    this.id = id;
    this.title = title;
    this.equipid = equipment;
    this.steps = [];
    this.addStep = function (step) {
        var array = this.steps;
        array.push(step);
    };
}

function LotoStep2(hash, idnumber, instructions, tag, line, equipment) {
    this.hash = hash;
    this.index = idnumber;
    this.value = instructions;
    this.tag = tag;
    this.line = line;
    this.equipment = equipment;
    this.type = "step";
    this.children = [];
    this.images = { value: "<span class='webix_icon fa-envelope'></span>Images", type: "folder", children: [] };
    this.cameras = { value: 'Views', type: "folder", icon: "envelope", children: [] };
}
LotoStep2.prototype.addImage = function (image) {
    this.images.children.push(image);
    if (this.cameras.children.length === 0) {
        this.children.length = 0;
        this.children.push(this.images);
        this.children.push(this.cameras)
    } else {
        this.children.length = 0;
        this.children.push(this.images)
    }
};

LotoStep2.prototype.addCamera = function (camera) {
    this.cameras.children.push(view);
    if (this.images.children.length === 0) {
        this.children.length = 0;
        this.children.push(this.cameras);
        this.children.push(this.cameras)
    } else {
        this.children.length = 0;
        this.children.push(this.images)
    }
};

function LotoPicture(name, url) {
    this.value = name;
    this.iurl = url;
    this.children = [];
    this.type = "image";
}
function LotoCamera(name, view, camera) {
    this.value = name;
    this.viewname = view;
    if (camera) {
        this.aspect = camera.aspect;
        this.fov = camera.fov;
        this.position = camera.position.clone();
        this.position = view.impl.controls.getLookAtPoint().clone();
        this.children = [];
        this.type = "camera";
    }
}
function LotoProcedure2(hash, id, title, equipment) {
    this.hash = hash;
    this.id = id;
    this.title = title;
    this.equipid = equipment;
    this.steps = [];
    this.addStep = function (step) {
        var array = this.steps;
        array.push(step);
    };
}

LotoProcedure2.prototype.getRefs = function (refs) {
    this.step.forEach(function (step) {
        var images = refs.getRefs.call(refs, "images", "loto");
        images.forEach(function (ref) {
            step.addImage(new LotoPicture(ref.name, ref.path));
        });
    });
};

// START MyAuthToken

function MyAuthToken(env) {
    if (env === "PROD") {
        this.tokenService = "api/v2/auth/token";
        // this.tokenService = "https://salty-caverns-3017.herokuapp.com/auth";
    }
    else if (env === "STG") {
        //this.tokenService = "http://localhost:5000/auth-stg";
        this.tokenService = "https://salty-caverns-3017.herokuapp.com/auth-stg";
    }
    else if (env === "DEV") {
        //this.tokenService = "http://localhost:5000/auth-dev";
        this.tokenService = "https://salty-caverns-3017.herokuapp.com/auth-dev";
    }
    else {
        alert("DEVELOPER ERROR: No valid environment set for MyAuthToken()");
    }

    this.token = "";
    this.expires_in = 0;
    this.timestamp = 0;
}

MyAuthToken.prototype.value = function () {
    // if we've never retrieved it, do it the first time
    if (this.token === "") {
        console.log("AUTH TOKEN: Getting for first time...");
        this.get();
    }
    else {
        // get current timestamp and see if we've expired yet
        var curTimestamp = Math.round(new Date() / 1000);   // time in seconds
        var secsElapsed = curTimestamp - this.timestamp;

        if (secsElapsed > (this.expires_in - 10)) { // if we are within 10 secs of expiring, get new token
            console.log("AUTH TOKEN: expired, refreshing...");
            this.get();
        }
        else {
            var secsLeft = this.expires_in - secsElapsed;
            console.log("AUTH TOKEN: still valid (" + secsLeft + " secs)");
        }
    }

    return this.token;
};

MyAuthToken.prototype.get = function () {
    var retVal = "";
    var expires_in = 0;

    console.log("getting from url " + this.tokenService);

    var jqxhr = $.ajax({
        url: this.tokenService,
        type: 'GET',
        async: false,
        success: function (ajax_data) {
            console.log("AUTH TOKEN: " + ajax_data.access_token);
            retVal = ajax_data.access_token;  // NOTE: this only works because we've made the ajax call Synchronous (and "this" is not valid in this scope!)
            expires_in = ajax_data.expires_in;

        },
        error: function (jqXHR, textStatus) {
            console.log(jqXHR);
            alert("AUTH TOKEN: Failed to get new auth token!");
        }
    });

    this.token = retVal;
    this.expires_in = expires_in;
    this.timestamp = Math.round(new Date() / 1000);  // get time in seconds when we retrieved this token
};

// END MyAuthToken