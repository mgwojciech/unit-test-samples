using MGWDev.PnPFramework.UT.Helpers;
using MGWDev.PnPSDK.Lib;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using PnP.Core.Auth;
using PnP.Core.Services;
using PnP.Framework.Utilities;
using System;
using System.Collections.Generic;
using System.Text;

namespace MGWDev.PnPFramework.UT.SDK
{
    [TestClass]
    public class PnPListItemProviderTests
    {
        [TestMethod]
        public void PnPListItemProvider_Test_GetItems()
        {
            SetupSDK.DelegateToMockContext(false, Common.SiteUrl, (PnPContext context) =>
            {
                PnPListItemProvider listItemProvider = new PnPListItemProvider(context);
                var items = listItemProvider.GetMyItems();
            });
        }
    }
}
