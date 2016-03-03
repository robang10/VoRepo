using Microsoft.AspNet.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860
using VoBaseServices.Models;
using VoBaseServices.Utils;

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

        #endregion Methods
    }
}