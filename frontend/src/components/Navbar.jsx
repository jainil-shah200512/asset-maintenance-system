import { useNavigate, useLocation } from "react-router-dom";
import { clearAuthData, getFullName, getRole } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const fullName = getFullName();
  const role = getRole();


  const dashboardPath =
    role === "MANAGER"
      ? "/manager"
      : role === "TECHNICIAN"
      ? "/technician"
      : role === "ADMIN"
      ? "/admin"
      : "/user";



  const isTasksActive = location.pathname.startsWith("/tasks");
  const isAssetsActive = location.pathname.startsWith("/assets");
  const isStaffActive = location.pathname.startsWith("/staff");
  const isAdminActive = location.pathname.startsWith("/admin")


  const navButtonClass = (active) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      active ? "bg-white text-slate-900" : "text-white hover:bg-slate-800"
    }`;

  const handleLogout = () => {
    clearAuthData();
    navigate("/");
  };

  return (
    <nav className="w-full bg-slate-900 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold sm:text-xl">Asset Maintenance</h1>
            <p className="text-xs text-slate-300 sm:text-sm">{role} Dashboard</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-6">
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(dashboardPath)}
              className={navButtonClass(location.pathname === dashboardPath)}
            >
              Dashboard
            </button>
            
            {role !== "ADMIN" && (
              <>
                <button
                  onClick={() => navigate("/tasks")}
                  className={navButtonClass(isTasksActive)}
                >
                  Tasks
                </button>
            
                <button
                  onClick={() => navigate("/assets")}
                  className={navButtonClass(isAssetsActive)}
                >
                  Assets
                </button>
              </>
            )}
          
            {role === "MANAGER" && (
              <button
                onClick={() => navigate("/staff")}
                className={navButtonClass(isStaffActive)}
              >
                Staff
              </button>
            )}
          
            {role === "ADMIN" && (
              <button
                onClick={() => navigate("/admin")}
                className={navButtonClass(isAdminActive)}
              >
                Admin
              </button>
            )}
          </div>


          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{fullName}</p>
              <p className="text-xs text-slate-300">{role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;