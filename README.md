# unit-test-samples
This repository will try to present to You how You can start unit testing in Your project.
If You have any questions or You want me to create specific sample create new issue or ping me on twitter @mgwojciech 

# MGWDev.GraphSDK.UT (.NET)
This solution shows how You can use mock IHttpProvider to test the part of Your code that uses Microsoft Graph SDK.

## Overview
There are two mock classes implemented in the unit test project MockAuthenticationHelper and MockHttpProvider.
The first one is just simple stub for IAuthenticationProvider and is not relevant to the rest of the example.

The other class is MockHttpProvider which is the heart of the solution. There are two ways to provide mock data to the provider. 
First one, for simple scenarios, You just add new entry in Responses Dictionary.
The other is adding result to Result property in MockRequestExecutingEventArgs on OnRequestExecuting.

Both of those are used in unit-tests-samples\MGWDev.GraphSDK.UT\MGWDevGraphSDK.UT.Tests\Graph\MeEndpointTests.cs

## Real-world example

Let us consider following scenario. We need to implement OrderManager class which will get the orders created by current user.
To do that we will call Office Graph API /me endpoint, then get the user id on site on which the list is provisioned and the query for the list items.

The data access layer is abstracted so we can write OrderManager unit tests without even thinking of Graph SDK.
We can just create MockOrderProvider and MockUserInfoProvider and inject them in OrderManager.

Interesting case is GraphUserInfoProvider (unit-tests-samples\MGWDev.GraphSDK.UT\MGWDev.GraphSDK.UT.Graph\DAL\GraphUserInfoProvider.cs). 
There is some logic there to query two different method and compose new object. 
You can find a test for that in unit-tests-samples\MGWDev.GraphSDK.UT\MGWDevGraphSDK.UT.Tests\Graph\GraphUserInfoProviderTests.cs

GraphListItemProviderTests class is event a little bit more complex as there are FieldMapper classes that map the ListItem object to Domain entities.
Thanks to that our domain code will never have to be aware of the details implementation of data access layer.
You can find how I setup the test in unit-tests-samples\MGWDev.GraphSDK.UT\MGWDevGraphSDK.UT.Tests\Graph\GraphListItemProviderTests.cs

# message-bar (SPFx)
This solution demonstrates how You can easily mock webpart/extension context in Your components as well as in the data access layer.
There are multiple approaches to unit tests in the solution, You can read about it more in a series on my [blog](https://mgwdevcom.wordpress.com/2020/02/17/extend-spfx-solution-testability-lets-start)

# team-calendar (SPFx)
This sample is focused on Office Graph API mock. The implemented web part gets teams context either from WebPartContext or from query string and uses groupId to query Graph API endpoint for events in this group.
Due to the nature of ootb graph client we have to mock three classes (GraphClient, GraphClientFactory and GraphRequest). Note, I implemented only methods I needed in my tests, thanks to that, the solution is quite light.
Similarly to the .NET solution, we can use Graph Explorer to quickly create mocks for our requests. 

# copy-item-list-ext
See [Read me](https://github.com/mgwojciech/unit-test-samples/blob/main/copy-item-list-ext/README.md)

# PnPFramework.UT
See [Read me](https://github.com/mgwojciech/unit-test-samples/blob/main/MGWDev.PnPFramework.UT/README.md)
