function UiConfig() {
    this.buttonHeight = 30;
    this.buttonWidth = 100;
    this.rowHeight = 20
}

UiConfig.prototype.setTouch = function () {
    this.buttonHeight = 45;
    this.buttonWidth = 120;
    this.rowHeight = 40;
}

function buildResponsiveUI() {
    webix.ui({
        id: "rootctrl", view: "accordion",
        multi: true, type: "line", container: "root_div", height: "100%", width: "100%",
        cols: [
        { id: 'col1', width: 200, header: "Items", body: "content 1" },
        { id: 'rs1', view: "resizer" },
        {
            id: 'col2', width: 350, header: "Models",
            body: {
                id: "verses", height: '2000',
                gravity: 50, header: "Models",
                view: 'scrollview',
                scroll: "y",
                rows: [
                    { view: "textarea", label: "Note", labelAlign: "right", height: 500, value: "type here" },
                    { view: "textarea", label: "Note", labelAlign: "right", height: 500, value: "type here" },
                    { view: "textarea", label: "Note", labelAlign: "right", height: 500, value: "type here" },
                    { view: "textarea", label: "Note", labelAlign: "right", height: 500, value: "type here" },
                    { view: "textarea", label: "Note", labelAlign: "right", height: 500, value: "type here" }
                ]
            }
        },
        { id: 'rs2', view: "resizer" },
        { id: 'col3', width: 350, header: "Data", body: "content 3" }
        ],
        on: {
            onAfterCollapse: function (id) {
                setResizers();
            },
            onAfterExpand: function (id) {
                setResizers();
            }
        }
    });




    function setResizers(id) {
        try {

        } catch (e) {

        }


    }
}

