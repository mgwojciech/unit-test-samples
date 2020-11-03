using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Lib.DAL
{
    public interface IListItemProvider<T>
    {
        IEnumerable<T> GetListItems(string listId, string query = "");
    }
}
