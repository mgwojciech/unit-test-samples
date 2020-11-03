using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Lib.Model
{
    public class Order : SPListItem
    {
        public string OrderNumber { get; set; }
        public DateTime DeliveryDate { get; set; }
    }
}
