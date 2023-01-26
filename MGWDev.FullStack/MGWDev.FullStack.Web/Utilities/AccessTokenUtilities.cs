using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Identity.Web;
using PnP.Core.Auth;

namespace MGWDev.FullStack.Web.Utilities;

public class AccessTokenUtilities
{
    protected ITokenAcquisition TokenAcquisitionService { get; set; }
    protected IConfiguration Configuration { get; set; }
    public AccessTokenUtilities(ITokenAcquisition tokenAcquisitionService, IConfiguration configuration)
    {
        TokenAcquisitionService = tokenAcquisitionService;
        Configuration = configuration;
    }
    /// <summary>
    /// Gets access token to provided resource with default scope
    /// </summary>
    /// <param name="resource">App id uri of a resource</param>
    /// <param name="jwtToken">JWT token to be used with On Behalf Flow</param>
    /// <returns>Access token</returns>
    public string GetAccessToken(string resource, string jwtToken = null)
    {
        string token = "";
        if (!String.IsNullOrEmpty(jwtToken))
        {
            //change organizations to tenantId for single tenant app
            OnBehalfOfAuthenticationProvider provider = new OnBehalfOfAuthenticationProvider(Configuration.GetValue<string>("AzureAd:ClientId"),
                "organizations", StringUtilities.CovertToSecureString(Configuration.GetValue<string>("AzureAd:ClientSecret")), () =>
                {
                    return jwtToken;
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