function buildUI() {
    var treeMapper = webix.DataDriver.json = webix.copy(webix.DataDriver.json);
    treeMapper.child = "children";
    treeMapper.value = "name";

    var setting_hgt = 38;

    // root container
    webix.ui({
        id: "rootctrl", type: "line", container: "root_div", height: "100%",
        cols: [
// ctrl_H1
                {
                    id: "ctrl_H1", type: "clean", gravity: 20, height: "100%", padding: "4",
                    rows: [
// ctrl_H1_header
                        { id: "ctrl_H1_header", view: "template", template: "Virtual Operations", type: "header", height: setting_hgt, drag: true },
                        {
                            id: "ctrl_H1_header_views", view: "toolbar", height: setting_headhgt,
                            rows: [{
                                id: "ctrl_H1_header_views_mnu", view: "menu", autowidth: true, openAction: "click",
                                type: { subsign: true }, data: [{ id: 1, value: "Load:", submenu: [] }],
                                on: { onMenuItemClick: viewsMenuClick }
                            }]
                        },
// ctrl_H1_section_btns                                
                        { id: "ctrl_H1_section_btnsds", view: "template", template: "Maintenance Views", type: "section", height: setting_hgt },
// ctrl_H1_btn_equip
                        { id: "ctrl_H1_btn_equip", view: "button", value: "Equipment Properties", on: { 'onItemClick': function (id) { $$('main_layout').show(); } } },
// ctrl_H1_btn_tolo
                        { id: "ctrl_H1_btn_tolo", view: "button", value: "Lock Out Tag Out Procedures", on: { 'onItemClick': function (id) { $$('ctrl_H3_2').show(); } } },
// ctrl_H1_btn_loop
                        { id: "ctrl_H1_btn_loop", view: "button", value: "Inspection Data", on: { 'onItemClick': function (id) { $$('ctrl_H3_3').show(); } } },//,
                    // ctrl_H1_btn_loop
                     //   { id: "ctrl_H1_btn_test", view: "button", value: "test", on: { 'onItemClick': function (id) { $$('ctrl_H3_4').show(); } } },
// ctrl_H1_section_heit                                
                        { id: "ctrl_H1_section_heir", view: "template", template: "Plant Equipment Listing", type: "section", height: setting_hgt },
// ctrl_H1_header_groups
                        {
                            id: "ctrl_H1_header_groups", view: "toolbar", height: setting_headhgt,
                            rows: [{
                                id: "ctrl_H1_header_group_mnu", view: "menu", autowidth: true, openAction: "click",
                                type: { subsign: true }, data: [{
                                    id: 1, value: "Listing Options:", submenu: [
                                         { value: "By Equipment Class", id: "class" }, { value: "By Line Number", id: "line" }, { value: "By Model Layer", id: "layer" },
                                         { value: "By Inspection Loop", id: "loop" }, { value: "By Tag", id: "tag" }]
                                }],
                                on: { onMenuItemClick: function (id) { ctrl_H1_header_group_mnu_click(id); } }
                            }]
                        },
                        { id: "mv_tree", view: "tree", datatype: "treeMapper", select: "multiselect", onContext: {} }
                    ]
                },
// ctrl_HRS1
                { type: "wide", id: 'ctrl_HRS1', css: "gray", view: "resizer" },
// ctrl_H2
                {
                    id: "ctrl_H2", type: "clean", gravity: 50, padding: "4",
                    rows: [
// ctrl_H2_view
                        {
                            id: "ctrl_H2_view", type: "clean",
                            cells: [{ id: "ctrl_H2_0", select: true, view: "layout", type: "clean", rows: [] }]
                        }]
                },

// ctrl_HRS2
                { type: "wide", id: 'ctrl_HRS2', css: "gray", view: "resizer" },
// ctrl_H3
                {
                    id: "ctrl_H3", type: "clean", gravity: 50, padding: "4",
                    rows: [
// ctrl_H3_view

                        {
                            id: "ctrl_H3_view", type: "clean",
                            cells: [
                                  buildProperty("main"),
  //                              id: "ctrl_H3_1", select: true, view: "layout", type: "clean",
  //                              rows: [ {
  //                                  view: "toolbar", height: setting_headhgt,
  //                                  cols: [{ view: "menu", openAction: "click", autowidth: true, type: { subsign: true, }, data: [{ id: 1, value: "Equipment Properties", submenu: ["Highlight Selected", "Filter Selected", "Clear Filter"] }] }]
  //                                     },
  //// ctrl_ctrl_H3_layout
  //                                    { id: "ctrl_H2", type: "clean", padding: "4", height: "100%",
  //                                        rows: [ {
  //                                            id: "ctrl_H3_1_Layout", type: "clean",
  //                                            rows: [{
  //// prop_grid
  //                                                id: "prop_grid", view: "datatable", select: "row", multiselect: true, scrollY: true, AutoHeight: true, data: null,
  //                                                columns: [{ id: "displayName", header: "Name", fillspace: 2 }, { id: "displayValue", header: "Value", fillspace: 4 },{ id: "displayCategory", header: "Category", fillspace: 4 }]
  //                             } ] } ] } ] },
  // ctrl_H3_2                                       
                              {
                                  id: "ctrl_H3_2", select: false, view: "layout", type: "clean",
                                  rows: [{
                                      view: "toolbar", height: setting_headhgt,
                                      cols: [{
                                          view: "menu", openAction: "click", autowidth: true, type: { subsign: true, },
                                          data: [{ id: 1, value: "Lock Out Tag Out Operations", submenu: [] }]
                                      }]
                                  },
  // ctrl_H1_section_mv
                                  { id: "ctrl_H3_2_section", view: "template", template: "Select Equipment to Isolate", type: "section", height: setting_hgt },
                                  {
                                      view: "toolbar", id: "myToolbar", css: "wht",
                                      cols: [
                                          { view: "button", id: "loto_btn_record", label: "Record LOTO", width: 140, align: "left", disabled: true, on: { "onItemClick": function (id, e) { ui_record_tolo(); } } },
                                          { view: "button", id: "loto_btn_save", label: "Save LOTO", width: 150, align: "center", disabled: true, on: { "onItemClick": function (id, e) { ui_save_tolo(); } } },
                                          { view: "button", id: "loto_btn_submmit", label: "Submit LOTO", width: 150, align: "center", disabled: true, on: { "onItemClick": function (id, e) { ui_submit_tolo(); } } },
                                          { view: "button", id: "loto_btn_cancel", label: "Cancel", width: 100, align: "right", disabled: true, on: { "onItemClick": function (id, e) { ui_cancel_tolo(); } } },
                                          { view: "button", id: "loto_btn_print", label: "Print", width: 100, align: "right", disabled: false, on: { "onItemClick": function (id, e) { ui_print_tolo(); } } }

                                      ]
                                  },
  // loto_cbo
                                   {
                                       view: "combo", id: "loto_cbo",
                                       options: {
                                           filter: function (item, input) { var id = item.id; var value1 = item.value1; return value1.indexOf(input) !== -1 || id.indexOf(input) !== -1; },
                                           template: '#id# : #title#', body: { data: loto2_list(), template: '#id# : #title#' }, readonly: true
                                       },
                                       on: { 'onChange': lotoGridChanged }
                                   },

                                   { id: "ctrl_H3_2_section2", view: "template", template: "Isolation Steps", type: "section", height: setting_hgt },
  // loto_grid
                                   {
                                       id: "loto_grid", view: "datatable", select: "row", editable: true, multiselect: true, scrollY: true, AutoHeight: true, data: null,
                                       columns: [{ id: "index", header: "Step", fillspace: 1 }, { id: "value", header: "Instruction", fillspace: 4 }, { id: "done", header: "Complete", fillspace: 1, hidden: true, editor: "checkbox", template: "{common.checkbox()}" }],
                                       on: { "onAfterSelect": lotoGridSelect }
                                   }, {
                                       id: "loto_splitter", view: "resizer"
                                   }, {
                                       id: "loto_tree", view: "tree", onContext: {}, data: [{ value: "Images", children: [] }, { value: "Views", children: [] }, { value: "Documents", children: [] }]
                                   }
                                  ]
                              },
   // ctrl_H3_3
                             {
                                 id: "ctrl_H3_3", select: false, view: "layout", type: "clean",
                                 rows: [{
                                     view: "toolbar", height: setting_headhgt,
                                     cols: [{
                                         view: "menu", autowidth: true, openAction: "click", type: { subsign: true, },
                                         data: [{ id: 1, value: "Inspection Operations", submenu: [{ value: "Reset", id: "reset" }, { value: "Show Failed", id: "failed" }, { value: "Show Status", id: "status" }], }],
                                         on: { onMenuItemClick: function (id) { isoMenuClick(id); } }
                                     }]
                                 },
      // iso_grid
                                {
                                    id: "iso_grid", view: "datatable", css: "smltxt", select: "row", multiselect: true, scrollY: true, AutoHeight: true, data: inspectData(),
                                    columns: [{ id: "Description", header: "Description", width: 450 }, { id: "CML", header: "CML", width: 150 },
                                           { id: "Type", header: "Type", width: 80 }, { id: "Size", header: "Size", width: 50 }, { id: "OrigThick", header: "Original", width: 80 },
                                           { id: "MinThick", header: "Minumum", width: 80 }, { id: "LastMeasured", header: "Measured", width: 80 }, { id: "BelowThreshold", header: "Below", width: 80 }],
                                    on: { "onAfterSelect": isoGridSelect }
                                }]
                             },
   // ctrl_H3_4
                             {
                                 id: "ctrl_H3_4", select: false, view: "layout", type: "clean",
                                 rows: [{
                                     view: "toolbar", height: setting_headhgt,
                                     cols: [{
                                         view: "menu", autowidth: true, openAction: "click", type: { subsign: true, },
                                         data: [{ id: 1, value: "LOTO 2 Operations", submenu: [{ value: "Reset", id: "reset" }, { value: "Show Failed", id: "failed" }, { value: "Show Status", id: "status" }], }],
                                         on: { onMenuItemClick: function (id) { isoMenuClick(id); } }
                                     }]
                                 },
      // iso_grid
                                {
                                    id: "loto_tree_2", view: "tree", css: "smltxt", select: "row", multiselect: true, scrollY: true, AutoHeight: true, data: loto2_set().steps
                                }]
                             }
                            ]
                        }]
                }]
    });

    webix.ui({
        id: "ctrl_checklist", view: "window", move: true, head: "Checklist", left: 100, top: 100, height: "700px",
        body: {
            view: "layout",
            rows: [{
                view: "toolbar", id: "myToolbar",
                cols: [
                      { view: "button", id: "toloReloadSession", value: "Reset", width: 100, align: "left" },
                      { view: "button", id: "toloSaveSession", value: "Save", width: 100, align: "center", on: { "onItemClick": function (id, e) { $$("ctrl_checklist").close(); } } },
                      { view: "button", id: "toloCancelSession", value: "Cancel", width: 100, align: "right", on: { "onItemClick": function (id, e) { $$("ctrl_checklist").close(); } } }
                ]
            },
               {
                   view: "datatable", id: "checklist_grid", select: "row", autoheight: true, autowidth: true, data: null,
                   columns: [
                           { id: "id", header: "Step", fillspace: 1 },
                           { id: "step", header: "Instruction", fillspace: 4 },
                           { id: "done", header: "Complete", fillspace: 1 }
                   ]
               }]
        }
    });

    webix.ui({
        view: "contextmenu",
        id: "mv_tree_mnu",
        data: [
            "Add",
        ]
    });

    webix.ui({
        view: "contextmenu",
        id: "mv_prop_tree_mnu",
        data: [
            "Add",
        ]
    });

    webix.ui({
        view: "contextmenu",
        id: "mv_loto_tree_mnu",
        data: [
            "View",
        ]
    });

    webix.ui({
        view: "window",
        position: "center" //or "top"
        //..window config

    });

    // register events


    $$("ctrl_H3").attachEvent("onViewResize", function () {
        resizeViews();
    });

    $$("ctrl_H1").attachEvent("onViewResize", function () {
        resizeViews();
    });

    $$("ctrl_H2").attachEvent("onViewResize", function () {
        resizeViews();
    });

    app_ui.equip_grid = $$("equip_grid");
    app_ui.prop_grid = $$("main_prop_grid");
    app_ui.prop_tree = $$("main_prop_tree");
    app_ui.equip_grid = $$("equip_grid");
    app_ui.loto_grid = $$("loto_grid");
    app_ui.loto_tree = $$("loto_tree");
    app_ui.lotoCbo = $$("loto_cbo");
    app_ui.iso_grid = $$("iso_grid");
    app_ui.mv_tree = $$("mv_tree");



    var treeViewer = new UiDataViewer("mv_tree", app_ui.masterData, "tag", treeviewPropagation);
    app_ui.selections.push(treeViewer);
    app_ui.mv_tree.attachEvent("onItemDblClick", mv_tree_dblClick);
    app_ui.mv_tree.attachEvent("onSelectChange", mv_tree_select);
    app_ui.mv_tree.attachEvent("onBeforeContextMenu", mv_tree_context);
    app_ui.prop_tree.attachEvent("onBeforeContextMenu", mv_prop_tree_context);
    app_ui.loto_tree.attachEvent("onBeforeContextMenu", mv_loto_tree_context);
    app_ui.loto_tree.attachEvent("onBeforeContextMenu", mv_loto_tree_context);

    $$('mv_tree_mnu').attachTo($$('mv_tree'));
    $$('mv_prop_tree_mnu').attachTo(app_ui.prop_tree);
    $$('mv_loto_tree_mnu').attachTo(app_ui.loto_tree);
    $$('mv_tree_mnu').attachEvent("onMenuItemClick", mv_tree_mnu_click);
    $$('mv_prop_tree_mnu').attachEvent("onMenuItemClick", mv_prop_tree_mnu_click);
    $$('mv_loto_tree_mnu').attachEvent("onMenuItemClick", mv_loto_tree_mnu_click);
    window.addEventListener("resize", resizeViews);
    $$('ctrl_H1').attachEvent("resize", resizeViews);
    $$('ctrl_H2').attachEvent("resize", resizeViews);
    $$('ctrl_H3').attachEvent("resize", resizeViews);

    app_ui.on(VoEventTypes.$sourceschanged, app_ui, onSourceChange);
    app_ui.on(VoEventTypes.$masterchanged, app_ui, onMasterChangeChange);
    ui_initialize();
    app_ui.initializeRegistries().then(function (result) {
        mv_build_load_menu();
        window.setTimeout(function () {
            resizeViews();
        },
        1000
        )
    });;
    app_ui.getModelLists(true);
}

