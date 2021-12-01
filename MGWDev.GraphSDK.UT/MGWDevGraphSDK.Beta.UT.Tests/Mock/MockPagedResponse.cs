using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace MGWDevGraphSDK.Beta.UT.Tests.Mock
{
    public class MockPagedResponse<T>
    {
        [JsonProperty("value")]
        public List<T> Value { get; set; }
        [JsonProperty("@odata.count")]
        public int Count { 
            get
            {
                return Value.Count;
            }
        }
        [JsonProperty("@odata.nextLink")]
        [JsonPropertyName("@odata.nextLink")]
        public string NextLink { get; set; }
    }
}
