using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Graph.FieldMapper
{
    public interface IFieldMapper<out T>
    {
        T MapField(ListItem listItem);
    }
}
