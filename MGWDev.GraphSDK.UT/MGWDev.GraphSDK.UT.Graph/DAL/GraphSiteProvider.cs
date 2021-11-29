using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Graph.DAL
{
    public class GraphSiteProvider
    {
        public GraphServiceClient Client { get; protected set; }
        public GraphSiteProvider(GraphServiceClient serviceClient)
        {
            Client = serviceClient;
        }
        public Site GetSite(string domainName, string serverRelativeUrl)
        {
            return Client.Sites.GetByPath(domainName, serverRelativeUrl).Request().GetAsync().Result;

        }
    }
}
