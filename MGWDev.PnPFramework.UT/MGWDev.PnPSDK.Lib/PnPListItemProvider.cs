using MGWDev.PnP;
using MGWDev.PnP.Model;
using PnP.Core.Model.SharePoint;
using PnP.Core.Services;
using System;
using System.Collections.Generic;

namespace MGWDev.PnPSDK.Lib
{
    public class PnPListItemProvider : IListItemProvider<MyTestListItem>
    {
        protected PnPContext Context { get; set; }
        protected string ListTitle { get; set; } = "DevList";
        public PnPListItemProvider(PnPContext context)
        {
            Context = context;
        }
        public List<MyTestListItem> GetMyItems()
        {
            IList list = Context.Web.Lists.GetByTitle(ListTitle);
            IListItemCollection collection = list.Items;

            List<MyTestListItem> result = new List<MyTestListItem>();
            foreach(IListItem item in collection)
            {
                result.Add(new MyTestListItem()
                {
                    Id = item.Id,
                    Modified = (DateTime)item["Modified"],
                    Title = item.Title
                });
            }

            return result;
        }

        public void UpdateItem(MyTestListItem item)
        {
            throw new NotImplementedException();
        }
    }
}
