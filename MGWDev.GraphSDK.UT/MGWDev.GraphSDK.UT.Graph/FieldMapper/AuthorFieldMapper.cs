using MGWDev.GraphSDK.UT.Lib.Model;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Graph.FieldMapper
{
    public class AuthorFieldMapper : IFieldMapper<FieldUser>
    {
        public FieldUser MapField(ListItem listItem)
        {
            return new FieldUser()
            {
                DisplayName = listItem.CreatedBy.User.DisplayName,
                Id = listItem.CreatedBy.User.Id,
                Email = listItem.CreatedBy.User.AdditionalData["email"].ToString(),
                SPId = int.Parse(listItem.Fields.AdditionalData["AuthorLookupId"].ToString())
            };
        }
    }
    public class EditorFieldMapper : IFieldMapper<FieldUser>
    {
        public FieldUser MapField(ListItem listItem)
        {
            return new FieldUser()
            {
                DisplayName = listItem.LastModifiedBy.User.DisplayName,
                Id = listItem.LastModifiedBy.User.Id,
                Email = listItem.LastModifiedBy.User.AdditionalData["email"].ToString(),
                SPId = int.Parse(listItem.Fields.AdditionalData["EditorLookupId"].ToString())
            };
        }
    }
}