function onSourceChange(source) {
    mv_build_load_menu();
}

function onMasterChangeChange(source) {
    app_ui.mv_tree.clearAll();
    ctrl_H1_header_group_mnu_click("");
}

function treeviewPropagation(args) {
    var items = [];
    args.selections.forEach(function (item) {
        if (item.hasOwnProperty(args.key) && item[args.key]) {
            var criteria = {};
            criteria[args.key] = item[args.key];
            var results = args.data.find(criteria);
            if (results && results.length > 0) {
                results.forEach(function (result) {
                    items.push(result);
                });
            }
        }
    });
    var t = items;
}

function tablePropagation(args) {
    var items = [];
    args.selections.forEach(function (item) {
        if (item.hasOwnProperty(args.key) && item[args.key]) {
            var criteria = {};
            criteria[args.key] = item[args.key];
            var results = args.data.find(criteria);
            if (results && results.length > 0) {
                results.forEach(function (result) {
                    items.push(result);
                });
            }
        }
    });
    var t = items;
}

// UI initialization functions
var _myAuthToken = new MyAuthToken("PROD");
function getAccessToken() {
    return _myAuthToken.value();
}

var ui_initialize = function () {
    console.log("onload: UIHelpers.ui_initialize");
    //   dbgPrintLmvVersion();                       
    var options = {};
    options.env = "AutodeskProduction";//_viewerEnv;  // AutodeskProduction, AutodeskStaging, or AutodeskDevelopment (set in global var in this project)
    options.getAccessToken = getAccessToken;
    options.refreshToken = getAccessToken.bind(options);
    Autodesk.Viewing.Initializer(options, function () { });
};


