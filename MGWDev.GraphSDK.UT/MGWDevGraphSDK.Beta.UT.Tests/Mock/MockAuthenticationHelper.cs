using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace MGWDevGraphSDK.Beta.UT.Tests.Mock
{
    public class MockAuthenticationHelper : IAuthenticationProvider
    {
        public Task AuthenticateRequestAsync(HttpRequestMessage request)
        {
            return Task.Run(() => { });
        }
    }
}
