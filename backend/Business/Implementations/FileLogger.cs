using Business.Interfaces;

namespace Business.Implementations;

/// <summary>
/// Implements the IFileLogger interface to write log messages to text files.
/// This class is registered as a singleton in the DI container, ensuring that
/// a single instance is used throughout the application's lifetime.
/// </summary>
public class FileLogger : IFileLogger
{
    private readonly string _logFilePath = "api_requests.log";
    private readonly string _criticalLogFilePath = "critical_updates.log";
    private static readonly object _lock = new();

    public void Log(string message)
    {
        // Use a lock to prevent race conditions when writing to the file from multiple threads.
        lock (_lock)
        {
            File.AppendAllText(_logFilePath, $"{DateTime.UtcNow:O} - {message}{Environment.NewLine}");
        }
    }

    public void LogCritical(string message)
    {
        lock (_lock)
        {
            File.AppendAllText(_criticalLogFilePath, $"{DateTime.UtcNow:O} - {message}{Environment.NewLine}");
        }
    }
}

