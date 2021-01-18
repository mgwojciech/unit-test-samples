## copy-item-list-ext

To execute tests run npx jest --coverage

This sample is list view extension. Once You deploy it to Your site collection You will be able to select few list items and copy them (with possibility to exclude few fields).
Note You might need to change ListTemplateId.

## Testing approach
Note we are not testing the display layer. 
This sample is really heavy on single resposibility principal. Thanks to that the classes are small and easy to mock, so easy I didn't even implement proper mock for most of them. 
This also helps with the coverage, as it's really easy to mock all the different scenarios that can happen. Good example will be test suite tests\utils\ListItemUtility.test.ts where I was able to test every if branch by providing vast possibilities of the post response.
