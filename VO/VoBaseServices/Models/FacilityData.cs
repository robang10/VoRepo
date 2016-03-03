using System.Collections.Generic;

namespace VoBaseServices.Models
{
    public class FacilityData
    {
        #region Constructors

        public FacilityData(string name)
        {
            views = new List<FailityView>();
            this.name = name;
        }

        #endregion Constructors

        #region Properties

        public string name { get; set; }
        public List<FailityView> views { get; set; }

        #endregion Properties

        #region Methods

        public static FacilityData test()
        {
            var result = new FacilityData("Test Facility");
            result.views.Add(new FailityView()
            {
                viewName = "Plant Model",
                viewId = "PM1",
                id = @"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnBfdGVzdF9idWNrZXRfYS9QM0QtZGVtbzEtdjIubndk",
                value = "Plant 3D Model",
                defaultIndex = 0
            });
            result.views.Add(new FailityView()
            {
                viewName = "P&ID A1-1001",
                viewId = "ID1001",
                id = @"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnBfdGVzdF9idWNrZXRfZi8xLUExLTEwMDEtdjJiLmR3Zng=",
                value = "P&ID 1",
                defaultIndex = 0,
                twoD = true
            });
            result.views.Add(new FailityView()
            {
                viewName = "P&ID A1-1002",
                viewId = "ID1002",
                id = @"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnBfdGVzdF9idWNrZXRfYi8xLUExLTEwMDIuZHdn",
                value = "P&ID 2",
                defaultIndex = 0,
                twoD = true
            });
            return result;
        }

        #endregion Methods
    }

    public class FailityView
    {
        #region Properties

        public int defaultIndex { get; set; }
        public string id { get; set; }
        public bool twoD { get; set; }
        public string value { get; set; }
        public string viewId { get; set; }
        public string viewName { get; set; }

        #endregion Properties
    }

    public class TestData
    {
        #region Fields

        public List<ViewConfiguration> views = new List<ViewConfiguration>();

        #endregion Fields

        #region Constructors

        public TestData()
        {
            views.Add(MakeView1());
            views.Add(MakeView2());
            views.Add(MakeView3());
            views.Add(MakeView4());
            views.Add(MakeView5());
        }

        #endregion Constructors

        #region Methods

        public static ViewConfiguration MakeView1()
        {
            var result = new ViewConfiguration()
            {
                value = "Plant Model",
                id = @"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnBfdGVzdF9idWNrZXRfYS9QM0QtZGVtbzEtdjIubndk",
                key = "dbId",
                selectby = "tag",
                highlightby = "tag"
            };
            result.properties.Add(new ViewProperty()
            {
                name = "Class",
                alias = "class",
                diplayText = "Equipment Class"
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Tag",
                indexed = true,
                alias = "tag",
                diplayText = "Equipment Tag"
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Layer",
                alias = "layer",
                diplayText = "Model Layer"
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Line Number",
                alias = "lineno",
                calculationString = "function (prop, nn) { var t = prop.displayValue.split('-'); if (t.length > 0) { nn.line = t[t.length - 1]; nn.properties.push({name:'line', value: nn.line});} }"
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Value",
                displayCategory = "Entity Handle",
                indexed = true,
                alias = "acad",
                diplayText = "Model Id"
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Line",
                indexed = true,
                alias = "line",
                diplayText = "Line Number"
            });
            result.properties.Add(new ViewProperty()
            {
                displayCategory = "AutoCad",
            });
            return result;
        }

        public static ViewConfiguration MakeView2()
        {
            var result = new ViewConfiguration()
            {
                value = "P&ID 1",
                id = @"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnBfdGVzdF9idWNrZXRfZi8xLUExLTEwMDEtdjJiLmR3Zng=",
                key = "dbId",
                is2d = true,
                defaultIndex = 0,
                selectby = "tag",
                highlightby = "tag"
            };
            result.properties.Add(new ViewProperty()
            {
                name = "Tag",
                indexed = true,
                alias = "tag",
                diplayText = "Equipment Tag",
                calculationString = "function (prop, nn) { var t = prop.displayValue.split('-'); if (t.length > 0) { nn.line = t[t.length - 1]; nn.properties.push({name:'line', value: nn.line});} }"
            });
            result.properties.Add(new ViewProperty()
            {
                name = "To",
                indexed = true,
                diplayText = "Source Connection",
                alias = "to",
            });
            result.properties.Add(new ViewProperty()
            {
                name = "From",
                indexed = true,
                diplayText = "Destination Connection",
                alias = "from",
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Line",
                indexed = true,
                diplayText = "Line Number",
                alias = "line",
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Area",
                indexed = true,
                diplayText = "Area",
                alias = "area",
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Description",
                alias = "desc",
            });
            return result;
        }

