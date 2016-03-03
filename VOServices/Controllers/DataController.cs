using Microsoft.AspNet.Mvc;
using VoServices.Models;

namespace VoBaseServices.Controllers
{
    public class Dataontroller : Controller
    {
        #region Methods

        [Route("api/v2/facility")]
        public FacilityData GetFacilityData()
        {
            var request = FacilityData.test();
            return request;
        }

        [Route("api/v2/Views")]
        public TestData GetRegisteredViews()
        {
            var request = new TestData();
            return request;
        }

        #endregion Methods
    }
}