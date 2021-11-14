# spfx-ut-lib-sample

## Summary

Short sample on how to use spfx-ut-library to write unit tests for data access layer.
There are two tests:
tests\dal\SPPageProvider.test.ts - which is simple test that mocks one call to SP for a SharePoint page
tests\dal\ExternalEntityProvider.test.ts - mocks requests to SharePoint tenant properties, provides mocked access token and results from external endpoint.

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.11-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)


## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **npx jest**

## References

- [spfx-ut-library](https://www.npmjs.com/package/spfx-ut-library)