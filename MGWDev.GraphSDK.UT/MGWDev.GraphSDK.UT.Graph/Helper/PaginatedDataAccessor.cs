using Microsoft.Graph;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Graph.Helper
{
    public class PaginatedDataAccessor<T> : IEnumerable<List<T>>
    {
        public int PageSize { get; protected set; }
        public IHttpProvider HttpProvider { get; protected set; }
        public string EntityEndpoint { get; protected set; }
        protected GraphPaginationEnumerator<T> CurrentEnumerator { get; set; }
        public PaginatedDataAccessor(IHttpProvider provider, string entityEndpoint, int pageSize = 10)
        {
            HttpProvider = provider;
            EntityEndpoint = entityEndpoint;
            PageSize = pageSize;
        }
        public IEnumerator<List<T>> GetEnumerator()
        {
            CurrentEnumerator = new GraphPaginationEnumerator<T>(HttpProvider, EntityEndpoint, PageSize);
            return CurrentEnumerator;
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}
