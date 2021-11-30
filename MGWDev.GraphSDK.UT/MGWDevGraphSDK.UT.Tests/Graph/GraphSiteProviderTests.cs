using MGWDev.GraphSDK.UT.Graph.DAL;
using MGWDevGraphSDK.UT.Tests.Mock;
using Microsoft.Graph;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Net;

namespace MGWDevGraphSDK.UT.Tests.Graph
{
    [TestClass]
    public class GraphSiteProviderTests
    {
        [TestMethod]
        public void GraphSiteProvider_Should_Handle_NotFound()
        {
            MockHttpProvider provider = new MockHttpProvider();
            provider.OnRequestExecuting += delegate (object sender, MockRequestExecutingEventArgs e)
            {
                e.ResponseCode = HttpStatusCode.NotFound;
                e.Result = System.Text.Json.JsonSerializer.Deserialize<dynamic>(@"{
                ""error"": {
                    ""code"": ""itemNotFound"",
                    ""message"": ""Requested site could not be found"",
                    ""innerError"": {
                        ""date"": ""2021-11-29T16:52:56"",
                        ""request-id"": ""f62de8dd-7032-4a0e-9213-3bd8fca79273"",
                        ""client-request-id"": ""cae9bd5d-ae1e-0229-1da7-04c5c976ad4c""
                    }
                }
            }");
            };
            GraphSiteProvider siteProvider = new GraphSiteProvider(new GraphServiceClient(new MockAuthenticationHelper(), provider));

            Site site = siteProvider.GetSite("test.sharepoint.com", "sites/non-existing-site");
            Assert.AreEqual("itemNotFound", site.Error.Code);
        }
    }
}
