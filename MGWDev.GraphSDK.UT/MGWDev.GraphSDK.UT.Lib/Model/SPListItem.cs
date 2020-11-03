using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Lib.Model
{
    public class SPListItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime Modified { get; set; }
        public DateTime Created { get; set; }
        public FieldUser Author { get; set; }
        public FieldUser Editor { get; set; }
    }
}
