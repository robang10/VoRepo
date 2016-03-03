// START VopsViewerConfig


// START PropertiesContainer

function PropertiesContainer(name, propertySpecs) {
    this.dbName = name;
    this.properties = propertySpecs.properties;
    this.key = propertySpecs.key;
    this.isInitialized = false;
    this.indexes = [];
    this.selectionKey = propertySpecs.selectby;
    this.highlightKey = propertySpecs.highlightby;
    this.db = null;
    this.all = null;
    this.initialize();
}

// used to add function from string
PropertiesContainer.prototype.parseFunction = function (funString) {
    var funcReg = /function *\(([^()]*)\)[ \n\t]*{(.*)}/gmi;
    var match = funcReg.exec(funString.replace(/\n/g, ' '));

    if (match) {
        return new Function(match[1].split(','), match[2]);
    }
    return null;
};

// initializtion of data container
PropertiesContainer.prototype.initialize = function () {
    this.db = new loki(this.dbName);
    var props = this.properties;
    var self = this;
    props.forEach(function (prop) {
        if (prop.indexed) {
            var name = (prop.diplayText && prop.diplayText.length > 0) ?
                prop.diplayText :
                prop.alias;

            self.indexes.push({ id: prop.alias, value: name });
        }
        if (prop.calculationString) {
            prop.calculateFunction = self.parseFunction.call(self, prop.calculationString);
        }
    });
    this.all = this.db.addCollection('all');
    this.isInitialized = true;
};

// gets builds an object from the model nodes.
PropertiesContainer.prototype.getItemsFromNodes = function (nodes, filter) {
    for (var i = 0; i < nodes.length; i++) {
        this.addNodesToCollection(nodes[i], filter);
    }
    var all = this.all;
    all.ensureIndex(this.key, true);
    this.indexes.forEach(function (idx) {
        all.ensureIndex(idx.id, true);
    })
};

// adds all of the properties to the item
PropertiesContainer.prototype.addNodesToCollection = function (node, filter) {
    if (!node.properties)
        return;

    var self = this;
    var recurseChildren = function (testNode) {
        var chdrn = testNode.children;
        if (chdrn) {
            chdrn.forEach(function (item) {
                self.addNodesToCollection.call(self, item, filter);
            })
        }
    };

    if (filter) {
        node.properties.forEach(function (propTest) {
            if (filter(propTest)) {
                recurseChildren.call(self, node);
                return;
            }
        });
    };

    var newItem = {
        value: node.name,
        properties: []
    };
    newItem[self.key] = node.dbId;

    var addToItem = function (spec, prop, item) {
        var propValue = prop.displayValue;
        if (!propValue) propValue = null;
        item[spec.alias] = propValue;
        item.properties.push({ name: spec.alias, value: propValue });
        if (spec.calculateFunction) {
            spec.calculateFunction(prop, item);
        }
    };

    node.properties.forEach(function (property) {

        for (i = 0; i < this.properties.length; i++) {
            var propSpec = this.properties[i];
            // there are three options...
            // option 1 - display value and display collection specified in spec
            if (propSpec.name && propSpec.displayCategory) {
                if (property.displayName === propSpec.name &&
                    property.displayCategory === propSpec.displayCategory) {
                    addToItem(propSpec, property, newItem);
                    i = 1000000;
                }
            }
                // option 2 - only name is specified
            else if (propSpec.name) {
                if (property.displayName === propSpec.name) {
                    addToItem(propSpec, property, newItem);
                    i = 1000000;
                }
            }
                // option 3 - only displayCategory Specified {
            else if (propSpec.displayCategory) {
                if (property.displayCategory === propSpec.displayCategory) {
                    newItem.properties.push({
                        name: property.displayName,
                        value: property.displayValue
                    });
                    i = 1000000;
                }
            }
        }
    })
    this.all.insert(newItem);
    recurseChildren.call(self, node, filter);
};;


// END PropertiesContainer


// START UiViewer

