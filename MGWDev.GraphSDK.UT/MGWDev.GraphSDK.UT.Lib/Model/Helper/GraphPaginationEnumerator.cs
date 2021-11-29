using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Lib.Model.Helper
{
    public class GraphPaginationEnumerator<T> : IEnumerator<List<T>>
    {
        public int CurrentPage { get; set; } = -1;
        public int PageSize { get; set; }
        public int AllPages
        {
            get
            {
                return AllItems.Count / PageSize;
            }
        }
        public List<T> AllItems { get; set; }
        public List<T> Current
        {
            get
            {
                return AllItems.Skip(CurrentPage * PageSize).Take(PageSize).ToList();
            }
        }

        object IEnumerator.Current
        {
            get
            {
                return Current;
            }
        }

        public GraphPaginationEnumerator(List<T> items, int pageSize = 10)
        {
            AllItems = items;
            PageSize = pageSize;
        }

        public void Dispose()
        {
        }
        public bool MoveNext()
        {
            CurrentPage++;
            return (CurrentPage < AllPages);
        }

        public void Reset()
        {
            CurrentPage = -1;
        }
    }
}
