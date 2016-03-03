namespace VoBaseServices.Models
{
    public class Token
    {
        #region Properties

        public string access_token { get; set; } = "";
        public long expires_in { get; set; } = 0;
        public string reason { get; set; } = "";
        public bool success { get; set; }
        public string token_type { get; set; } = "";

        #endregion Properties
    }
}