function UiViewer(parent_element, config) {
    this.sink = new EventDispatcher();
    // TODO Fix this brittle dependancy...
    this.name = app_ui.registerName(config.value);
    this.viewer = null;
    this.meshes = {};
    this.meshArray = [];
    this.verbose = false;
    this.urn = config.id;
    this.document = null;
    this.views = [];
    this.uiID = this.name + "_layout";
    this.parent = parent_element;
    this.data = new PropertiesContainer(this.name, config);
    this.overlayInitialized = false;
    this.timerCounter = 0;
    var eventThis = this;

    var cld = $$(this.parent).getChildViews();
    var index = cld.length;

    var uiview = {
        id: this.uiID, type: "clean",
        rows: [
        {
            view: "toolbar", id: this.name + "_tb", height: 38,
            cols: [
                {
                    id: this.name + "mnu", view: "menu", autowidth: true, openAction: "click",
                    type: { subsign: true, },
                    data: [
                        {
                            id: 1, value: this.name,
                            submenu: [
                                {
                                    value: "Color Selected", id: "color", submenu: [
                                          { value: "Red", id: "cred" },
                                          { value: "Blue", id: "cblue" },
                                          { value: "Green", id: "cgreen" },
                                          { value: "Yellow", id: "cyellow" },
                                          { value: "Orange", id: "corange" },
                                          { value: "Purple", id: "cpurple" },
                                          { value: "Black", id: "cblack" },
                                          { value: "White", id: "cwhite" }
                                    ]
                                },
                                { value: "Clear Color", id: "cclear" },
                                {
                                    value: "Model Selection", id: "schaining", submenu:
                                      [
                                          {
                                              value: "Selection Linking", id: "slinking", submenu:
                                              [
                                                  { value: "Do Not Select on External Selection", id: "rselect" },
                                                  { value: "Select Items on External Selection", id: "aselect" }
                                              ]
                                          },
                                          { value: "Selection Scope", id: "scope", submenu: this.getIndexMenus("mssc") },


                                      ]
                                },
                                { value: "Close View", id: "close" },
                                {
                                    value: "Utilities", id: "util", submenu:
                                      [
                                          { value: "Save as Main", id: "smain" }
                                      ]
                                }]
                        }],
                    on: { onMenuItemClick: function (id) { eventThis.onUIClick.call(eventThis, id, eventThis); } }
                }
            ]
        },
        { body: '<div id="' + this.name + '_ctnr"><div id="' + this.name + '"></div></div>' }
        ]
    };
    $$(this.parent).addView(uiview, index + 1);
}

UiViewer.prototype.getItemsByKeys = function (ids) {
    var self = this;
    var p = new Promise(function (resolve, reject) {
        try {
            var linkedItems = [];
            ids.forEach(function (id) {
                var criteria = {};
                criteria[self.data.key] = id;
                var results = self.data.all.find(criteria);
                Array.prototype.push.apply(linkedItems, results);
            });
            resolve(linkedItems);
        } catch (e) { reject(e); }
    });
    return p;
};

UiViewer.prototype.subscribeEvents = function (sink) {
    sink.on(VoEventTypes.$propagation, this, this.propagationHandler);
    sink.on(VoEventTypes.$resize, this, this.resize);
};


UiViewer.prototype.unsubscribeEvents = function (sink) {
    sink.removeListener(VoEventTypes.$propagation, this, this.propagationHandler);
    sink.removeListener(VoEventTypes.$resize, this, this.resize);
};


UiViewer.prototype.getIndexMenus = function (prefix) {
    var result = [];
    this.data.indexes.forEach(function (idx) {
        result.push({ value: idx.value, id: prefix + idx.id });
    });
    return result
};

UiViewer.prototype.resize = function (args) {
    this.viewer.resize();
};

UiViewer.prototype.onUIClick = function (id, view) {
    if (id === "close") {
        this.viewClose(view);
    } else if (id === "rselect") {
        this.removeSelections(view);
    } else if (id === "aselect") {
        this.addSelections(view);
    } else if (id === "cred") {
        this.viewColor(view, app_colors.red);
    } else if (id === "cblue") {
        this.viewColor(view, app_colors.blue);
    } else if (id === "cyellow") {
        this.viewColor(view, app_colors.yellow);
    } else if (id === "cgreen") {
        this.viewColor(view, app_colors.green);
    } else if (id === "cblack") {
        this.viewColor(view, app_colors.black);
    } else if (id === "cwhite") {
        this.viewColor(view, app_colors.white);
    } else if (id === "corange") {
        this.viewColor(view, app_colors.orange);
    } else if (id === "cgreen") {
        this.viewColor(view, app_colors.purple);
    } else if (id === "cpurple") {
        this.viewClearColor(view);
    } else if (id === "cclear") {
        this.viewClearColor(view);
    } else if (id.indexOf("mssc") > -1) {
        this.data.highlightKey = id.replace("mssc", "");
    }
    else if (id === "smain") {
        this.SaveDataLocally();
    }
};

