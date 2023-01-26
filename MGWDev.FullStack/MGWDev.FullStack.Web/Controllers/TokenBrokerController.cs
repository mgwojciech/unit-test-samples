using MGWDev.FullStack.Web.Model;
using MGWDev.FullStack.Web.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;

namespace MGWDev.FullStack.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TokenBrokerController : ControllerBase
{
    protected AccessTokenUtilities TokenHelper { get; set; }

    public TokenBrokerController(AccessTokenUtilities tokenAcquisitionService)
    {
        TokenHelper = tokenAcquisitionService;
    }

    [HttpGet]
    public TokenBrokerResponse GetOBOToken([FromQuery] string resource)
    {
        string bearerToken = "";
        string authorizationHeader = Request.Headers.Authorization.FirstOrDefault();
        if (authorizationHeader is not null)
        {
            bearerToken = authorizationHeader.Replace("Bearer ", "");
        }

        string token = TokenHelper.GetAccessToken(resource, bearerToken);
        return new TokenBrokerResponse()
        {
            AccessToken = token
        };
    }
}