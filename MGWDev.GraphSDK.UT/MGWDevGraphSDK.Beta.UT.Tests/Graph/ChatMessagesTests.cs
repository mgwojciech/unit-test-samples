using MGWDevGraphSDK.Beta.UT.Tests.Mock;
using Microsoft.Graph;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDevGraphSDK.Beta.UT.Tests.Graph
{
    [TestClass]
    public class ChatMessagesTests
    {
        [TestMethod]
        public void ChatMessages_Test_GetUserChatMessages()
        {
            string requestUrl = "https://graph.microsoft.com/beta/users/1/chats/microsoft.graph.allMessages()";
            MockHttpProvider mockHttpProvider = new MockHttpProvider();

            mockHttpProvider.Responses.Add("GET:" + requestUrl, new
            {
                Value = new List<object>()
                {
                    new ChatMessage(){
                        ChatId = "test-chat-id-1",
                        Id = "test-id-1"
                    },
                    new ChatMessage(){
                        ChatId = "test-chat-id-1",
                        Id = "test-id-2"
                    }
                }
            });
            GraphServiceClient client = new GraphServiceClient(new MockAuthenticationHelper(), mockHttpProvider);
            var response = client.Users["1"].Chats.AllMessages().Request().GetAsync().Result;

            Assert.AreEqual("test-chat-id-1", response.FirstOrDefault().ChatId);
            Assert.AreEqual("test-id-1", response.FirstOrDefault().Id);
        }
        [TestMethod]
        public void ChatMessages_Test_GetUserChatMessages_Pagination()
        {
            string requestUrl = "https://graph.microsoft.com/beta/users/1/chats/microsoft.graph.allMessages()";
            string requestUrlNextPage = "https://graph.microsoft.com/beta/users/1/chats/microsoft.graph.allMessages?nextpage=2";
            MockHttpProvider mockHttpProvider = new MockHttpProvider();

            mockHttpProvider.Responses.Add("GET:" + requestUrl, new MockPagedResponse<ChatMessage>()
            {
                NextLink = requestUrlNextPage,
                Value = new List<ChatMessage>()
                {
                    new ChatMessage(){
                        ChatId = "test-chat-id-1",
                        Id = "test-id-1"
                    },
                    new ChatMessage(){
                        ChatId = "test-chat-id-1",
                        Id = "test-id-2"
                    }
                }
            });
            mockHttpProvider.Responses.Add("GET:" + requestUrlNextPage, new MockPagedResponse<ChatMessage>()
            {
                Value = new List<ChatMessage>()
                {
                    new ChatMessage(){
                        ChatId = "test-chat-id-2",
                        Id = "test-id-3"
                    },
                    new ChatMessage(){
                        ChatId = "test-chat-id-2",
                        Id = "test-id-4"
                    }
                }
            });
            GraphServiceClient client = new GraphServiceClient(new MockAuthenticationHelper(), mockHttpProvider);
            var response = client.Users["1"].Chats.AllMessages().Request().GetAsync().Result;

            Assert.AreEqual("test-chat-id-1", response.FirstOrDefault().ChatId);
            Assert.AreEqual("test-id-1", response.FirstOrDefault().Id);

            var secondPageResponse = response.NextPageRequest.GetAsync().Result;
            Assert.AreEqual("test-chat-id-2", secondPageResponse.FirstOrDefault().ChatId);
            Assert.AreEqual("test-id-3", secondPageResponse.FirstOrDefault().Id);
        }
        [TestMethod]
        public void ChatMessages_Test_GetUserChatMessages_Batch()
        {
            MockHttpProvider mockHttpProvider = new MockHttpProvider();

            GraphServiceClient client = new GraphServiceClient(new MockAuthenticationHelper(), mockHttpProvider);
            var request = client.Users["1"].Chats.AllMessages().Request();

            var batchRequestContent = new BatchRequestContent();
            var batchId = batchRequestContent.AddBatchRequestStep(request);

            mockHttpProvider.Responses.Add("POST:https://graph.microsoft.com/beta/$batch", new
            {
                responses = new List<object>()
                {
                    new {
                        id = batchId,
                        body = new List<ChatMessage>() {
                            new ChatMessage(){
                                ChatId = "test-chat-id-1",
                                Id = "test-id-1"
                            },
                            new ChatMessage(){
                                ChatId = "test-chat-id-1",
                                Id = "test-id-2"
                            }
                        }
                    }
                }
            });

            var batchResponse = client.Batch.Request().PostAsync(batchRequestContent).Result;
            var chatMessagesResponse = batchResponse.GetResponseByIdAsync(batchId).Result;

            IChatAllMessagesCollectionPage response = mockHttpProvider.Serializer.DeserializeObject<IChatAllMessagesCollectionPage>(chatMessagesResponse.Content.ReadAsStringAsync().Result);
            Assert.AreEqual("test-chat-id-1", response.FirstOrDefault().ChatId);
            Assert.AreEqual("test-id-1", response.FirstOrDefault().Id);

        }
    }
}
