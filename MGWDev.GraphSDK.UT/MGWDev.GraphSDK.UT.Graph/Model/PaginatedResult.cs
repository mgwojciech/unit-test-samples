using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Graph.Model
{
    public class PaginatedResult<T>
    {
        [JsonPropertyName("@odata.nextLink")]
        [JsonProperty("@odata.nextLink")]
        public string NextLink { get; set; }
        [JsonPropertyName("value")]
        public List<T> Value { get; set; }
    }
}
