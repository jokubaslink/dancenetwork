import { UseAuth } from "@/context/AuthContext";
import SidebarLink from "./SidebarLink";
import {
  Logout,
  AccountBox,
  Bookmarks,
  DynamicFeed,
  Search
} from "@mui/icons-material";

export default function Sidebar({ profile }) {
  const { logOut, currentUser } = UseAuth();

  return (
    <>
      <div className="flex lg:hidden w-full flex-col pt-2 sticky top-0 ">
        <div className="flex flex-col items-center space-y-8">
          {currentUser ? (<SidebarLink text={<DynamicFeed />} href={`/`} />) : (<SidebarLink text={<Search />} href={'/'} />)}
          {currentUser && (
            <>
              <SidebarLink
                text={<AccountBox />}
                href={`/user/${currentUser.uid}`}
              />
              <SidebarLink
                text={<Bookmarks />}
                href={`/user/${currentUser.uid}/bookmarks`}
              />
              <SidebarLink text={<Logout />} click={logOut} />
            </>
          )}
        </div>
      </div>

      <div className="hidden lg:flex w-full flex-col pt-8 sticky top-0">
        <div className="flex flex-col space-y-8">
          {currentUser ? (<SidebarLink text="Feed" icon={<DynamicFeed />} href={`/`} />) : (<SidebarLink text="Search" icon={<Search />} href={`/`} />)}
          {currentUser && (
            <>
              <SidebarLink text="Profile" icon={<AccountBox />} href={`/user/${currentUser.uid}`} />
              <SidebarLink
                text="Bookmarks"
                href={`/user/${currentUser.uid}/bookmarks`}
                icon={<Bookmarks />}
              />
              <SidebarLink icon={<Logout />} text="Logout" href={null} click={logOut} />{" "}
            
            </>
          )}
        </div>
      </div>
    </>
  );
}