function resizeViews() {
    try {
        $$("rootctrl").resize();
        $$("ctrl_H1").resize();
        $$("ctrl_H2").resize();
        $$("ctrl_H3").resize();
        var eventArgs = new VoArgs(VoEventTypes.$resize, null, null, null);
        app_ui.propagateEvents(VoEventTypes.$resize, eventArgs);
    } catch (e) {
        console.log(e);
    }
}

// mv_tree

function mv_tree_mnu_click(id) {
    if (id === "view")
        return;
    var selectedItems = app_ui.mv_tree.getSelectedItem(true);
    if (!selectedItems || selectedItems.length < 1)
        return;

    if (id === "select") {
        var selections = new SelectSetData();
        var keys = ["acad", "tag"];
        mv_tree_getKeysForObjects(keys, selectedItems, selections);
        if (selections.hasSelections(keys)) {
            app_ui.propigateAction(app_ui.mv_tree, selections, 'selectFromSelections');
        }
    } else if (id === "hide") {
        var selections = new SelectSetData();
        var keys = ["acad", "tag"];
        mv_tree_getKeysForObjects(keys, selectedItems, selections);
        if (selections.hasSelections(keys)) {
            app_ui.propigateAction(app_ui.mv_tree, selections, 'hideFromSelections');
        }
    } else if (id === "iso") {
        var selections = new SelectSetData();
        var keys = ["acad", "tag"];
        mv_tree_getKeysForObjects(keys, selectedItems, selections);
        if (selections.hasSelections(keys)) {
            app_ui.propigateAction(app_ui.mv_tree, selections, 'isolateFromSelections');
        }
    } else if (id === "fit") {
        var selections = new SelectSetData();
        var keys = ["acad", "tag"];
        mv_tree_getKeysForObjects(keys, selectedItems, selections);
        if (selections.hasSelections(keys)) {
            app_ui.propigateAction(app_ui.mv_tree, selections, 'fitFromSelections');
        }
    } else if (id === "show") {
        var selections = new SelectSetData();
        app_ui.propigateAction(app_ui.mv_tree, selections, 'showAll');
    }
    else if (id === "col") {
        app_ui.mv_tree.closeAll();
    }
}

function mv_tree_getKeysForObjects(keys, selections, selectionList) {
    selections.forEach(function (selected) {
        keys.forEach(function (idName) {
            if (selected.hasOwnProperty(idName)) {
                var val = selected[idName];
                if (val) {
                    selectionList.add(idName, val);
                }
            }
        })
        if (selected.hasOwnProperty('cCopy') && selected.cCopy) {
            mv_tree_getKeysForObjects(keys, selected.cCopy, selectionList);
        }
    })
};

