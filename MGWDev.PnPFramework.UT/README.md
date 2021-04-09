## PnPFramework.UT

This is the simplest possible sample on how to use Unit Test framework shipped with PnPFramework. In this sample we will test ListItemProvider class.
This simple class gets all list items from specific list. Note that this is not the best possible implementation, however it will suit our sample.
By default ListItemProvider_Test_GetItems_Integration test will fail as there are no credentials provided.

## One does not simply test CSOM

### Background
If we would like to go by the book, the ideal scenario would be to generate mocks and stubs for each object and method in CSOM or operate in our production code
on our model and map between it and CSOM. This approach would leave vast percentage of code untested and add additional complexity in mapping classes. 
Clearly it would not be an ideal solution.

### Technical solution
The solution I came up with is to replace the middle man. ClientContext exposes WebRequestExecutorFactory property which we can laverage.
Instead of using default implementation we can inject our own. The only problem left is how to keep compatibility between reponse we would provide and CSOM.

# Sample walk through

## ListItemProviderTests
In this class we will basically need to mock only one thing in CSOM - GetItems method. I provided sample of three approaches.

### ListItemProvider_Test_GetItems_MockResponse
This unit test is a sample for experimental ResponseProvider. MockEntryResponseProvider will try to generate response on the fly for provided method.
This is the only was to try TDD approach, however creating MockResponseEntry object requires deep knowledge of CSOM objects.

### ListItemProvider_Test_GetItems_Integration
For this sample You have to provide your user name, password and site You want to run test against. Basically it will call the site and save all responses
for later usage (factory.SaveMockData()). In this form it is not a unit test and I strongly recommend against commiting such unit test in Your project.
To make most of it, run this test once in integration mode and the use stored file.
The downside of this approach is that changing the order of assigning managed objects may break the test. This would not be a problem in previous approach.

### ListItemProvider_Test_GetItems_UseStoredFile
This is the simplest way to start with Your unit tests. Write integration test first and then use the saved file.

Hope You enjoy writing Your own unit tests. More sample to come!

## SetupSDK
In this class I register proper mocking to DI service. Implementation of MockHttpHandler can be found [here]( https://github.com/pnp/pnpframework/blob/dev/src/lib/PnP.Framework/Utilities/UnitTests/Web/MockHttpHandler.cs) and implementation of StoreResponseToAFile message handler is also a part of [PnPFramework](https://github.com/pnp/pnpframework/blob/dev/src/lib/PnP.Framework/Utilities/UnitTests/Web/StoreResponseToAFile.cs)
Besides this I register SharePointRESTClient and MicrosoftGraphClient to use HttpClient mocked with one of those two.
Finally I register authentication provider. If we don't run in integration mode, it's enough to provide simple mock provider.
To make sure all resources are properly managed (garbage collected) I opted to create and dispose ServiceScope as well as PnPContext itself. Feel free to implement it differently in Your solutions.