UiViewer.prototype.SaveDataLocally = function (dbName) {
    return app_ui.saveModelDataAsLocal("Plant Local Data", this.data);

};

UiViewer.prototype.viewClose = function (view) {
    this.unsubscribeEvents(app_ui);
    id = $$(view.parent).removeView(view.uiID);
    window.setTimeout(resizeViews, 700);
};

UiViewer.prototype.viewColor = function (view, color) {
    var selectSet = view.viewer.getSelection();
    app_colors.setColors(selectSet, view, color);
};

UiViewer.prototype.viewClearColor = function (view) {
    app_colors.clearColors(view);
};


UiViewer.prototype.removeSelections = function (view) {
    this.unsubscribeEvents(app_ui);
};

UiViewer.prototype.addSelections = function (view) {
    this.unsubscribeEvents(app_ui);
    this.subscribeEvents(app_ui);
};

UiViewer.prototype.initializeView = function () {
    this.isInitialized = true;
    if (this.verbose)
        console.log("initializeView");
    try {
        var viewerElement = document.getElementById(this.name);
        this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});
        this._loadModel.call(this);

    } catch (e) {
        this.isInitialized = false;
    }
};

UiViewer.prototype.is2D = function () {
    if (!this.viewer)
        return true;
    if (!this.viewer.model)
        return true;
    return this.viewer.model.is2d();
};

UiViewer.prototype.getSelection = function () {
    if (!this.viewer)
        return true;
    if (!this.viewer.model)
        return true;
    return this.viewer.model.is2d();
};

UiViewer.prototype.addOnError = function (callbaack) { this.sink.add("error", callbaack); };
UiViewer.prototype.removeOnError = function (callbaack) { this.sink.remove("error", callbaack); };
UiViewer.prototype.addOnDocLoaded = function (callbaack) { this.sink.add("docLoaded", callbaack); };
UiViewer.prototype.removeOnDocLoaded = function (callbaack) { this.sink.remove("docLoaded", callbaack); };
UiViewer.prototype.addOnViewLoaded = function (callbaack) { this.sink.add("viewLoaded", callbaack); };
UiViewer.prototype.removeOnViewLoaded = function (callbaack) { this.sink.remove("viewLoaded", callbaack); };
UiViewer.prototype.addOnSelectionChanged = function (callbaack) { this.sink.add("selectionChanged", callbaack); };
UiViewer.prototype.removeOnSelectionChanged = function (callbaack) { this.sink.remove("selectionChanged", callbaack); };
UiViewer.prototype.addOnPropertiesPrepared = function (callbaack) { this.sink.add("propertiesPrepared", callbaack); };
UiViewer.prototype.removeOnPropertiesPrepared = function (callbaack) { this.sink.remove("propertiesPrepared", callbaack); };

UiViewer.prototype.refreshModelViews = function () {
    if (this.verbose)
        console.log("refreshModelViews");

    this.views = [];
    var d3v = this.get3DViews();
    for (var i = 0; i < d3v.length; i++) {
        var vw = d3v[i];
        var nitem = new ModelView(this.name + " - " + vw.name, vw, this.document, this.name);
        this.views.push(nitem);
    }
    var d2v = this.get2DViews();
    for (var i = 0; i < d2v.length; i++) {
        var vw = d2v[i];
        var nitem = new ModelView(this.name + " - " + vw.name, vw, this.document, this.name);
        this.views.push(nitem);
    }
};

UiViewer.prototype.get3DViews = function () {
    var result = Autodesk.Viewing.Document.getSubItemsWithProperties(this.document.getRootItem(), { 'type': 'geometry', 'role': '3d' }, true);
    return result;
};