function mv_tree_context(id, e, node) {

    var selections = app_ui.mv_tree.getSelectedId(true);
    var hasSelection = false;
    if (id > 0) {


        selections.forEach(function (sid) {
            if (sid === id)
                hasSelection = true;
        })
        if (!hasSelection) {
            app_ui.mv_tree.select(id, true);
        }

        var mnu = $$('mv_tree_mnu');
        mnu.clearAll();
        var viewSubMenu = [{ value: "Select", id: "select" }, { value: "Isolate", id: "iso" }, { value: "Fit", id: "fit" }, { value: "Hide", id: "hide" }, { value: "Show All", id: "show" }];
        mnu.add({ value: "View", id: "view", submenu: viewSubMenu });
        mnu.add({ value: "Collapse All", id: "col" });
    };
}

function testProc(loto) {

    var data = [];
    var steps = {
        value: loto.title,
        data: loto,
        type: "proc",
        children: []
    };
    data.push(steps);
    loto.steps.forEach(function (stp) {
        var node = {
            value: stp.index + "- " + stp.value,
            tag: stp.tag,
            line: stp.line,
            equipment: stp.equipment,
            type: "step",
            children: []
        }
        steps.children.push(node);
        if (stp.hash) {
            var items = app_data.refs.getRefs("images", "loto", stp.hash);
            items.forEach(function (itm) {
                var node = { value: itm.title, type: "image", data: itm, children: [] };
                steps.children.push(node);
            });
        }
    });
    var other = {
        value: "Related Documents",

        type: "folder",
        children: []
    };
    data.push(other);
    $$('ctrl_H3_4').show();
    var tree = $$('loto_tree');
    tree.clearAll();
    tree.parse(data);

}

function buildProperty(id) {
    var prop =
    {
        id: id + "_layout", select: true, view: "layout", type: "clean",
        rows:
        [
            {
                view: "toolbar", height: 42,
                cols: [
                  { view: "button", value: "Link Image", width: 150, align: "left" },
                  { view: "button", value: "Link Document", width: 150, align: "left" },
                  { view: "button", value: "Save View", width: 150, align: "left" }]
            },
            {
                id: "ctrl_" + id, type: "clean", padding: "4", height: "100%",
                rows: [
                    {
                        id: id + "_L_Layout", type: "clean",
                        rows: [
                            {
                                id: id + "_prop_grid", view: "datatable", select: "row", multiselect: true, scrollY: true, AutoHeight: true, data: null,
                                columns: [{ id: "name", header: "Name", fillspace: 2 }, {
                                    id: "value", header: "Value", fillspace: 4
                                }]
                            }, {
                                id: id + "_splitter", view: "resizer"
                            }, {
                                id: id + "_prop_tree", view: "tree", select: "multiselect", onContext: {}
                            }

                        ]
                    }
                ]
            }
        ]
    };
    return prop;
}

function mv_prop_tree_context(id, e, node) {
    var mnu = $$('mv_prop_tree_mnu');
    mnu.clearAll();
    if (id > 0) {
        app_ui.prop_tree.select(id);
        var item = app_ui.prop_tree.getItem(id);


        if (item.type === "doc")
            mnu.add({ value: "Open Document", id: "open" });
        else if (item.type === "loto")
            mnu.add({ value: "Show Procedure", id: "loto" });
    }
}

function mv_prop_tree_mnu_click(id) {
    if (id === "loto") {
        var items = app_ui.prop_tree.getSelectedItem(true);
        var item = items[0];
        setLoto(item.data);
        $$('ctrl_H3_2').show();
    } else if (id === "open") {
        var items = app_ui.prop_tree.getSelectedItem(true);
        var item = items[0];
        var p = window.location.protocol;
        var h = window.location.host;
        var newurl = p + "//" + h + "/" + item.ref;
        window.open(newurl);

    }
}

function mv_tree_select(id) {
    if (id < 0)
        return;
    var obj = app_ui.mv_tree.getItem(id);
    if (obj) {
        var arr = obj.properties;
        if (arr) {
            app_ui.prop_grid.clearAll();
            app_ui.prop_grid.parse(arr);
        }
        mv_tree_getRefs(obj);
    }
}

function mv_tree_getRefs(obj) {
    app_ui.prop_tree.clearAll();
    var data = [];
    var docs = { value: "Documents", type: "folder", children: [] };
    var images = { value: "Images", type: "folder", children: [] };
    var loto = { value: "Energy Isolation", type: "folder", children: [] };
    var loto2 = { value: "Energy Isolation History", type: "folder", children: [] };
    var insp = { value: "Inspection Data", type: "folder", children: [] };
    data.push(docs);
    data.push(images);
    data.push(loto);
    data.push(loto2);
    data.push(insp);

    if (obj.hasOwnProperty("tag")) {
        var items = app_data.refs.getRefs("docs", "tag", obj.tag);
        items.forEach(function (itm) {
            var node = { value: itm.name, type: "doc", ref: itm.path, children: [] };
            docs.children.push(node);
        });
    }
    if (obj.hasOwnProperty("acad")) {
        var items = app_data.refs.getRefs("docs", "acad", obj.tag);
        items.forEach(function (item) {
            var node = { value: itm.name, type: "doc", ref: itm.path, children: [] };
            docs.children.push(node);
        });
    }
    if (obj.hasOwnProperty("line")) {
        var items = app_data.refs.getRefs("docs", "line", obj.tag);
        items.forEach(function (itm) {
            var node = { value: itm.name, type: "doc", ref: itm.path, children: [] };
            docs.children.push(node);
        });
    }
    if (obj.hasOwnProperty("tag")) {
        var items = app_data.refs.getRefs("loto", "tag", obj.tag);
        items.forEach(function (itm) {
            var node = { value: itm.title, type: "loto", data: itm, children: [] };
            loto.children.push(node);
        });
    }
    app_ui.prop_tree.parse(data);
    app_ui.prop_tree.openAll();
}


