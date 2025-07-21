import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AuthHandler from "@/Handler/AuthHandler";
import { Outlet } from "react-router-dom";




function PublicLayout() {
  return (
    <div className = "w-full">
      <AuthHandler/>
      <Header />

      {/* {to render the child route but only one  outlet renders} */}
      <Outlet />   
      <Footer />
    </div>
  )
}

export default PublicLayout;