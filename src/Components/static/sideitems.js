import { MdDashboard } from "react-icons/md";
import { FaUser, FaUsers, FaSignOutAlt, FaUserPlus, FaBlog } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { TiMessages } from "react-icons/ti";


export const Items = [
  {
    id: 1,
    title: "Dashboard",
    icon: <MdDashboard />,
    link: "/dashboard",
  },
  {
    id: 2,
    title: "About Us",
    icon: <FaUser />,
    link: "/aboutus",
  },
  {
    id: 3,
    title: "Users",
    icon: <FaUsers />,
    link: "/users",
  },
  {
    id: 7,
    title: "Chats",
    icon: <TiMessages />,
    link: "/Chats",
  },
  {
    id: 4,
    title: "Active Users",
    icon: <FaUserPlus />,
    link: "/active_users",
  },
  {
    id: 5,
    title: "Blogs",
    icon: <FaBlog />,
    link: "/blogs",
  },
  {
    id: 6,
    title: "Add Blogs",
    icon: <IoAdd />,
    link: "/add_blogs",
  },
  
];
