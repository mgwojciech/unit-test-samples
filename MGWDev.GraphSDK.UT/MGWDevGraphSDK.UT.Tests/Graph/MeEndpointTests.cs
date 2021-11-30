using MGWDevGraphSDK.UT.Tests.Mock;
using Microsoft.Graph;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
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
                if (eventArgs.RequestMessage.RequestUri.ToString() == requestUrl)
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
        [TestMethod]
        public void MeEndpoint_GetMeInfo_MemberOf()
        {
            var sth = JsonConvert.DeserializeObject("{\"@odata.type\": \"#microsoft.graph.group\"}");
            string requestUrl = "https://graph.microsoft.com/v1.0/me/memberOf";
            MockHttpProvider mockHttpProvider = new MockHttpProvider();

            mockHttpProvider.Responses.Add("GET:" + requestUrl, new
            {
                value = new List<object>()
                {
                    new {
                        id =  "d17a5f86-57f4-48f8-87a0-79761dc8e706",
                        createdDateTime = "2017-07-31T17:36:25Z",
                        description= "Fashion events Channel ... everything you need to know all in one place. Announcements, Events, Information, and News.",
                        displayName= "Fashion Events",
                        groupTypes= new string[] {"Unified" },
                            mail= "FashionEvents@M365x214355.onmicrosoft.com",
                            mailEnabled= true,
                            mailNickname= "FashionEvents",
                            proxyAddresses= new string[]{
                            "SMTP:FashionEvents@M365x214355.onmicrosoft.com",
                            "SPO:SPO_c1e5444e-12d8-43d3-96b1-f2f66559ef58@SPO_dcd219dd-bc68-4b9b-bf0b-4a33a796be35"
                        },
                            renewedDateTime= "2017-07-31T17:36:25Z",
                            securityEnabled= true,
                            securityIdentifier= "S-1-12-1-3514457990-1224234996-1987682439-115853341",
                            visibility= "Public"
                    }
                }
            });
            GraphServiceClient client = new GraphServiceClient(new MockAuthenticationHelper(), mockHttpProvider);
            var response = client.Me.MemberOf.Request().GetAsync().Result;

            Assert.AreEqual("d17a5f86-57f4-48f8-87a0-79761dc8e706", response.FirstOrDefault().Id);
            Assert.AreEqual("Fashion Events", response.FirstOrDefault().AdditionalData["displayName"].ToString());
        }
        [TestMethod]
        public void MeEndpoint_GetMeInfo_MemberOf_Group()
        {
            var sth = JsonConvert.DeserializeObject("{\"@odata.type\": \"#microsoft.graph.group\"}");
            string requestUrl = "https://graph.microsoft.com/v1.0/me/memberOf";
            MockHttpProvider mockHttpProvider = new MockHttpProvider();

            mockHttpProvider.Responses.Add("GET:" + requestUrl, new
            {
                value = new List<object>()
                {
                    new Group(){
                        Id =  "d17a5f86-57f4-48f8-87a0-79761dc8e706",
                        CreatedDateTime = DateTime.Parse("2017-07-31T17:36:25Z"),
                        Description= "Fashion events Channel ... everything you need to know all in one place. Announcements, Events, Information, and News.",
                        DisplayName= "Fashion Events",
                        GroupTypes= new string[] {"Unified" },
                        Mail= "FashionEvents@M365x214355.onmicrosoft.com",
                        MailEnabled= true,
                            MailNickname= "FashionEvents",
                            RenewedDateTime= DateTime.Parse("2017-07-31T17:36:25Z"),
                            SecurityEnabled= true,
                            SecurityIdentifier= "S-1-12-1-3514457990-1224234996-1987682439-115853341",
                            Visibility= "Public"
                    }
                }
            });
            GraphServiceClient client = new GraphServiceClient(new MockAuthenticationHelper(), mockHttpProvider);
            var response = client.Me.MemberOf.Request().GetAsync().Result;

            Assert.AreEqual("d17a5f86-57f4-48f8-87a0-79761dc8e706", response.FirstOrDefault().Id);
            Assert.AreEqual("Group", response.FirstOrDefault().GetType().Name);
        }
    }
}
