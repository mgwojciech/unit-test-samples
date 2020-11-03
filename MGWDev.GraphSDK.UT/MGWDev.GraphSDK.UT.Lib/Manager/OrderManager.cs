using MGWDev.GraphSDK.UT.Lib.DAL;
using MGWDev.GraphSDK.UT.Lib.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Lib.Manager
{
    public class OrderManager
    {
        protected IListItemProvider<Order> OrderProvider { get; }
        protected IUserInfoProvider UserInfoProvider { get; }
        public string OrdersListId { get; set; } = "9e83134e-aa7e-43a2-940c-18e10a666d0e";
        public OrderManager(IListItemProvider<Order> orderProvider, IUserInfoProvider userInfoProvider)
        {
            OrderProvider = orderProvider;
            UserInfoProvider = userInfoProvider;
        }
        public IEnumerable<Order> GetUserOrders()
        {
            FieldUser currentUser = UserInfoProvider.GetCurrentUserInfo();
            return OrderProvider.GetListItems(OrdersListId, $"fields/AuthorLookupId eq '{currentUser.SPId}'");
        }
    }
}
