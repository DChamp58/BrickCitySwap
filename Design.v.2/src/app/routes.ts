import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { Housing } from "./pages/Housing";
import { Marketplace } from "./pages/Marketplace";
import { SignIn } from "./pages/SignIn";
import { Profile } from "./pages/Profile";
import { Post } from "./pages/Post";
import { Listings } from "./pages/Listings";
import { Messages } from "./pages/Messages";
import { Pricing } from "./pages/Pricing";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { 
        index: true, 
        Component: Home 
      },
      { 
        path: "housing", 
        Component: Housing 
      },
      { 
        path: "marketplace", 
        Component: Marketplace 
      },
      { 
        path: "pricing", 
        Component: Pricing 
      },
      { 
        path: "signin", 
        Component: SignIn 
      },
      { 
        path: "profile", 
        Component: Profile 
      },
      { 
        path: "post", 
        Component: Post 
      },
      { 
        path: "listings", 
        Component: Listings 
      },
      { 
        path: "messages", 
        Component: Messages 
      },
      {
        path: "*",
        Component: NotFound
      }
    ],
  },
]);