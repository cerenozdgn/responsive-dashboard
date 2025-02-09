# Responsive Dashboard

The task involves building a frontend interface that fetches and displays a list of scanning tools from an API, providing a user-friendly experience.

## Features

- **Responsive Design**: The app is fully responsive, ensuring it functions smoothly across various screen sizes (desktop, tablet, mobile).
- **Dark/Light Mode**: Includes a toggle for switching between dark and light themes.
- **Tool List Table**: The main feature of the app is a table displaying scanning tools, with filtering and pagination.
- **Search and Filter**: Users can filter the tools based on categories and perform searches to refine the results.
- **State Persistence**: The selected search filters remain intact across page refreshes and even when the browser is closed and reopened.

## Design Considerations

- The design is minimalistic with a sidebar containing a logo and a header with the theme toggle (dark/light).
- The table is designed to display tool information clearly, including tool names, descriptions, scores, and types.
- The app is optimized for mobile use and maintains a clean, intuitive user interface.

## API Integration

The scanning tool data is fetched from the S4E.io API using `axios`. The following API request format was used to retrieve the data:

```javascript
const response = await axios.post(
  "https://thingproxy.freeboard.io/fetch/https://api.s4e.io/api/scan/list",
  requestData,
  {
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
  }
);
```

## API Request Parameters

The following parameters are included in the API request:

- scan_parent_id and scan_category_id: Initially used in the request but removed after testing found that the response would be empty when they were included, despite the status code returning 200 OK.
- query: A string to search for specific terms (e.g., "cve").
- min_score: The minimum score filter for the tool rating.
- max_score: The maximum score filter for the tool rating.
- page: The current page number for pagination.
- per_page: The number of items to display per page.
- tag_slug: The tag used to categorize the tools.
- precondition_status: The status filter for the precondition of the tool.
- token: The API token for authentication.

## API Response

The API returns a list of scanning tools with the following data:

- Name: The name of the tool.
- Description: A brief description of what the tool does.
- Score: A numerical score (ranging from 0 to 10) representing the effectiveness or rating of the tool.
- Asset Type: Specifies the types of assets the tool can scan (e.g., domain, ipv4).

## Installation and Running

1.  Clone the project repository:

    ```bash
    git clone <repository_url>
    ```

2.  Go to the project directory:

    ```bash
    cd <project_directory>
    ```

3.  Install dependencies:

    ```bash
    npm install or yarn install or pnpm install
    ```

4.  Start the application:

    ```bash
    npm run dev or yarn dev or pnpm dev
    ```

The application will usually run at `http://localhost:5173`.

## API Integration and Challenges Encountered

The following endpoint was used for accessing the S4E.io API:

https://thingproxy.freeboard.io/fetch/https://api.s4e.io/api/scan/list

**Important Note:** Because a CORS error was encountered in direct requests to the original API, a request was made through a proxy using `thingproxy.freeboard.io`. This is a temporary solution during the development phase. An appropriate CORS solution should be implemented in the production environment (e.g., CORS configuration on the backend side or using your own proxy server).

Unexpected results (empty data return) were received in requests made with the `scan_parent_id` and `scan_category_id` parameters specified in the API documentation, so these parameters were removed from the request. 

Example response from the API:

```json
{
    "code": 200,
    "message": "",
    "error": false,
    "event": {},
    "value": {
        "data": [
            {
                "auto_desc": null,
                "mini_desc": "You can scan DNS server by using this tool.",
                "if_api_support": true,
                "slug": "dns-zeus-tracker-scanner",
                "score": 10,
                "created_at": "2021-06-24T11:53:07.615460",
                "name": "DNS Zeus Tracker Scanner",
                "asset_type": "domain,ipv4",
                "estimate_time": 15,
                "protocol_id": null,
                "result_img": "",
                "meta_title": "DNS Zeus Tracker Scanner"
            }
        ],
        "total_count": 16
    }
}
```



## Conclusion
- This project demonstrates how to build a clean, responsive frontend that integrates with an external API to display dynamic data. The app includes features like 
 dark/light mode, persistent filters, and an intuitive interface for interacting with scanning tools. 

