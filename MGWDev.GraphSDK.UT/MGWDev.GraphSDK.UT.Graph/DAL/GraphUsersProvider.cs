using MGWDev.GraphSDK.UT.Graph.Helper;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Graph.DAL
{
    public class GraphUsersProvider
    {
        protected GraphServiceClient ServiceClient { get; set; }
        public int PageSize { get; set; } = 10;
        public GraphUsersProvider(GraphServiceClient serviceClient)
        {
            ServiceClient = serviceClient;
        }
        public List<User> LoadAllUsers()
        {
            PaginatedDataAccessor<User> userAccessor = new PaginatedDataAccessor<User>(ServiceClient.HttpProvider, "https://graph.microsoft.com/v1.0/users", PageSize);
            List<User> result = new List<User>();
            foreach(List<User> pagedUsers in userAccessor)
            {
                result.AddRange(pagedUsers);
            }

            return result;
        }
    }
}