function mv_tree_dblClick(id, e, node) {
    var items = app_ui.mv_tree.getSelectedItem(true);

    var selections = new SelectSetData();
    var sender = app_ui.getSelectionTarget("mv_tree");
    if (!sender)
        return;
    var collection = app_up.getMasterData().getCollection('all');
    var p = getlinkedItems(items, collection, sender.key);

    p.then(function (data) {
        if (data && data.length > 0) {
            var eventArgs = new VoArgs(VoPropTypes.$select, sender, data, sender.key);
            app_ui.propigateEvents(eventArgs);
        }
    }).catch(function (e) {
        console.log(e);
    });
}



function getlinkedItems(sourceList, masterCollection, linkKey) {
    var p = new Promise(function (resolve, reject) {
        try {
            var linkedItems = [];
            sourceList.forEach(function (sourceItem) {
                if (sourceItem.hasOwnProperty(linkKey) && sourceItem[linkKey]) {
                    var criteria = {};
                    criteria[linkKey] = sourceItem[linkKey];
                    var results = masterCollection.find(criteria);
                    Array.prototype.push.apply(linkedItems, results);
                }
            });
            resolve(linkItems);
        } catch (e) { reject(e); }
    });
    return p;
}



function getlinkedItemsRecurse(sourceList, masterCollection, linkKey, childKey, promisesArray, linkedItemsArray) {
    var p = getlinkedItems(sourceList, masterCollection, linkKey);
    promisesArray.push(p);
    p.then(function (items) {
        Array.prototype.push.apply(linkedItemsArray, items);
        items.forEach(function (item) {
            if (item.hasOwnProperty(childKey)) {
                var children = item[childKey];

            }
        });
    }).catch(function (e) {
        console.log(e);
    });
    Promise.all(promisesArray).then(function () {

    });
}


// loto_grid

function lotoGridSelect(data, preserve) {
    if (app_ui.selection_block)
        return;
    var items = app_ui.loto_grid.getSelectedItem(true);
    var selections = new SelectSetData();
    var sender = app_ui.getSelectionTarget("loto_grid");

    items.forEach(function (itm) {
        if (itm.tag)
            selections.add('tag', itm.tag);
        if (itm.equipment)
            selections.add('tag', itm.equipment);
    });

    var it = items[0];
    if (selections.hasOwnProperty('tag') || selections.hasOwnProperty('acad'))
        app_ui.propigateSelections(app_ui.loto_grid, selections, "grid");

    var tree = [];
    var images = { value: "Images", children: [] };
    var views = { value: "Views", children: [] };
    var docs = { value: "Documents", children: [] };
    var hsit = { value: "History", children: [] };
    app_ui.loto_tree.clearAll();
    tree.push(images);
    tree.push(views);
    tree.push(docs);
    var doc = { value: "JSA Document", type: "doc", path: "docs/loto/p1003/SmapleJSA.docx", children: [] };
    docs.children.push(doc);
    tree.push(hsit);
    if (it.hash) {
        var items = app_data.refs.getRefs("images", "loto", it.hash);
        items.forEach(function (itm) {
            var node = { value: itm.name, type: "image", path: itm.path, children: [] };
            images.children.push(node);
        });
    }
    app_ui.loto_tree.parse(tree);
    app_ui.loto_tree.openAll();
}


function lotoGridChanged(newv, oldv) {
    var id = app_ui.lotoCbo.getValue();
    var option = app_ui.lotoCbo.getList().getItem(id);
    if ((!option) || !(option.steps))
        return;
    setLoto(option);


}


function setLoto(loto) {
    app_ui.loto - loto;
    var item = loto.steps;
    lotoGridReset(item);
    $$("loto_btn_record").enable();
    app_ui.loto_tree.clearAll();
}


function lotoGridReset(data) {
    app_ui.loto_grid.hideColumn("done");
    app_ui.loto_grid.clearAll();
    data.forEach(function (item) { app_ui.loto_grid.add(item); });
}


function ui_save_tolo() {

}


function ui_submit_tolo() {
    app_ui.lotoCbo.enable();
    app_ui.loto_grid.hideColumn("done");
    setLoto(app_ui.loto);
    $$("loto_btn_record").enable();
    $$("loto_btn_cancel").disable();
    $$("loto_btn_submmit").disable();
    $$("loto_btn_save").disable();
}

function ui_cancel_tolo() {
    app_ui.lotoCbo.enable();
    app_ui.loto_grid.hideColumn("done");
    setLoto(app_ui.loto);
    $$("loto_btn_record").enable();
    $$("loto_btn_cancel").disable();
    $$("loto_btn_submmit").disable();
    $$("loto_btn_save").disable();
}

