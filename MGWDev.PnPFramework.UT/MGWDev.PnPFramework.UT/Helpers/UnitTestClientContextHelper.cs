using Microsoft.SharePoint.Client;
using PnP.Framework.Utilities.UnitTests.Helpers;
using PnP.Framework.Utilities.UnitTests.Web;
using System;
using System.Collections.Generic;
using System.Text;

namespace MGWDev.PnPFramework.UT.Helpers
{
    public class UnitTestClientContextHelper
    {
        public static MockExecutorFactory BuildExecutorFactory(bool runInIntegration, string mockFilePath)
        {
            FileMockResponseRepository repo = new FileMockResponseRepository(mockFilePath);
            MockResponseProvider responseProvider = new MockResponseProvider(repo.LoadMockData());
            return new MockExecutorFactory(responseProvider, repo, runInIntegration);
        }
    }
}
