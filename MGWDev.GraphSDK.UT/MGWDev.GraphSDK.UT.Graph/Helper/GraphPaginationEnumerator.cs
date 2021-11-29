using MGWDev.GraphSDK.UT.Graph.Model;
using Microsoft.Graph;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Graph.Helper
{
    public class GraphPaginationEnumerator<T> : IEnumerator<List<T>>
    {
        public int PageSize { get; set; }
        public List<T> Current { get; private set; }

        object IEnumerator.Current
        {
            get
            {
                return Current;
            }
        }
        public IHttpProvider HttpProvider { get; protected set; }
        public string NextLink { get; private set; }
        public string EntityEndpoint { get; protected set; }
        public GraphPaginationEnumerator(IHttpProvider httpProvider, string entityEndpoint, int pageSize = 10)
        {
            HttpProvider = httpProvider;
            EntityEndpoint = entityEndpoint;
            PageSize = pageSize;
        }

        public void Dispose()
        {
        }
        public bool MoveNext()
        {
            string url = NextLink;
            if (String.IsNullOrEmpty(url) && Current == null)
            {
                url = EntityEndpoint;
                if (!url.Contains("$top="))
                {
                    url += url.Contains("?") ? "&" : "?";
                    url += "$top=" + PageSize;
                }
            }
            else if (String.IsNullOrEmpty(NextLink) && Current != null)
            {
                return false;
            }
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, url);
            var response = HttpProvider.SendAsync(request).Result;
            string responseContent = response.Content.ReadAsStringAsync().Result;
            PaginatedResult<T> result = HttpProvider.Serializer.DeserializeObject<PaginatedResult<T>>(responseContent);
            NextLink = result.NextLink;
            Current = result.Value;

            return true;
        }

        public void Reset()
        {
            NextLink = String.Empty;
        }
    }
}
