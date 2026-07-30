import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from "@/components/Layout.jsx";
import Home from "@/pages/Home.jsx";
import About from "@/pages/About.jsx";
import Contact from "@/pages/Contact.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;