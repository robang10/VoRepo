using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Xml.Linq;

namespace VoServices.Services.Util
{
    public abstract class RequestBase
    {
        #region Fields

        public readonly List<string> QueryParameters = new List<string>();
        public readonly DateTime Stamp = DateTime.Now;

        #endregion Fields

        #region Constructors

        public RequestBase(string urlRelativepath, HttpMethod method, string contentType = Util.JSON_CONTENT_TYPE, string acceptType = Util.JSON_CONTENT_TYPE)
        {
            RequestMethod = method;
            AcceptType = acceptType;
            ContentType = contentType;
            UrlRelativepath = urlRelativepath;
            DTag = new ExpandoObject();
            ErrorMessages = new StringBuilder();
            Timeout = 0;
            RetryCount = 3;
        }

        #endregion Constructors

        #region Properties

        protected int retrys = 0;
        public string AcceptType { get; set; }

        public string ContentType { get; set; }

        public dynamic DTag { get; private set; }

        public StringBuilder ErrorMessages { get; protected set; }

        public Exception ExecutionException { get; set; }

        public abstract bool HasInputPayload { get; }

        public bool IsSuccess { get { return Message != null && Message.IsSuccessStatusCode && ExecutionException == null; } }

        public HttpResponseMessage Message { get; set; }

        public double MilliSecondsSinceStamp { get { return (DateTime.Now - Stamp).TotalMilliseconds; } }

        public HttpRequestMessage Request { get; protected set; }

        public HttpMethod RequestMethod { get; set; }
        public string RequestPayload { get; protected set; }
        public string ResponsePayload { get; protected set; }

        public int RetryCount { get; set; }
        public object Tag { get; set; }

        public int Timeout { get; set; }

        public string UrlRelativepath { get; set; }

        #endregion Properties

        #region Methods

        // Dynamic data cleard and added to each execution request;
        public Uri FullUri(Uri baseUri)
        {
            var ub = new UriBuilder(baseUri) { Path = UrlRelativepath };
            if (QueryParameters.Count > 0)
            {
                foreach (var queryItem in QueryParameters)
                {
                    if (ub.Query != null && ub.Query.Length > 1)
                        ub.Query = ub.Query.Substring(1) + "&" + queryItem;
                    else
                        ub.Query = queryItem;
                }
            }
            return ub.Uri;
        }

        #endregion Methods

        #region Classes

        public class HttpArgExecutionException : Exception
        {
            #region Constructors

            public HttpArgExecutionException(string message)
                : base(message)
            { }

            #endregion Constructors
        }

        #endregion Classes

        public static ExpandoObject DeserializeJson(string json, StringBuilder errs)
        {
            try
            {
                var converter = new Newtonsoft.Json.Converters.ExpandoObjectConverter();
                ExpandoObject obj = JsonConvert.DeserializeObject<ExpandoObject>(json, converter);
                return obj;
            }
            catch (Exception e)
            {
                errs.AppendLine(e.Message);
                return null;
            }
        }

        static public string EncodeTo64(string toEncode)

        {
            byte[] toEncodeAsBytes = System.Text.ASCIIEncoding.ASCII.GetBytes(toEncode);

            string returnValue = System.Convert.ToBase64String(toEncodeAsBytes);

            return returnValue;
        }

        public static string GetJson(ExpandoObject obj, StringBuilder errs)
        {
            try
            {
                var converter = new Newtonsoft.Json.Converters.ExpandoObjectConverter();
                string json = JsonConvert.SerializeObject(obj, converter);
                return json;
            }
            catch (Exception e)
            {
                errs.AppendLine(e.Message);
                return "";
            }
        }

        public static string GetResponseString(HttpResponseMessage result, StringBuilder errs)
        {
            try
            {
                using (StreamReader streamReader = new StreamReader(result.Content.ReadAsStreamAsync().Result))
                {
                    return streamReader.ReadToEnd();
                }
            }
            catch (Exception e)
            {
                errs.AppendLine(e.Message);
                return "";
            }
        }