UiViewer.prototype.get2DViews = function () {
    var result = Autodesk.Viewing.Document.getSubItemsWithProperties(this.document.getRootItem(), { 'type': 'geometry', 'role': '2d' }, true);
    return result;
};

UiViewer.prototype._loadModel = function () {
    if (this.verbose)
        console.log("_loadModel");

    if (!this.isInitialized) {
        console.log("viewer is not initialized");
        return;
    }

    if (!this.urn) {
        this.fire(this, "error", "Invalid URN");
    }

    var self = this;
    var afterModelLoaded = function () {
        if (self.verbose)
            console.log("afterModelLoaded");
        if (!self.isInitialized) {
            console.log("viewer is not initialized");
            return;
        }
        self.refreshModelViews();
        self.sink.fire(self, "docLoaded", { sender: self, success: true })
    };

    if (!self.document) {
        var fullUrnStr = "urn:" + self.urn;
        Autodesk.Viewing.Document.load(fullUrnStr,
            function (document) {
                self.document = document;
                window.setTimeout(function () { afterModelLoaded.call(self); }, 800)
            },
            function (errorCode, errorMsg) {
                self.sink.fire(callbackThis, "docLoaded", { sender: self, success: false, error: 'Error loading document ' + self.url + ' error: ' + errorCode + " " + errorMsg });
            });
    }
};

UiViewer.prototype.loadView = function (view) {
    if (this.verbose)
        console.log("loadView");

    try {
        this.viewer.uninitialize();
    } catch (e) { }

    var retCode = this.viewer.initialize();
    if (retCode !== 0) {
        this.fire(this, "error", "Error initializing view");
        return;
    }

    var callbackThis = this;
    var loadedCB = function (viewer, event) {
        callbackThis.sink.fire(callbackThis, "viewLoaded", { sender: callbackThis, success: true });
    };

    var selectionCB = function (event) {
        callbackThis.sink.fire(callbackThis, "selectionChanged", { sender: callbackThis, success: false });
    };

    var loadedSuccessCB = function () { };
    var loadFailureCB = function () { };

    this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, loadedCB);
    this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, selectionCB);

    var path = this.document.getViewablePath(view.view);
    console.log("Loading view URN: " + path);

    var dbPath = this.document.getPropertyDbPath();
    this.viewer.load(path, dbPath, loadedSuccessCB, loadFailureCB);
};

UiViewer.prototype.getModelProperties = function () {
    this.viewer.impl.selectionMaterialBase.color.r = 255;
    this.viewer.impl.selectionMaterialBase.color.g = 0;
    this.viewer.impl.selectionMaterialBase.color.b = 124;
    if (this.is2D()) {
        var num = this.viewer.model.getData().hasObjectProperties;
        if (num && num > 0) {
            this.propsInitialized = true;
            this._get2DModelProps(num);
        }
        else {
            this.timerCounter++;
            var self = this;
            if (this.timerCounter < 3) {
                window.setTimeout(function () { self.getModelProperties.call(self); }, 3000);
            }
        }
    } else {
        this.propsInitialized = true;
        this._get3DModelProps();
    }
};


UiViewer.prototype._get2DModelProps = function (num) {
    var callbackThis = this;
    var ids = [];
    var promises = [];

    for (var i = 0; i < num; i++) {
        ids.push(i);
    }
    callbackThis._get2DNodeProps(ids, promises);

    Promise.all(promises).then(function () {

        callbackThis.sink.fire(callbackThis, "propertiesPrepared", { sender: callbackThis, success: true });

    });
};

UiViewer.prototype._get2DNodeProps = function (ids, promises) {
    var self = this;
    var p1 = new Promise(function (resolve, reject) {
        var properties = [];
        self.data.properties.forEach(function (prop) {
            properties.push(prop.name);
        });
        self.viewer.model.getBulkProperties(ids, properties, function (data) {
            if (!data)
                resolve([]);
            else
                resolve(data);
        });
    });

    promises.push(p1);
    p1.then(function (data) {
        self.data.getItemsFromNodes(data);
    });


};




