class ApiResponse {
  constructor(statusCode, message = "Success", data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode >= 200 && statusCode < 400;
  }
}

export { ApiResponse };
// The ApiResponse class is a simple class that takes a status code, message, and data as arguments and returns a new object with these properties.
//The success property is a boolean that indicates whether the status code is in the 200-399 range.
//This class is used to create a consistent response format for the API.
