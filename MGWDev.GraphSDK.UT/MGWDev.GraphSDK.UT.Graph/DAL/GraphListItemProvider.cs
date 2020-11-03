using MGWDev.GraphSDK.UT.Graph.Utils;
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
    public class GraphListItemProvider<T> : IListItemProvider<T> where T : SPListItem, new()
    {
        public GraphServiceClient ServiceClient { get; protected set; }
        public string SiteId { get; set; }
        protected IListItemParser<T, ListItem> ItemParser { get; set; }

        public GraphListItemProvider(string siteId, GraphServiceClient serviceClient, IListItemParser<T, ListItem> parser = null)
        {
            ServiceClient = serviceClient;
            SiteId = siteId;
            if (parser == null)
            {
                parser = new GraphListItemParser<T>("0x01");
            }

            ItemParser = parser;
        }
        public IEnumerable<T> GetListItems(string listId, string query = "")
        {
            IListItemsCollectionRequest listItemsCollectionRequest = ServiceClient.Sites[SiteId].Lists[listId].Items.Request();
            if(!String.IsNullOrEmpty(query))
            {
                listItemsCollectionRequest = listItemsCollectionRequest.Filter(query);
            }
            IListItemsCollectionPage listItems = listItemsCollectionRequest.Expand(listItem => listItem.Fields).GetAsync().Result;
            return ParseEntity(listItems);
        }
        private IEnumerable<T> ParseEntity(IListItemsCollectionPage listItems)
        {
            List<T> resultList = new List<T>();
            foreach (ListItem item in listItems)
            {
                T entity = ItemParser.ParseItem(item);
                resultList.Add(entity);
            }

            return resultList;
        }
    }
}
