using Microsoft.AspNet.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860
using VoBaseServices.Models;
using VoBaseServices.Utils;

namespace VoBaseServices.Controllers
{
    public class AuthController : Controller
    {
        #region Methods

        [Route("api/v2/auth/token")]
        public Token GetToken()
        {
            var request = new AuthRequest();
            var token = request.Authenticate(true);
            return token;
        }

        [Route("api/v2/auth/token/id")]
        public string GetTokenID()
        {
            var request = GetToken();
            return request.access_token;
        }

        #endregion Methods
    }
}