        public static ViewConfiguration MakeView3()
        {
            var result = new ViewConfiguration()
            {
                value = "P&ID 2",
                id = @"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnBfdGVzdF9idWNrZXRfYi8xLUExLTEwMDIuZHdn",
                key = "dbId",
                is2d = true,
                defaultIndex = 1,
                selectby = "tag",
                highlightby = "tag"
            };
            result.properties.Add(new ViewProperty()
            {
                name = "Tag",
                indexed = true,
                alias = "tag",
                diplayText = "Equipment Tag",
                calculationString = "function (prop, nn) { var t = prop.displayValue.split('-'); if (t.length > 0) { nn.line = t[t.length - 1]; nn.properties.push({name:'line', value: nn.line});} }"
            });
            result.properties.Add(new ViewProperty()
            {
                name = "To",
                indexed = true,
                diplayText = "Source Connection",
                alias = "to",
            });
            result.properties.Add(new ViewProperty()
            {
                name = "From",
                indexed = true,
                diplayText = "Destination Connection",
                alias = "from",
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Line",
                indexed = true,
                diplayText = "Line Number",
                alias = "line",
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Area",
                indexed = true,
                diplayText = "Area",
                alias = "area",
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Description",
                alias = "desc",
            });
            return result;
        }

        public static ViewConfiguration MakeView4()
        {
            var result = new ViewConfiguration()
            {
                value = "Plant Model 2",
                id = @"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnBfdGVzdF9idWNrZXRfZy8xLVBFLTAwMS5kd2c=",
                key = "dbId",
                selectby = "tag",
                highlightby = "tag"
            };
            result.properties.Add(new ViewProperty()
            {
                name = "Class",
                alias = "class",
                diplayText = "Equipment Class"
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Tag",
                indexed = true,
                alias = "tag",
                diplayText = "Equipment Tag"
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Layer",
                alias = "layer",
                diplayText = "Model Layer"
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Line Number",
                alias = "lineno",
                calculationString = "function (prop, nn) { var t = prop.displayValue.split('-'); if (t.length > 0) { nn.line = t[t.length - 1]; nn.properties.push({name:'line', value: nn.line});} }"
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Value",
                displayCategory = "Entity Handle",
                indexed = true,
                alias = "acad",
                diplayText = "Model Id"
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Line",
                indexed = true,
                alias = "line",
                diplayText = "Line Number"
            });
            result.properties.Add(new ViewProperty()
            {
                displayCategory = "AutoCad",
            });
            return result;
        }

        public static ViewConfiguration MakeView5()
        {
            var result = new ViewConfiguration()
            {
                value = "P&ID 3",
                id = @"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnBfdGVzdF9idWNrZXRfZy8xLUExLTEwMDEuZHdn",
                key = "dbId",
                is2d = true,
                defaultIndex = 1,
                selectby = "tag",
                highlightby = "tag"
            };
            result.properties.Add(new ViewProperty()
            {
                name = "Tag",
                indexed = true,
                alias = "tag",
                diplayText = "Equipment Tag",
                calculationString = "function (prop, nn) { var t = prop.displayValue.split('-'); if (t.length > 0) { nn.line = t[t.length - 1]; nn.properties.push({name:'line', value: nn.line});} }"
            });
            result.properties.Add(new ViewProperty()
            {
                name = "To",
                indexed = true,
                diplayText = "Source Connection",
                alias = "to",
            });
            result.properties.Add(new ViewProperty()
            {
                name = "From",
                indexed = true,
                diplayText = "Destination Connection",
                alias = "from",
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Line",
                indexed = true,
                diplayText = "Line Number",
                alias = "line",
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Area",
                indexed = true,
                diplayText = "Area",
                alias = "area",
            });
            result.properties.Add(new ViewProperty()
            {
                name = "Description",
                alias = "desc",
            });
            return result;
        }

        #endregion Methods
    }

    public class ViewConfiguration
    {
        #region Fields

        public int defaultIndex = 0;
        public string highlightby = "";
        public bool is2d = false;
        public string key = "dbId";
        public List<ViewProperty> properties = new List<ViewProperty>();
        public string selectby = "";

        #endregion Fields

        #region Properties

        public string id { get; set; }
        public string value { get; set; }

        #endregion Properties
    }

    public class ViewProperty
    {
        #region Fields

        public string diplayText = "";

        #endregion Fields

        #region Properties

        public string alias { get; set; } = "";
        public string calculationString { get; set; } = null;
        public string displayCategory { get; set; } = null;
        public bool indexed { get; set; } = false;
        public string name { get; set; } = "";

        #endregion Properties
    }
}