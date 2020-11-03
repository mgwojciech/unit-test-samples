using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Lib.DAL
{
    public interface IListItemParser<out T, U>
    {
        string SupportedCT { get; set; }
        T ParseItem(U sourceObj);
    }
}
