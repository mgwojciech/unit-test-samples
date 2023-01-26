using System.Net.Http.Headers;
using MGWDev.FullStack.Web.Model.DTO.Graph;
using MGWDev.FullStack.Web.Model.DTO.SharePoint;
using MGWDev.FullStack.Web.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MGWDev.FullStack.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TenantHelperController : ControllerBase
{
    protected HttpClientUtilities HttpClientHelper { get; set; }

    public TenantHelperController(HttpClientUtilities clientHelper)
    {
        HttpClientHelper = clientHelper;
    }

    [HttpGet]
    public async Task<HomeSiteDetails> GetSPOHomePage()
    {
        string bearerToken = "";
        string authorizationHeader = Request.Headers.Authorization.FirstOrDefault();
        if (authorizationHeader is not null)
        {
            bearerToken = authorizationHeader.Replace("Bearer ", "");
        }
        HttpClient graphClient =
            HttpClientHelper.GetClientForResource("https://graph.microsoft.com",
                "https://graph.microsoft.com", 
                bearerToken);
        HttpResponseMessage rootSiteResponse = await graphClient.GetAsync("/v1.0/sites/root?$select=webUrl");
        Site rootSite = await rootSiteResponse.Content.ReadFromJsonAsync<Site>();
        if (rootSite is null)
        {
            throw new Exception("Unable to get root site");
        }
        HttpClient spoClient = HttpClientHelper.GetClientForResource(rootSite.WebUrl, null, bearerToken);
        HttpResponseMessage homeSiteResponse = await spoClient.GetAsync("/_api/SP.SPHSite/Details");

        return await homeSiteResponse.Content.ReadFromJsonAsync<HomeSiteDetails>();
    }
}