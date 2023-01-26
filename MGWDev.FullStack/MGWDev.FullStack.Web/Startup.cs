using MGWDev.FullStack.Web.StartupConfiguration;
using MGWDev.FullStack.Web.Utilities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;

namespace MGWDev.FullStack.Web;

public class Startup
{
    public IConfiguration Configuration { get; }
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(
                policy =>
                {
                    policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
        });
        services.AddSpaStaticFiles(configuration =>
        {
            configuration.RootPath = "client-app/build";
        });
        services.AddControllers();
        services.AddScoped<AccessTokenUtilities>();
        services.AddScoped<HttpClientUtilities>();
        services.ConfigureAuthorization(Configuration);
    }
    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        
        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseSpaStaticFiles();
        
        app.UseRouting();
        app.UseCors();
        
        app.UseAuthentication();
        app.UseAuthorization();
        
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");
        });
        
        app.Use(async (context, next) =>
        {
            if (context.User.Identity is { IsAuthenticated: false })
            {
                if (context.Request.Path.StartsWithSegments("/login"))
                {
                    await context.ChallengeAsync(new AuthenticationProperties()
                    {
                        RedirectUri = $"https://{context.Request.Host.Value}"
                    });
                }

                else if (context.Request.Path.StartsWithSegments("/api"))
                {
                    context.Response.StatusCode = 401;
                    await next();
                }
                else await next();
            }
            else
            {
                await next();
            }
        });
        
        app.UseSpa(spa =>
        {
            spa.Options.SourcePath = "client-app";

            if (env.IsDevelopment())
            {
                spa.UseReactDevelopmentServer(npmScript: "start");
            }
        });
    }
}