using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.UI;
using Microsoft.Net.Http.Headers;

namespace MGWDev.FullStack.Web.StartupConfiguration
{
    public static class AuthenticationConfiguration
    {
        public static IServiceCollection ConfigureAuthorization(this IServiceCollection services,
            IConfiguration configuration)
        {

            // Add services to the container.
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "OpenIdOrJWT";
                options.DefaultChallengeScheme = "OpenIdOrJWT";
            }).
                AddPolicyScheme("OpenIdOrJWT", "OpenId or JWT", options =>
                {
                    options.ForwardDefaultSelector = context =>
                    {
                        string authorization = context.Request.Headers[HeaderNames.Authorization];
                        if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer"))
                        {
                            return JwtBearerDefaults.AuthenticationScheme;
                        }

                        return OpenIdConnectDefaults.AuthenticationScheme;
                    };
                }).AddJwtBearer(options =>
                {
                    options.Authority = "https://login.microsoftonline.com/common";
                    options.Audience = configuration.GetValue<string>("AzureAd:Audience");
                    options.TokenValidationParameters.ValidateIssuer = false;
                    //For multi-tenant apps audience validation doesn't make sense
                    options.TokenValidationParameters.ValidateAudience = false;
                })
                .AddMicrosoftIdentityWebApp(configuration.GetSection("AzureAd")).EnableTokenAcquisitionToCallDownstreamApi()
                .AddMicrosoftGraph(configuration.GetSection("MicrosoftGraph"))
                .AddInMemoryTokenCaches();
            services.AddControllersWithViews()
                .AddMicrosoftIdentityUI();
            return services;
        }
    }
}
