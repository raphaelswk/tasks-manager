namespace Business.Interfaces;

/// <summary>
/// Defines the contract for a file logging service.
/// This interface is used by the Business layer to log information without
/// knowing the specific implementation details.
/// </summary>
public interface IFileLogger
{
    /// <summary>
    /// Logs a general request message.
    /// </summary>
    /// <param name="message">The message to log.</param>
    void Log(string message);

    /// <summary>
    /// Logs a critical event message to a separate, dedicated log file.
    /// </summary>
    /// <param name="message">The critical message to log.</param>
    void LogCritical(string message);
}