function ui_record_tolo() {
    app_ui.lotoCbo.disable();
    $$("loto_btn_record").disable();
    $$("loto_btn_cancel").enable();
    $$("loto_btn_submmit").enable();
    $$("loto_btn_save").enable();

    var items = [];
    app_ui.loto_grid.editable = true;
    app_ui.loto_grid.data.each(function (obj) {
        var o = { hash: obj.hash, index: obj.index, value: obj.value, tag: obj.tag, line: obj.line, done: false };
        items.push(o);
    });
    if (items.length < 1)
        return;

    app_ui.loto_grid.clearAll();

    app_ui.loto_grid.showColumn("done");

    items.forEach(function (item) { app_ui.loto_grid.add(item); });

}

function mv_loto_tree_context(id, e, node) {
    var mnu = $$('mv_loto_tree_mnu');
    mnu.clearAll();
    if (id > 0) {
        app_ui.loto_tree.select(id);
        var item = app_ui.loto_tree.getItem(id);
        if (!item)
            return;

        if (item.type === "doc")
            mnu.add({ value: "Open Document", id: "open" });
        else if (item.type === "image")
            mnu.add({ value: "View Image", id: "view" });
    }
}

function mv_loto_tree_mnu_click(id) {
    if (id === "view") {
        var items = app_ui.loto_tree.getSelectedItem(true);
        var item = items[0];
        showImage(item.value, item.path);
    } else if (id === "open") {
        var items = app_ui.loto_tree.getSelectedItem(true);
        var item = items[0];
        var p = window.location.protocol;
        var h = window.location.host;
        var newurl = p + "//" + h + "/" + item.path;
        window.open(newurl);

    }
}

function ui_print_tolo() {
    var p = window.location.protocol;
    var h = window.location.host;
    var newurl = p + "//" + h + "/LotoPrint.html";
    window.open(newurl);
}

function showImage(title, path) {
    webix.ui({
        view: "window",
        id: "win3",
        height: 500,
        width: 600,
        left: 450, top: 50,
        move: true,
        resize: true,
        head: {
            view: "toolbar", cols: [
                { view: "label", label: title },
                { view: "button", label: 'Close', width: 100, align: 'right', click: "$$('win3').close();" }
            ]
        }
    ,
        body: {
            template: '<img src="' + path + '" alt="Mountain View"">'
        }
    }).show();
}

// iso_grid

function isoGridSelect(data, preserve) {
    if (app_ui.selection_block)
        return;
    var items = app_ui.iso_grid.getSelectedItem(true);
    var selections = new SelectSetData();
    var sender = app_ui.getSelectionTarget("iso_grid");

    items.forEach(function (itm) {
        if (itm.Handle) {
            selections.add('acad', itm.Handle);
        }
        if (itm.Tag) {
            selections.add('tag', itm.Tag);
        }
    });
    if (selections.hasOwnProperty('tag') || selections.hasOwnProperty('acad') || selections.hasOwnProperty('line'))
        app_ui.propigateSelections(app_ui.iso_grid, selections, "grid");
}


// views


function mv_build_load_menu() {

    var localData = function () {
        result = [];
        app_ui.dataList().data.forEach(function (item) {
            result.push({ value: item.value, id: "ldi" + item.id });
        });
        return result;
    };

    var localModels = function () {
        result = [];
        app_ui.modelList().data.forEach(function (item) {
            result.push({ value: item.value, id: "lmi" + item.id });
        });
        return result;
    };

    var onlineModels = function () {
        result = [];
        app_ui.serverModels.forEach(function (item) {
            result.push({ value: item.value, id: "smi" + item.id });
        });
        return result;
    };

    var mnu = $$('ctrl_H1_header_views_mnu');
    mnu.clearAll();
    var s1 = localData();
    mnu.add({ value: "Local", id: "local", submenu: [{ value: "Data", id: "data", submenu: s1 }, { value: "Models", id: "model", submenu: localModels() }] });
    mnu.add({ value: "Online", id: "online", submenu: [{ value: "Models", id: "model", submenu: onlineModels() }] });
}

function viewsMenuClick(id) {
    if (id.indexOf('ldi') > -1) {
        var nm = id.replace('ldi', '');
        app_ui.loadDbFromStorage(nm).then(function (db) {
            app_ui.setMasterData(db);
        });
    }
    else if (id.indexOf('lmi') > -1) {
        var nm = id.replace('lmi', '');
        app_ui.loadDbFromStorage(nm).then(function (newDb) {

        });
    }
    else if (id.indexOf('smi') > -1) {
        var nm = id.replace('smi', '');
        viewsLoadModel(nm);
    }
}

function viewsLoadModel(id, onPropDone) {
    if (id.length < 10)
        return;

    var target = null;
    app_ui.serverModels.forEach(function (itm) {
        if (itm.id === id) target = itm;
    })
    if (!target)
        return;

    var newView = new UiViewer("ctrl_H2_0", target);

    newView.addOnDocLoaded(function (event, args) {
        args.sender.loadView(args.sender.views[target.defaultIndex]);
    })
    if (onPropDone) {
        newView.addOnPropertiesPrepared(onPropDone);
    } else {
        // refresh size
        newView.addOnPropertiesPrepared(function (sender, event, data) { window.setTimeout(resizeViews, 700) });
    }

    newView.addOnViewLoaded(function (event, args) {
        args.sender.getModelProperties(args.sender);
    });
    newView.addOnSelectionChanged(function (event, args) {
        viewSelectionChanged(newView);
    });
    newView.initializeView();
    newView.subscribeEvents(app_ui);

};


