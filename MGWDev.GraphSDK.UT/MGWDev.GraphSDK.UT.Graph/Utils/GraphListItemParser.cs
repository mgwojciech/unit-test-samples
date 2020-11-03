using MGWDev.GraphSDK.UT.Graph.FieldMapper;
using MGWDev.GraphSDK.UT.Lib.DAL;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Graph.Utils
{
    public class GraphListItemParser<T> : IListItemParser<T, ListItem> where T : new()
    {
        public string SupportedCT { get; set; }
        public Dictionary<string, IFieldMapper<object>> CustomMappers { get; set; } = new Dictionary<string, IFieldMapper<object>>()
        {
            {"Author", new AuthorFieldMapper()},
            {"Editor", new EditorFieldMapper()},
            {"Created", new DateTimeMapper("Created")},
            {"Modified", new DateTimeMapper("Modified")},
            {"Id", new IDFieldMapper()}
        };
        public GraphListItemParser(string associatedContentTypeId)
        {
            SupportedCT = associatedContentTypeId;
        }
        public virtual T ParseItem(ListItem sourceObj)
        {
            if (sourceObj.ContentType.Id.StartsWith(SupportedCT))
            {
                T entity = new T();
                foreach (var propertyInfo in typeof(T).GetProperties())
                {
                    try
                    {
                        object graphValue = null;
                        if (CustomMappers.ContainsKey(propertyInfo.Name))
                        {
                            graphValue = CustomMappers[propertyInfo.Name].MapField(sourceObj);
                        }
                        else if (sourceObj.Fields.AdditionalData.ContainsKey(propertyInfo.Name))
                        {
                            graphValue = sourceObj.Fields.AdditionalData[propertyInfo.Name];
                        }
                        propertyInfo.SetValue(entity, graphValue);
                    }
                    catch (Exception ex)
                    {
                        //TODO: proper logging
                    }
                }

                return entity;
            }
            return default(T);
        }
    }
}
