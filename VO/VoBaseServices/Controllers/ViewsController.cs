using Microsoft.AspNet.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860
using VoBaseServices.Models;
using VoBaseServices.Utils;

namespace VoBaseServices.Controllers
{
    public class ViewsController : Controller
    {
        #region Methods

        public class Dataontroller : Controller
        {
            #region Methods

            [Route("vo")]
            public FacilityData GetFacilityData()
            {
                var request = FacilityData.test();
                return request;
            }

            #endregion Methods
        }

        #endregion Methods
    }
}