function viewSelectionChanged(newView) {

    var selectSet = newView.viewer.getSelection();
    if (!selectSet || selectSet.length < 1)
        return;

    var p = newView.getItemsByKeys.call(newView, selectSet).then(function (data) {
        if (data && data.length > 0) {
            var eventArgs = new VoArgs(VoPropTypes.$select, newView, data, newView.key);
            app_ui.propagateEvents(VoEventTypes.$propagation, eventArgs);
        }
    }).catch(function (e) {
        console.log(e);
    });
    //if (app_ui.selection_block)
    //    return;
    //var selectSet = newView.viewer.getSelection();
    //if (!selectSet || selectSet.length < 1)
    //    return;
    //var selections = [];
    //selectSet.forEach(function (id) {
    //    var criteria = {};
    //    criteria[newView.data.key] = id;
    //    var query = newView.data.all.find(criteria);
    //    if (query.length > 0) {
    //        query.forEach(function (item) {
    //            selections.push(item);
    //        });
    //    }
    //});
    //var d = selections;
    //var selections = new SelectSetData();
    //if (newView.is2D()) {
    //    selectSet.forEach((itm) => {
    //        var obj = newView.getFromDictionary(newView.idDictionary, itm)

    //        if (obj && obj.tag)
    //            selections.add('tag', obj.tag);
    //        if (obj && obj.line)
    //            selections.add('line', obj.line);
    //    })
    //}
    //else {
    //    selectSet.forEach((itm) => {
    //        var obj = newView.getFromDictionary(newView.idDictionary, itm)
    //        if (obj && obj.acad)
    //            selections.add('acead', obj.acad);               
    //        if (obj && obj.tag)
    //            selections.add('tag', obj.tag);
    //        if (obj && obj.line)
    //            selections.add('line', obj.line);
    //    })
    //}

    //var type = newView.is2D() ? "view2D" : "view3D";
    //app_ui.propigateSelections(newView, selections);
}

// main tree header 

function ctrl_H1_header_group_mnu_click(groupingId) {

    app_ui.mv_tree.clearAll();
    var grouped = [];
    var collection = app_ui.getMasterData().getCollection("all");
    if (!collection || collection === null)
        return;
    if (groupingId === 'loop') {

        grouped = app_ui.categorizeLData(collection.data, ["layer"], function (o) {
            // var ok = (!!o.tag || !!o.line)
            var ok = true;//(!!o.tag)
            return !ok;
        });
    } else if (groupingId === 'line') {
        grouped = app_ui.categorizeLData(collection.data, ["line"], function (o) {
            // var ok = (!!o.tag || !!o.line)
            var ok = (!!o.line);
            return !ok;
        });
    } else if (groupingId === 'class') {
        grouped = app_ui.categorizeLData(collection.data, ["clss"], function (o) {
            // var ok = (!!o.tag || !!o.line)
            var ok = true;//(!!o.line)
            return !ok;
        });
    } else if (groupingId === 'tag') {
        grouped = app_ui.categorizeLData(collection.data, [], function (o) {
            // var ok = (!!o.tag || !!o.line)
            var ok = true;//(!!o.line)
            return !ok;
        });
    } else {
        //debugger;
        grouped = app_ui.categorizeLData(collection.data, ["layer"], function (o) {
            // var ok = (!!o.tag || !!o.line)
            var ok = (!!o.tag);
            return !ok;
        });
    }

    app_ui.mv_tree.parse(grouped);
    app_ui.mv_tree.sort("value", "asc");

}


// iso menu

function isoMenuClick(id) {
    if (id === "reset") {
        app_ui.iso_grid.clearAll();
        var data = inspectData();
        app_ui.iso_grid.parse(data);
    } else if (id === "status") {
        app_ui.iso_grid.clearAll();
        var data = inspectData();
        var rids = [];
        var gids = [];
        var yids = [];
        data.forEach(function (itm) {
            var per = (itm.LastMeasured - itm.MinThick) / itm.MinThick
            if (per < 0.10) {
                rids.push(itm.Handle);

            } else if (per < 0.3) {
                yids.push(itm.Handle);
            } else {
                gids.push(itm.Handle);
            }

        });
        app_ui.propigateHighlights([{ ids: rids, color: app_colors.red }, { ids: yids, color: app_colors.orange }, { ids: gids, color: app_colors.green }], "acadDictionary");
        app_ui.iso_grid.parse(data);
    } else if (id === "failed") {
        app_ui.iso_grid.clearAll();
        var data = inspectData();
        var newData = [];
        var ids = [];
        data.forEach(function (itm) {
            if (itm.BelowThreshold) {
                newData.push(itm);
                ids.push(itm.Handle);
            }
        });
        app_ui.iso_grid.parse(newData);
        app_ui.propigateHighlights([{ ids: ids, color: app_colors.red }], "acadDictionary");
    }
}