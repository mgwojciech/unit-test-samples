using System.Text.Json.Serialization;

namespace MGWDev.FullStack.Web.Model;

public class TokenBrokerResponse
{
    [JsonPropertyName("accessToken")] public string AccessToken { get; set; }
}