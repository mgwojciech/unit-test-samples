using System.Text.Json.Serialization;

namespace MGWDev.FullStack.Web.Model.DTO.SharePoint;

public class HomeSiteDetails
{
    [JsonPropertyName("SiteId")]
    public string SiteId { get; set; }
    [JsonPropertyName("Url")]
    public string Url { get; set; }
    [JsonPropertyName("Title")]
    public string Title { get; set; }
}