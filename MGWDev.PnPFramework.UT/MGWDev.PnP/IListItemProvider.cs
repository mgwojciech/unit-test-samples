using MGWDev.PnP.Model;
using System;
using System.Collections.Generic;

namespace MGWDev.PnP
{
    public interface IListItemProvider<T>
    {
        List<T> GetMyItems();
        void UpdateItem(T item);
    }
}
