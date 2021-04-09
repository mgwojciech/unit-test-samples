using MGWDev.PnPFramework.UT.Helpers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PnP.Core.Auth;
using PnP.Core.Auth.Services.Builder.Configuration;
using PnP.Core.Model.SharePoint;
using PnP.Core.QueryModel;
using PnP.Core.Services;
using PnP.Core.Services.Builder.Configuration;
using PnP.Framework.Utilities;
using PnP.Framework.Utilities.UnitTests.Web;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace MGWDev.PnPFramework.UT.SDK
{
    public class SetupSDK
    {
        public static void DelegateToMockContext(bool runInIntegrationMode,
            string siteUrl,
            Action<PnPContext> contextAction,
            [System.Runtime.CompilerServices.CallerFilePath] string mockFolderPath = null,
            [System.Runtime.CompilerServices.CallerMemberName] string mockFileName = null)
        {
            string mockFilePath = mockFolderPath.Replace(".cs", $"\\{mockFileName}.json");
            var hostBuilder = Host.CreateDefaultBuilder().ConfigureServices((hostingContext, services) =>
                {
                    services.AddPnPCore(options =>
                    {


                        options.PnPContext.GraphFirst = true;
                    });
                    services.AddTransient<MockHttpHandler>((IServiceProvider provider) =>
                    {
                        return new MockHttpHandler(mockFilePath);
                    });
                    services.AddTransient<StoreResponseToAFile>((IServiceProvider provider) =>
                    {
                        return new StoreResponseToAFile(mockFilePath);
                    });
                    if (runInIntegrationMode)
                    {
                        services.AddHttpClient("MockRESTClient", config =>
                        {
                        }).AddHttpMessageHandler<StoreResponseToAFile>()
                        .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler()
                        {
                            UseCookies = false
                        });
                    }
                    else
                    {
                        services.AddHttpClient("MockRESTClient", config =>
                        {
                        }).AddHttpMessageHandler<MockHttpHandler>();
                    }
                    services.AddTransient<SharePointRestClient>((IServiceProvider provider) =>
                    {
                        var client = provider.GetRequiredService<IHttpClientFactory>().CreateClient("MockRESTClient");
                        return new SharePointRestClient(client, provider.GetRequiredService<ILogger<SharePointRestClient>>(), provider.GetRequiredService<IOptions<PnPGlobalSettingsOptions>>());
                    });
                    services.AddTransient<MicrosoftGraphClient>((IServiceProvider provider) =>
                    {
                        var client = provider.GetRequiredService<IHttpClientFactory>().CreateClient("MockRESTClient");
                        return new MicrosoftGraphClient(client, provider.GetRequiredService<ILogger<MicrosoftGraphClient>>(), provider.GetRequiredService<IOptions<PnPGlobalSettingsOptions>>());
                    });
                    services.AddTransient<IAuthenticationProvider>((IServiceProvider provider) =>
                    {
                        if (runInIntegrationMode)
                        {
                            return new UsernamePasswordAuthenticationProvider("31359c7f-bd7e-475c-86db-fdb8c937548e", "organizations", Common.User, EncryptionUtility.ToSecureString(Common.UserPassword));
                        }
                        else
                        {
                            return new MockAuthenticationProvider();
                        }
                    });
                });
            IHost host = hostBuilder.Build();
            using (var scope = host.Services.CreateScope())
            {
                IPnPContextFactory pnpContextFactory = scope.ServiceProvider.GetRequiredService<IPnPContextFactory>();
                using (PnPContext context = pnpContextFactory.Create(new Uri(siteUrl),host.Services.GetRequiredService< IAuthenticationProvider>()))
                {
                    contextAction(context);
                }
            }
        }
    }
}
