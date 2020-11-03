using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Graph.FieldMapper
{
    public class DateTimeMapper : IFieldMapper<object>
    {
        public string ColumnName { get; protected set; }
        public DateTimeMapper(string columnName)
        {
            ColumnName = columnName;
        }
        public object MapField(ListItem listItem)
        {
            return DateTime.Parse(listItem.Fields.AdditionalData[ColumnName].ToString());
        }
    }
}
