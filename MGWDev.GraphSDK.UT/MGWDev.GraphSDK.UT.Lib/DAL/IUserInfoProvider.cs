using MGWDev.GraphSDK.UT.Lib.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MGWDev.GraphSDK.UT.Lib.DAL
{
    public interface IUserInfoProvider
    {
        FieldUser GetCurrentUserInfo();
        FieldUser GetUserInfo(string userLogin);
    }
}