        public static string JsonSerialize(object o, StringBuilder errs)
        {
            try
            {
                string json = JsonConvert.SerializeObject(o);
                return json;
            }
            catch (Exception e)
            {
                errs.AppendLine(e.Message);
                return "";
            }
        }

        protected static HttpContent BuildHttpContent(string json)
        {
            byte[] byteArray = Encoding.UTF8.GetBytes(json);
            var retval = new ByteArrayContent(byteArray);
            return retval;
        }

        //protected static dynamic DeserializeXml(string xml, XElement node)
        //{
        //    // If a file is not empty then load the xml and overwrite node with the
        //    // root element of the loaded document
        //    node = (node == null) ? XDocument.Parse(xml).Root : node;

        //    IDictionary<String, dynamic> result = new ExpandoObject();

        //    // implement fix as suggested by [ndinges]
        //    // var pluralizationService =
        //    //      PluralizationService.CreateService(CultureInfo.CreateSpecificCulture("en-us"));

        //    // use parallel as we dont really care of the order of our properties
        //    node.Elements().AsParallel().ForAll(gn =>
        //    {
        //        // Determine if node is a collection container
        //        var isCollection = gn.HasElements &&
        //        (
        //            // if multiple child elements and all the node names are the same
        //            gn.Elements().Count() > 1 &&
        //            gn.Elements().All(
        //               e => e.Name.LocalName.ToLower() == gn.Elements().First().Name.LocalName) //||

        //        //// if there's only one child element then determine using the PluralizationService if
        //        //// the pluralization of the child elements name matches the parent node.
        //        //gn.Name.LocalName.ToLower() == pluralizationService.Pluralize(
        //        //    gn.Elements().First().Name.LocalName).ToLower()
        //        );

        //        // If the current node is a container node then we want to skip adding
        //        // the container node itself, but instead we load the children elements
        //        // of the current node. If the current node has child elements then load
        //        // those child elements recursively
        //        var items = isCollection ? gn.Elements().ToList() : new List<XElement>() { gn };

        //        var values = new List<dynamic>();

        //        // use parallel as we dont really care of the order of our properties
        //        // and it will help processing larger XMLs
        //        foreach (XElement item in items)
        //        {
        //            values.Add(item.HasElements ? DeserializeXml(null, item) : item.Value.Trim());
        //        }

        //        // Add the object name + value or value collection to the dictionary
        //        result[gn.Name.LocalName] = isCollection ? values : values.FirstOrDefault();
        //    });
        //    return result;
        //}

        protected static string JsonSerializeToString(object o)
        {
            return JsonConvert.SerializeObject(o);
        }

        //protected static string XmlSerialize(object o, StringBuilder errs)
        //{
        //    try
        //    {
        //        System.Xml.Serialization.XmlSerializer s = new System.Xml.Serialization.XmlSerializer(o.GetType());

        //        var sb = new StringBuilder();

        //        using (TextWriter writer = new StringWriter(sb))
        //        {
        //            s.Serialize(writer, o);
        //        }

        //        return sb.ToString();
        //    }
        //    catch (Exception e)
        //    {
        //        errs.AppendLine(e.Message);
        //        return "";
        //    }
        //}

        protected HttpRequestMessage BuildRequest(Uri uri, string json, StringBuilder errs)
        {
            try
            {
                var request = new HttpRequestMessage(RequestMethod, uri);
                if (!string.IsNullOrEmpty(RequestPayload))
                {
                    request.Content = BuildHttpContent(RequestPayload);
                    request.Headers.Accept.ParseAdd(AcceptType);
                    request.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(ContentType);
                }

                if (AcceptType != Util.JSON_CONTENT_TYPE)
                    request.Headers.Accept.ParseAdd(AcceptType);
                return request;
            }
            catch (Exception e)
            {
                errs.AppendLine(e.Message);
                return null;
            }
        }

        protected void CanProceed()
        {
            if (ErrorMessages.Length > 0)
                throw new HttpArgExecutionException(ErrorMessages.ToString());
        }

        protected virtual void CustomRequestOperation(HttpRequestMessage request)
        {
        }
    }

    /// <summary>
    /// Used in generics to indicate that the data is "empty"
    /// </summary>
    public class VoidRequestType
    {
    }
}