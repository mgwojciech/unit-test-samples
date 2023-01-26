using System.Net.Http.Headers;

namespace MGWDev.FullStack.Web.Utilities;

public class HttpClientUtilities
{
    private AccessTokenUtilities _accessTokenUtilities;
    private Dictionary<string, HttpClient> _clients = new Dictionary<string, HttpClient>();
    public HttpClientUtilities(AccessTokenUtilities accessTokenUtilities)
    {
        _accessTokenUtilities = accessTokenUtilities;
    }
    public HttpClient GetClientForResource(string resourceUri, string resourceUrl = null, string jwtToken = null)
    {
        if (String.IsNullOrEmpty(resourceUrl))
        {
            resourceUrl = resourceUri;
        }
        if (!_clients.ContainsKey(resourceUri))
        {
            string accessToken = _accessTokenUtilities.GetAccessToken(resourceUri, jwtToken);
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(resourceUrl);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            client.DefaultRequestHeaders.Accept.Add(new ("application/json"));
            _clients.Add(resourceUri,client);
        }
        return _clients[resourceUri];
    }
}