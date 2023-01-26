using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Graph;
using Microsoft.Identity.Web;
using PnP.Core.Auth;
using SB.M365.Installer.Utils;

namespace SB.M365.Installer.Web.Utilities;

public class AccessTokenUtilities
{
    protected ITokenAcquisition TokenAcquisitionService { get; set; }
    protected IConfiguration Configuration { get; set; }
    public AccessTokenUtilities(ITokenAcquisition tokenAcquisitionService, IConfiguration configuration)
    {
        TokenAcquisitionService = tokenAcquisitionService;
        Configuration = configuration;
    }
    public string GetAccessToken(string resource, HttpRequest request)
    {
        string token = "";
        if (request.Headers.Authorization.FirstOrDefault() != null)
        {
            OnBehalfOfAuthenticationProvider provider = new OnBehalfOfAuthenticationProvider(Configuration.GetValue<string>("AzureAd:ClientId"),
                "organizations", StringUtils.CovertToSecureString(Configuration.GetValue<string>("AzureAd:ClientSeret")), () =>
                {
                    string token = request.Headers.Authorization.FirstOrDefault().Replace("Bearer ", "");
                    return token;
                });
            token = provider.GetAccessTokenAsync(new Uri($"{resource}/.default")).Result;
        }
        else
        {
            token = TokenAcquisitionService
                .GetAccessTokenForUserAsync(new List<string>() { $"{resource}/.default" },
                    OpenIdConnectDefaults.AuthenticationScheme, null, null, null, null).Result;
        }

        return token;
    }
}