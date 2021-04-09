using MGWDev.PnP;
using MGWDev.PnP.Model;
using MGWDev.PnPFramework;
using MGWDev.PnPFramework.Lib;
using MGWDev.PnPFramework.UT.Helpers;
using Microsoft.SharePoint.Client;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using PnP.Framework;
using PnP.Framework.Utilities;
using PnP.Framework.Utilities.UnitTests.Model;
using PnP.Framework.Utilities.UnitTests.Web;
using System;
using System.Collections.Generic;

namespace MGWDev.PnPFramework.UT
{
    [TestClass]
    public class ListItemProviderTests
    {
        [TestMethod]
        public void ListItemProvider_Test_GetItems_MockResponse()
        {
            using (ClientContext context = new ClientContext("https://test.sharepoint.com/sites/test"))
            {
                MockEntryResponseProvider responseProvider = new MockEntryResponseProvider();
                responseProvider.ResponseEntries.Add(new MockResponseEntry<object>()
                {
                    Url = "https://test.sharepoint.com/sites/test",
                    Method = "GetItems",
                    ReturnValue = new
                    {
                        _ObjectType_ = "SP.ListItemCollection",
                        _Child_Items_ = new List<object>()
                        {
                            new
                            {
                                _ObjectType_ = "SP.ListItem",
                                Id = 1,
                                Title = "Test Title 1",
                                Modified = "/Date(1608850800000)/"
                            },
                            new
                            {
                                _ObjectType_ = "SP.ListItem",
                                Id = 2,
                                Title = "Test Title 2",
                                Modified = "/Date(1608850800000)/"
                            }
                        }
                    }
                });
                MockWebRequestExecutorFactory executorFactory = new MockWebRequestExecutorFactory(responseProvider);
                context.WebRequestExecutorFactory = executorFactory;

                IListItemProvider<MyTestListItem> provider = new ListItemProvider(context);
                var myItems = provider.GetMyItems();

                Assert.AreEqual(1, myItems[0].Id);
                Assert.AreEqual("Test Title 1", myItems[0].Title);
                Assert.AreEqual(DateTime.Parse("12/24/2020 11:00:00 PM"), myItems[0].Modified);
            }
        }
        [TestMethod]
        public void ListItemProvider_Test_GetItems_Integration()
        {
            using (AuthenticationManager authManager = new AuthenticationManager(Common.User, EncryptionUtility.ToSecureString(Common.UserPassword)))
            {
                using (ClientContext context = authManager.GetContext(Common.SiteUrl))
                {
                    MockExecutorFactory factory = UnitTestClientContextHelper.BuildExecutorFactory(true, "./../../../MockResponses/ListItemProvider_Test_GetItems_Integration.json");
                    context.WebRequestExecutorFactory = factory;

                    ListItemProvider provider = new ListItemProvider(context);
                    var myItems = provider.GetMyItems();

                    factory.SaveMockData();
                }
            }
        }
        [TestMethod]
        public void ListItemProvider_Test_GetItems_UseStoredFile()
        {
            string siteUrl = "https://totally-mocked.sharepoint.com/sites/some-test-site";
            using (ClientContext context = new ClientContext(siteUrl))
            {
                MockExecutorFactory factory = UnitTestClientContextHelper.BuildExecutorFactory(false, "./../../../MockResponses/ListItemProvider_Test_GetItems_Integration.json");
                context.WebRequestExecutorFactory = factory;

                ListItemProvider provider = new ListItemProvider(context);
                var myItems = provider.GetMyItems();
            }
        }
        [TestMethod]
        public void ListItemProvider_Test_AddItems_ItemExists()
        {
            using (ClientContext context = new ClientContext("https://test.sharepoint.com/sites/test"))
            {

                MockExecutorFactory factory = UnitTestClientContextHelper.BuildExecutorFactory(false, "./../../../MockResponses/ListItemProvider_Test_AddItems_NoItemExists.json");
                context.WebRequestExecutorFactory = factory;

                ListItemProvider provider = new ListItemProvider(context);
                provider.UpdateItem(new MyTestListItem()
                {
                    Id = 1,
                    Title = "Title"
                });
            }
        }
    }
}
