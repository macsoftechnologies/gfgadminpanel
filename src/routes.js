import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import TableList from "views/Tables.js";
import Maps from "views/Map.js";
import UpgradeToPro from "views/Upgrade.js";
import Merchant from "views/Merchant";
import Customer from "views/Customer";
import Products from "views/Products";
import Advertisements from "views/Advertisements";
import Login from "views/Login";
import Categories from "views/Categories";


var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/Customers",
    name: "Customer",
    icon: "nc-icon nc-single-02",
     
    component: <Customer />,
    layout: "/admin",
  },
  
  {
    path: "/Merchant",
    name: "Merchant",
    icon: "nc-icon nc-shop",
    component: <Merchant />,
    layout: "/admin",
  },

  {
    path: "/Categories",
    name: "Categories",
    icon: "nc-icon nc-tag-content",
    component: <Categories />,
    layout: "/admin",
  },
  
  {
    path: "/Products",
    name: "Products",
    icon: "nc-icon nc-basket",
    component: <Products />,
    layout: "/admin",
  },

  {
    path: "/Advertisements",
    name: "Advertisements",
    icon: "nc-icon nc-laptop",
    component: <Advertisements />,
    layout: "/admin",
  },
 
   
];
export default routes;
