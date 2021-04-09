using PnP.Core.Services;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.PnPFramework.UT.Helpers
{
    public class MockAuthenticationProvider : IAuthenticationProvider
    {
        public string MockToken { get; set; } = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwidXBuIjoiam9obi5kb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.TDq3q59XyXqTt3rBszehNEsqZusbMs4OvS25ZwGoUUY";
        public Task AuthenticateRequestAsync(Uri resource, HttpRequestMessage request)
        {
            return Task.CompletedTask;
        }

        public Task<string> GetAccessTokenAsync(Uri resource, string[] scopes)
        {
            return Task.FromResult(MockToken);
        }

        public Task<string> GetAccessTokenAsync(Uri resource)
        {
            return Task.FromResult(MockToken);
        }
    }
}
