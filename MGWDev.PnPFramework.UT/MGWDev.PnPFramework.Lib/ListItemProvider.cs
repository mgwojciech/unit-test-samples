using MGWDev.PnPFramework.Lib.Model;
using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MGWDev.PnPFramework.Lib
{
    public class ListItemProvider
    {
        public ClientContext Context { get; protected set; }
        protected string ListTitle { get; set; } = "DevList";
        public ListItemProvider(ClientContext context)
        {
            Context = context;
        }
        public List<MyTestListItem> GetMyItems()
        {
            List list = Context.Web.Lists.GetByTitle(ListTitle);
            CamlQuery camlQuery = CamlQuery.CreateAllItemsQuery();
            ListItemCollection coll = list.GetItems(camlQuery);

            Context.Load(coll);
            Context.ExecuteQuery();
            return coll.ToList().Select(item => new MyTestListItem()
            {
                Id = item.Id,
                Title = item["Title"]?.ToString(),
                Modified = item.LastModifiedDateTime()
            }).ToList();
        }
    }
}
