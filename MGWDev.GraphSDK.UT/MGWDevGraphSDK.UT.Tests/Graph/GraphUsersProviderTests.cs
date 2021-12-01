using Azure.Core;
using Azure.Identity;
using MGWDev.GraphSDK.UT.Graph.DAL;
using MGWDev.GraphSDK.UT.Graph.Model;
using MGWDevGraphSDK.UT.Tests.Mock;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace MGWDevGraphSDK.UT.Tests.Graph
{
    [TestClass]
    public class GraphUsersProviderTests
    {
        [TestMethod]
        public void GraphUsersProvider_GetUsers()
        {
            MockHttpProvider mockHttpProvider = new MockHttpProvider();
            mockHttpProvider.Responses.Add("GET:https://graph.microsoft.com/v1.0/users?$top=10",
                new PaginatedResult<User>()
                {
                    NextLink = "https://graph.microsoft.com/v1.0/users?$top=10&$skiptoken=1",
                    Value = new List<User>() {
                        new User()
                        {
                            DisplayName = "Test User 1",
                            Mail = "test.user1@test.domain.com",
                            Id = "test-user-1-id"
                        },
                        new User()
                        {
                            DisplayName = "Test User 2",
                            Mail = "test.user2@test.domain.com",
                            Id = "test-user-2-id"
                        }
                    }
                });
            mockHttpProvider.Responses.Add("GET:https://graph.microsoft.com/v1.0/users?$top=10&$skiptoken=1",
                new PaginatedResult<User>()
                {
                    Value = new List<User>() {
                        new User()
                        {
                            DisplayName = "Test User 3",
                            Mail = "test.user3@test.domain.com",
                            Id = "test-user-3-id"
                        }
                    }
                });

            GraphServiceClient client = new GraphServiceClient(new MockAuthenticationHelper(), mockHttpProvider);
            GraphUsersProvider provider = new GraphUsersProvider(client);
            var allUsers = provider.LoadAllEntities();
            Assert.AreEqual(3, allUsers.Count);
        }
        [TestMethod]
        public void AbstractEntityProvider_GetUsers()
        {
            MockHttpProvider mockHttpProvider = new MockHttpProvider();
            mockHttpProvider.Responses.Add("GET:https://graph.microsoft.com/v1.0/users?$top=10",
                new PaginatedResult<User>()
                {
                    NextLink = "https://graph.microsoft.com/v1.0/users?$top=10&$skiptoken=1",
                    Value = new List<User>() {
                        new User()
                        {
                            DisplayName = "Test User 1",
                            Mail = "test.user1@test.domain.com",
                            Id = "test-user-1-id"
                        },
                        new User()
                        {
                            DisplayName = "Test User 2",
                            Mail = "test.user2@test.domain.com",
                            Id = "test-user-2-id"
                        }
                    }
                });
            mockHttpProvider.Responses.Add("GET:https://graph.microsoft.com/v1.0/users?$top=10&$skiptoken=1",
                new PaginatedResult<User>()
                {
                    Value = new List<User>() {
                        new User()
                        {
                            DisplayName = "Test User 3",
                            Mail = "test.user3@test.domain.com",
                            Id = "test-user-3-id"
                        }
                    }
                });

            GraphServiceClient client = new GraphServiceClient(new MockAuthenticationHelper(), mockHttpProvider);
            AbstractEntityProvider<User> provider = new AbstractEntityProvider<User>(client, "https://graph.microsoft.com/v1.0/users");
            var allUsers = provider.LoadAllEntities();
            Assert.AreEqual(3, allUsers.Count);
        }
    }
}
