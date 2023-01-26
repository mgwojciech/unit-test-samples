using System.Security;

namespace MGWDev.FullStack.Web.Utilities;

public class StringUtilities
{
    public static SecureString CovertToSecureString(string value)
    {
        string secret = value;
        SecureString secure = new SecureString();
        foreach (char c in secret)
        {
            secure.AppendChar(c);
        }
        return secure;
    }
}