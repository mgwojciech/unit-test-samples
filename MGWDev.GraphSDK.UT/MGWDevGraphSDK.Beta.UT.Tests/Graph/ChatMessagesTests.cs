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
            string requestUrl = "https://graph.microsoft.com/beta/users/1/chats/microsoft.graph.allMessages";
            MockHttpProvider mockHttpProvider = new MockHttpProvider();

            mockHttpProvider.Responses.Add("GET:" + requestUrl, new
            {
                value = new List<object>()
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
    }
}
