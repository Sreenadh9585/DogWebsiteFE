# Dog Match App

This project is publicly available at :https://radiant-palmier-1f818e.netlify.app/

This is a web application where users can log in, search for dogs available for adoption, filter the search results, and find a potential match from their favorite dogs.

## Features

- **Login Page**: Users can enter their name and email to authenticate.
- **Search Page**: Users can browse dogs and filter by breed.
  - Paginated results with sorting options (alphabetically by breed by default).
  - Users can filter by breed and sort the results in ascending or descending order.
  - Display detailed dog information (except for the dog ID).
  - Users can select their favorite dogs and generate a match.
- **Match Generation**: Users can send their selected favorite dog IDs to generate a match.

## Future Work

- **Location-Based Filtering**: This feature will allow users to filter dogs by location (city, state, or zip code).

## Technologies Used

- **Frontend**: React (or any other modern frontend framework)
- **Backend**: Fetch API (RESTful calls to the provided API)
- **State Management**: React Context, Redux, or similar (optional)
- **Styling**: CSS, SCSS, or a component library like Material-UI or TailwindCSS
- **Deployment**: Deployed using [Netlify](https://www.netlify.com/) or any other hosting provider.

## API Reference

### Authentication

- **POST /auth/login**
  - Body: `{ "name": "string", "email": "string" }`
  - Response: `200 OK` (with an auth cookie `fetch-access-token`)

- **POST /auth/logout**
  - Logs out the user and invalidates the auth cookie.

### Dog Search

- **GET /dogs/breeds**
  - Returns an array of available breed names.

- **GET /dogs/search**
  - Query Parameters:
    - `breeds` (optional): Array of breed names to filter.
    - `zipCodes` (optional): Array of zip codes.
    - `ageMin` (optional): Minimum age.
    - `ageMax` (optional): Maximum age.
    - `size` (optional): Number of results to return (default is 25).
    - `from` (optional): Cursor for pagination.
    - `sort` (optional): Sorting field and direction (`sort=breed:asc`).

  - Returns:
    - `resultIds`: Array of dog IDs matching the query.
    - `total`: Total number of results.
    - `next`: Cursor for the next page of results.
    - `prev`: Cursor for the previous page of results.

- **POST /dogs**
  - Body: Array of dog IDs to fetch.
  - Returns: Array of dog objects.

- **POST /dogs/match**
  - Body: Array of dog IDs to generate a match.
  - Returns: `match`: ID of the matched dog.

### Prerequisites

- Node.js (version 16 or above)
- npm or yarn (package manager)
