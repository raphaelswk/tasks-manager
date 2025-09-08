using Business.Interfaces;

namespace Api;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IFileLogger _logger;

    public RequestLoggingMiddleware(RequestDelegate next, IFileLogger logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Log the request details before it's processed
        var request = context.Request;
        _logger.Log($"Incoming Request: {request.Method} {request.Path}");

        // Pass the request to the next middleware in the pipeline
        await _next(context);
    }
}

