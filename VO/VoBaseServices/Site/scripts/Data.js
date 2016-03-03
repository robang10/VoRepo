
// seems to be needed by Autodesk's viewer3D.js
function isTouchDevice() { return false; }
var app_ui = new UiGraph();
var app_colors = new OverlayColors();
var app_data = null;

function model_set() {
    return [
        new ThreeDItem("P3D-demo1-v2", "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnBfdGVzdF9idWNrZXRfYS9QM0QtZGVtbzEtdjIubndk",
            [new TwoDItem("1-A1-1001.dwf (P&ID)", "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnBfdGVzdF9idWNrZXRfYy8xLUExLTEwMDEuZHdm", "1-A1-1001.dwf"),
             new TwoDItem("1-A1-1002.dwf (P&ID)", "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnBfdGVzdF9idWNrZXRfYy8xLUExLTEwMDIuZHdm", "1-A1-1002.dwf"),
             new TwoDItem("1-A1-1001.dwg (P&ID)", "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnBfdGVzdF9idWNrZXRfYi8xLUExLTEwMDEuZHdn", "1-A1-1001.dwg"),
             new TwoDItem("1-A1-1002.dwg (P&ID)", "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnBfdGVzdF9idWNrZXRfYi8xLUExLTEwMDIuZHdn", "1-A1-1002.dwg"),
             new TwoDItem("1-A1-1001.dwfx (P&ID)", "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnBfdGVzdF9idWNrZXRfYy8xLUExLTEwMDEuZHdmeA==", "1-A1-1001.dwfx"),
             new TwoDItem("1-A1-1002.dwfx (P&ID)", "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnBfdGVzdF9idWNrZXRfYy8xLUExLTEwMDIuZHdmeA==", "1-A1-1002.dwfx"),
            ], "P3D-demo1-v2")
    ];
}


function getFacilityData(){
   //var p =  $.ajax({
   //     type: "GET",
   //     url: "api/v2/views",
   //     contentType: "application/json; charset=utf-8",
   //     dataType: "json",
   //     data: "{}",
   //     success: function (res) {
   //         func(res);
   //     }
   //});
   var p = $.ajax({
       type: "GET",
       url: "api/v2/views",
       contentType: "application/json; charset=utf-8",
       dataType: "json",
       data: "{}"
   });
   return p;
}

function getRelatedData()
{
    var res = new AppRefs();
    res.addRef("docs", "tag", "P-1003", new RefEntry("Product Data", "docs/tag/p1003/prodata.pdf"));
    res.addRef("docs", "tag", "P-1003", new RefEntry("Operations and Mainenance Manual", "docs/tag/p1003/nmriom.pdf"));
    res.addRef("docs", "tag", "P-1003", new RefEntry("Coupling Data", "docs/tag/p1003/metastream.pdf"));
    res.addRef("images", "loto", "stA", new RefEntry("Control Panel", "images/loto/stA/ControlPanel.jpg"));
    res.addRef("images", "loto", "stB", new RefEntry("Circuit Breaker", "images/loto/stB/Circuitbreaker2.jpg"));
    res.addRef("images", "loto", "stC", new RefEntry("HA-103", "images/loto/stC/step3.png"));
    res.addRef("images", "loto", "stD", new RefEntry("HA-114", "images/loto/stD/step4.png"));
    res.addRef("docs", "loto", "P-1003", new RefEntry("JSA Document", "docs/loto/p1003/SmapleJSA.pdf"));
    res.addRef("loto", "tag", "P-1003", loto2_set());
    return res;
}


function loto_set() {
    var result = [];
    var p1 = new LotoProcedure(1, "Energy Isolation Procedure for P-1003");
    p1.addStep(new LotoStep( 1, "Shut off Pump P-1003 at control panel", "", "", "P-1003"));
    p1.addStep(new LotoStep( 2, "Close Circuit Breaker for Pump P-1003", "", "", "P-1003"));
    p1.addStep(new LotoStep( 3, "Close Valve HA-103 on suction side of Pump P-1003 in Line Number 4”-CS300-P-1038", "HA-103", "1038", "P-1003"));
    p1.addStep(new LotoStep( 4, "Close Valve HA-114 on discharge side of Pump P-1003 in Line Number 3”-CS300-P-1043", "HA-114", "1043", "P-1003"));
    result.push(p1)

    return result;
}

function loto2_list(){
    var result = [loto2_set()];
    return result;
}

function loto2_set() {
    var result = [];
    var p1 = new LotoProcedure2("P-1003", 1, "Energy Isolation Procedure for P-1003");
    var s1 = new LotoStep2("stA", 1, "Shut off Pump P-1003 at control panel", "", "", "P-1003");
    p1.addStep(s1);
    var s2 = new LotoStep2("stB", 2, "Close Circuit Breaker for Pump P-1003", "", "", "P-1003");
    p1.addStep(s2);
    var s3 = new LotoStep2("stC", 3, "Close Valve HA-103 on suction side of Pump P-1003 in Line Number 4”-CS300-P-1038", "HA-103", "1038", "P-1003");
    p1.addStep(s3);
    var s4 = new LotoStep2("stD", 4, "Close Valve HA-114 on discharge side of Pump P-1003 in Line Number 3”-CS300-P-1043", "HA-114", "1043", "P-1003");
    p1.addStep(s4);
    result.push(p1)
    return p1;
}
