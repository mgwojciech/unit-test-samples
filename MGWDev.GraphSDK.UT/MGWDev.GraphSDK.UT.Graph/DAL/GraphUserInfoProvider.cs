using MGWDev.GraphSDK.UT.Lib.DAL;
using MGWDev.GraphSDK.UT.Lib.Model;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Graph.DAL
{
    public class GraphUserInfoProvider : IUserInfoProvider
    {
        public GraphServiceClient ServiceClient { get; protected set; }
        public string SiteId { get; }
        public GraphUserInfoProvider(GraphServiceClient serviceClient, string siteId)
        {
            ServiceClient = serviceClient;
            SiteId = siteId;
        }

        public FieldUser GetCurrentUserInfo()
        {
            User user = ServiceClient.Me.Request().GetAsync().Result;
            return GetFieldUserFromGraphUser(user);
        }

        private FieldUser GetFieldUserFromGraphUser(User user)
        {
            var siteUserInfo = ServiceClient.Sites[SiteId].Lists["User Information List"].Items.Request().Filter($"fields/EMail eq '{user.Mail}'").GetAsync().Result.FirstOrDefault();

            return new FieldUser()
            {
                DisplayName = user.DisplayName,
                Email = user.Mail,
                Id = user.Id,
                SPId = Convert.ToInt32(siteUserInfo.Id)
            };
        }

        public FieldUser GetUserInfo(string userLogin)
        {
            User user = ServiceClient.Users.Request().Filter($"userPrincipalName eq '{userLogin}'").GetAsync().Result.FirstOrDefault();
            return GetFieldUserFromGraphUser(user);
        }
    }
}