UiViewer.prototype._get3DModelProps = function () {
    var self = this;
    var gObjectTreeResponse = function (objTree) {
        var root = objTree.root;
        var prom = [];

        self._get3DNodeProps(root, prom);

        Promise.all(prom).then(function () {
            self.data.getItemsFromNodes([root]);
            self.sink.fire(self, "propertiesPrepared", { sender: self, success: true })
        });
    };

    this.viewer.getObjectTree(gObjectTreeResponse);
};


UiViewer.prototype._get3DNodeProps = function (node, promises) {
    node.value = node.name;
    var callbackThis = this;
    var p1 = new Promise(function (resolve, reject) {
        callbackThis.viewer.getProperties(node.dbId, function (data) {
            if (data.properties === null || data.properties.length < 1)
                resolve([]);
            else
                resolve(data.properties);
        });
    });

    promises.push(p1);
    p1.then(function (data) {
        node.properties = data;
    });

    if (node.children) {
        var arrayOfchildren = node.children;
        arrayOfchildren.forEach(function (child) {
            callbackThis._get3DNodeProps(child, promises);
        });
    }
};


/**
 * @propt propagationHandler(args) - event handler for propagation events
 *
 * @param {object} args - a instance of a VoArgs object
 */
UiViewer.prototype.propagationHandler = function (args) {
    // this is a hack put in to fix issue where propeties are not yet loaded 
    if (!this.propsInitialized) {
        this.getModelProperties()
    }

    // prevent recursion
    if (args.source === this)
        return;

    if (args.type === VoPropTypes.$select) {
        this.selectionUpdate(args);
    }
};


/**
 * @propt selectionUpdate(args) - updates the selection of the view based on a selection elsewhere
 *
 * @param {VoArgs} args - a instance of a VoArgs object
 */
UiViewer.prototype.selectionUpdate = function (args) {

    var ids = this.getIdsFromSelections(args.selections);

    if (ids.length > 0) {
        this.viewer.select(ids);

        if (this.is2D() === false) {
            this.viewer.fitToView(ids);
            //  this.viewer.isolate(seletected);
        }
    }
};

/**
 * @propt getIdsFromSelections(selections) - gets viewer object ID from a list of selection objects
 *
 * @param {array} selections - a list of objects that has been selected which will be resolved.
 */
UiViewer.prototype.getIdsFromSelections = function (selections) {
    var results = [];
    var self = this;
    selections.forEach(function (selection) {
        if (selection.hasOwnProperty(self.data.highlightKey)) {
            var criteria = {};
            criteria[self.data.highlightKey] = selection[self.data.highlightKey];
            var query = self.data.all.find(criteria);
            query.forEach(function (item) {
                if (item.hasOwnProperty(self.data.key)) {
                    results.push(item[self.data.key]);
                }
            });
        }
    });
    return results;
};

UiViewer.prototype.color = function (ids, color) {

};

UiViewer.prototype.showAll = function (source, selectedItems) {
    if (source === this)
        return;
    this.viewer.showAll();
};

UiViewer.prototype.fitFromSelections = function (source, selectedItems) {
    if (source === this)
        return;
    var ids = this.getIDs(selectedItems);
    this.fitFromIds(ids);
};

UiViewer.prototype.fitFromIds = function (ids) {
    if (ids.length > 0) {
        this.viewer.fitToView(ids);
    }
};

UiViewer.prototype.isolateFromSelections = function (source, selectedItems) {
    if (source === this)
        return;
    var ids = this.getIDs(selectedItems);
    this.isolateFromIds(ids);
};

UiViewer.prototype.isolateFromIds = function (ids) {
    if (ids.length > 0) {
        this.viewer.showAll();
        this.viewer.isolate(ids);
    }
};

UiViewer.prototype.hideFromSelections = function (source, selectedItems) {
    if (source === this)
        return;
    var ids = this.getIDs(selectedItems);
    this.hideFromIds(ids);
};

UiViewer.prototype.hideFromIds = function (ids) {
    if (ids.length > 0) {
        this.viewer.hide(ids);
    }
};

UiViewer.prototype.selectFromSelections = function (source, selectedItems) {
    if (source === this)
        return;
    var ids = this.getIDs(selectedItems);
    this.selectFromIds(ids);
};

UiViewer.prototype.selectFromIds = function (ids) {
    if (ids.length > 0) {
        this.viewer.select(ids);
    }
};



