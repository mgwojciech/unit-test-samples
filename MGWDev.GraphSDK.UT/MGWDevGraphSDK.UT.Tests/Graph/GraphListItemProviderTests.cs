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
    public class GraphListItemProviderTests
    {
        [TestMethod]
        public void GraphListItemProvider_Test_GetListItems()
        {
            //Arrage
            DateTime createdDate = DateTime.Now.AddDays(-10);
            DateTime modifiedDate = DateTime.Now.AddDays(-5);
            MockHttpProvider mockHttpProvider = new MockHttpProvider();
            mockHttpProvider.Responses.Add("GET:https://graph.microsoft.com/v1.0/sites/test-site-id/lists/test-list-id/items?$filter=AuthorLookupId eq '10'&$expand=fields", new ListItemsCollectionResponse()
            {
                Value = new ListItemsCollectionPage()
                {
                    new ListItem()
                    {
                        ContentType = new ContentTypeInfo()
                        {
                            Id = "0x01"
                        },
                        Id = "10",
                        Fields = new FieldValueSet()
                        {
                        AdditionalData = new Dictionary<string, object>()
                            {
                                {"AuthorLookupId", 10},
                                {"EditorLookupId", 11},
                                {"Created", createdDate },
                                {"Modified", modifiedDate }
                            }
                        },
                        CreatedBy = new IdentitySet()
                        {
                            User = new Identity()
                            {
                                Id = "test-author-id",
                                DisplayName = "Test Author",
                                AdditionalData = new Dictionary<string, object>()
                                {
                                    { "email", "test.author@test.domain.com" }
                                }
                            }
                        },
                        LastModifiedBy =  new IdentitySet()
                        {
                            User = new Identity()
                            {
                                Id = "test-editor-id",
                                DisplayName = "Test Editor",
                                AdditionalData = new Dictionary<string, object>()
                                {
                                    { "email", "test.editor@test.domain.com" }
                                }
                            }
                        },
                    }
                }
            });

            //Act
            GraphServiceClient client = new GraphServiceClient(new MockAuthenticationHelper(), mockHttpProvider);
            GraphListItemProvider<SPListItem> listItemProvider = new GraphListItemProvider<SPListItem>("test-site-id", client);


            IEnumerable<SPListItem> listItems = listItemProvider.GetListItems("test-list-id", "AuthorLookupId eq '10'");

            //Assert
            SPListItem item = listItems.FirstOrDefault();
            Assert.AreEqual(10, item.Id);
            Assert.AreEqual("test-author-id", item.Author.Id);
            Assert.AreEqual(10, item.Author.SPId);
            Assert.AreEqual(11, item.Editor.SPId);
            Assert.AreEqual(createdDate, item.Created);
        }
    }
}
