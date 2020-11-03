using MGWDev.GraphSDK.UT.Graph.DAL;
using MGWDev.GraphSDK.UT.Lib.Model;
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
    public class GraphUserInfoProviderTests
    {
        [TestMethod]
        public void GraphUserInfoProvider_Test_GetCurrentUser()
        {
            //Arrange
            MockHttpProvider mockHttpProvider = new MockHttpProvider();
            mockHttpProvider.Responses.Add("GET:https://graph.microsoft.com/v1.0/me", new User()
            {
                DisplayName = "Test User",
                Mail = "test.user@test.domain.com",
                Id = "test-user-id"
            });
            mockHttpProvider.Responses.Add("GET:https://graph.microsoft.com/v1.0/sites/test-site-id/lists/User Information List/items?$filter=fields/EMail eq 'test.user@test.domain.com'", new ListItemsCollectionResponse()
            {
                Value = new ListItemsCollectionPage()
                {
                    new ListItem()
                    {
                        Id = "10"
                    }
                }
            });

            //Act
            GraphServiceClient client = new GraphServiceClient(new MockAuthenticationHelper(), mockHttpProvider);
            GraphUserInfoProvider userInfoProvider = new GraphUserInfoProvider(client, "test-site-id");

            FieldUser user = userInfoProvider.GetCurrentUserInfo();

            //Assert
            Assert.AreEqual("Test User", user.DisplayName);
            Assert.AreEqual("test.user@test.domain.com", user.Email);
            Assert.AreEqual("test-user-id", user.Id);
            Assert.AreEqual(10, user.SPId);
        }
    }
}
