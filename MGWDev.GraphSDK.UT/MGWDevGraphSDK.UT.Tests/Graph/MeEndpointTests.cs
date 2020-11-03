using MGWDevGraphSDK.UT.Tests.Mock;
using Microsoft.Graph;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDevGraphSDK.UT.Tests.Graph
{
    [TestClass]
    public class MeEndpointTests
    {
        [TestMethod]
        public void MeEndpoint_GetMeInfo()
        {
            string requestUrl = "https://graph.microsoft.com/v1.0/me";
            MockHttpProvider mockHttpProvider = new MockHttpProvider();
            mockHttpProvider.Responses.Add("GET:" + requestUrl, new User()
            {
                DisplayName = "Test User"
            });
            GraphServiceClient client = new GraphServiceClient(new MockAuthenticationHelper(), mockHttpProvider);
            User response = client.Me.Request().GetAsync().Result;

            Assert.AreEqual("Test User", response.DisplayName);
        }
        [TestMethod]
        public void MeEndpoint_GetMeInfo_OnRequestExecuting()
        {
            string requestUrl = "https://graph.microsoft.com/v1.0/me";
            MockHttpProvider mockHttpProvider = new MockHttpProvider();
            mockHttpProvider.OnRequestExecuting += delegate (object sender, MockRequestExecutingEventArgs eventArgs)
            {
                if(eventArgs.RequestMessage.RequestUri.ToString() == requestUrl)
                {
                    eventArgs.Result = new User()
                    {
                        DisplayName = "Test User"
                    };
                }
            };
            GraphServiceClient client = new GraphServiceClient(new MockAuthenticationHelper(), mockHttpProvider);
            User response = client.Me.Request().GetAsync().Result;

            Assert.AreEqual("Test User", response.DisplayName);
        }
    }
}
