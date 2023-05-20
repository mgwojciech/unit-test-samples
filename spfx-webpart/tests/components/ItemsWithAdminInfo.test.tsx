///<reference types="jest" />
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import { ItemsWithAuthorDetailsManager } from '../../src/manager/ItemsWithAuthorDetailsManager';
import { IItemWithAuthor } from '../../src/model/IItemWithAuthor';
import { ItemsWithAdminInfo } from "../../src/components/ItemsWithAdminInfo";

describe("ItemsWithAdminInfo", () => {
  let mockManager: ItemsWithAuthorDetailsManager;
  let mockItems: IItemWithAuthor[];

  beforeEach(() => {
    // Mock data
    mockItems = [{
      Id: 1,
      Title: "Test Item",
      Author: {
        Title: "Author 1",
        JobTitle: "Job Title 1",
        IsSiteAdmin: true
      }
    } as IItemWithAuthor, {
      Id: 2,
      Title: "Test Item 2",
      Author: {
        Title: "Author 2",
        JobTitle: "Job Title 2",
        IsSiteAdmin: false
      }
    } as IItemWithAuthor];

    // Mock manager
    mockManager = {
      getItemsWithAuthorDetails: jest.fn().mockResolvedValue(mockItems)
    } as unknown as ItemsWithAuthorDetailsManager;
  });

  it("should display spinner when loading", async () => {
    mockManager.getItemsWithAuthorDetails = jest.fn().mockReturnValue(new Promise(() => {}));
    render(<ItemsWithAdminInfo manager={mockManager} />);
    
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it("should display items when loaded", async () => {
    render(<ItemsWithAdminInfo manager={mockManager} />);
    
    await waitFor(() => {
      expect(screen.getByText(mockItems[0].Title)).toBeInTheDocument();
      expect(screen.getByText(mockItems[1].Title)).toBeInTheDocument();
      expect(screen.getByText(mockItems[0].Author.Title)).toBeInTheDocument();
      expect(screen.getByText(mockItems[1].Author.Title)).toBeInTheDocument();
      // Add more assertions as needed
    });
  });

  it("should handle error when getting items fails", async () => {
    mockManager.getItemsWithAuthorDetails = jest.fn().mockRejectedValue(new Error("Test Error"));
    console.log = jest.fn();
    render(<ItemsWithAdminInfo manager={mockManager} />);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(new Error("Test Error"));
    });
  });
});
