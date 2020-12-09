using Microsoft.Graph;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MGWDevGraphSDK.Beta.UT.Tests.Mock
{
    public class MockRequestExecutingEventArgs
    {
        public HttpRequestMessage RequestMessage { get; }
        public object Result { get; set; }

        public MockRequestExecutingEventArgs(HttpRequestMessage message)
        {
            RequestMessage = message;
        }
    }
    public class MockHttpProvider : IHttpProvider
    {
        public ISerializer Serializer { get; } = new Serializer();

        public TimeSpan OverallTimeout { get; set; } = TimeSpan.FromSeconds(10);
        public Dictionary<string, object> Responses { get; set; } = new Dictionary<string, object>();
        public event EventHandler<MockRequestExecutingEventArgs> OnRequestExecuting;
        public void Dispose()
        {
        }

        public Task<HttpResponseMessage> SendAsync(HttpRequestMessage request)
        {
            return Task.Run(() =>
            {
                string key = request.Method.ToString() + ":" + request.RequestUri.ToString();
                //For debug purposes
                if (request.Content != null)
                {
                    string body = request.Content.ReadAsStringAsync().Result;
                }
                HttpResponseMessage response = new HttpResponseMessage();
                if(OnRequestExecuting!= null)
                {
                    MockRequestExecutingEventArgs args = new MockRequestExecutingEventArgs(request);
                    OnRequestExecuting.Invoke(this, args);
                    if(args.Result != null)
                    {
                        response.Content = new StringContent(Serializer.SerializeObject(args.Result));
                    }
                }
                if (Responses.ContainsKey(key) && response.Content == null)
                {
                    response.Content = new StringContent(Serializer.SerializeObject(Responses[key]));
                }
                return response;
            });
        }

        public Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, HttpCompletionOption completionOption, CancellationToken cancellationToken)
        {
            return SendAsync(request);
        }
    }
}
