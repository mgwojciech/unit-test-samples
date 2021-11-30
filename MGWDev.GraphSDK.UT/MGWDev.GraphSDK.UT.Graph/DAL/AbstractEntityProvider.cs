using MGWDev.GraphSDK.UT.Graph.Helper;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Graph.DAL
{
    public class AbstractEntityProvider<T>
    {
        protected GraphServiceClient ServiceClient { get; set; }
        public int PageSize { get; set; } = 10;
        public string InitialQuery { get; set; }
        public AbstractEntityProvider(GraphServiceClient serviceClient, string initialQuery)
        {
            ServiceClient = serviceClient;
            InitialQuery = initialQuery;
        }
        public List<T> LoadAllEntities()
        {
            PaginatedDataAccessor<T> toDoListsAccessor = new PaginatedDataAccessor<T>(ServiceClient.HttpProvider, InitialQuery, PageSize);
            List<T> result = new List<T>();
            foreach (List<T> toToLists in toDoListsAccessor)
            {
                result.AddRange(toToLists);
            }

            return result;
        }
    }
}
