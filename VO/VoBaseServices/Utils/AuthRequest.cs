using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using VoBaseServices.Models;

namespace VoBaseServices.Utils
{
    public class AuthRequest
    {
        #region Fields

        public readonly HttpClient Client = new HttpClient();
        public string _token = "";
        private Uri _baseAddress = new Uri("https://developer.api.autodesk.com");
        private string authEndpoint = "authentication/v1/authenticate";
        private DateTime ExpiresIn = DateTime.MinValue;
        private string key = "PLgBUpJwkkUudihp86FO2ps2vL8GQeCA";
        private string secret = "yaxjsevJqmJTJdm8";

        #endregion Fields

        #region Properties

        public Uri BaseAddress { get { return _baseAddress; } private set { _baseAddress = value; } }
        public bool IsAuthenticated { get { return !(string.IsNullOrEmpty(_token)) && ExpiresIn > DateTime.Now; } }
        public string Token { get { return _token; } private set { _token = value; } }

        #endregion Properties

        #region Methods

        public Token Authenticate(bool force = false)
        {
            if (!RefreshToken(force))
                return new Token()
                {
                    access_token = _token,
                    success = true,
                    expires_in = (ExpiresIn - DateTime.Now).Seconds,
                    token_type = "Bearer"
                };
            try
            {
                var ub = new UriBuilder(BaseAddress) { Path = authEndpoint };
                var request = new HttpRequestMessage(HttpMethod.Post, ub.Uri);
                request.Headers.Accept.ParseAdd(Util.XML_FORM);
                var keyValues = new List<KeyValuePair<string, string>>();
                keyValues.Add(new KeyValuePair<string, string>("client_id", key));
                keyValues.Add(new KeyValuePair<string, string>("client_secret", secret));
                keyValues.Add(new KeyValuePair<string, string>("grant_type", "client_credentials"));

                request.Content = new FormUrlEncodedContent(keyValues);

                HttpResponseMessage result = null;
                result = Client.SendAsync(request).Result;
                if (result.IsSuccessStatusCode)
                {
                    var errs = new StringBuilder();
                    string responseString = BPTestProject.http.RequestBase.GetResponseString(result, errs);

                    if (errs.Length > 0)
                        throw new Exception("Error parsing authencation object" + errs.ToString());
                    dynamic responseObject = BPTestProject.http.RequestBase.DeserializeJson(responseString, errs);
                    if (errs.Length > 0)
                        throw new Exception("Error Deserializing Object" + errs.ToString());

                    _token = responseObject.access_token;
                    long time = responseObject.expires_in;
                    ExpiresIn = DateTime.Now.AddSeconds(time);
                    return new Token()
                    {
                        access_token = _token,
                        success = true,
                        expires_in = time - 1,
                        token_type = "Bearer"
                    };
                }
            }
            catch (Exception ex)
            {
                ExpiresIn = DateTime.MinValue;
                _token = "";
                return new Token()
                {
                    access_token = _token,
                    success = true,
                    expires_in = 0,
                    token_type = "",
                    reason = ex.Message
                };
            }

            return new Models.Token();
        }

        public bool RefreshToken(bool force)
        {
            return (ExpiresIn - DateTime.Now).Seconds < 35 || force;
        }

        #endregion Methods
    }
}