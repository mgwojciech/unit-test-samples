using MGWDev.PnP;
using MGWDev.PnP.Model;
using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MGWDev.PnPFramework.Lib
{
    public class ListItemProvider : IListItemProvider<MyTestListItem>
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
        public void UpdateItem(MyTestListItem item)
        {
            CamlQuery camlQuery = new CamlQuery()
            {
                ViewXml = $"<View><Query><Where><Eq><FieldRef Name='ID' /><Value Type='Counter'>{item.Id}</Value></Eq></Where></Query></View>"
            };
            List approvedTabsList = Context.Web.Lists.GetByTitle(ListTitle);
            ListItemCollection approvedTabs = approvedTabsList.GetItems(camlQuery);
            Context.Load(approvedTabs);
            Context.ExecuteQuery();

            ListItem approvedTabItem = approvedTabs.FirstOrDefault();
            if (approvedTabItem == null)
            {
                ListItemCreationInformation approvedTabCI = new ListItemCreationInformation();
                approvedTabItem = approvedTabsList.AddItem(approvedTabCI);
            }
            approvedTabItem["Title"] = item.Title;

            approvedTabItem.Update();
            Context.ExecuteQuery();
        }
    }
}
