using System.Text.Json.Serialization;

namespace MGWDev.FullStack.Web.Model.DTO.Graph;

public class Site
{
    [JsonPropertyName("webUrl")]
    public string WebUrl { get; set; }
}