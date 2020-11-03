using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Graph.FieldMapper
{
    public class IDFieldMapper : IFieldMapper<object>
    {
        public object MapField(ListItem listItem)
        {
            return int.Parse(listItem.Id);
        }
    }
}
