using MGWDevGraphSDK.Beta.UT.Tests.Mock;
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
    public class AppHelperTests
    {
        [TestMethod]
        public void ShouldCreateAppRegistration()
        {
            MockHttpProvider mockHttpProvider = new MockHttpProvider();
            mockHttpProvider.Responses.Add("POST:https://graph.microsoft.com/beta/applications", new Application()
            {
                DisplayName = "abcApp",
                Id = "abc",
                AppId = "cde"
            });
            GraphServiceClient client = new GraphServiceClient(new MockAuthenticationHelper(), mockHttpProvider);

            Application addedApp = client.Applications.Request().AddAsync(new Application()
            {
                DisplayName = "abcApp",
                Id = "abc",
                AppId = "cde"
            }).Result;

            Assert.AreEqual("abcApp", addedApp.DisplayName);
        }
    }
}
