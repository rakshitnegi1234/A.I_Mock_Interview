import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Container } from "lucide-react";
import { Outlet } from "react-router-dom";


function MainLayout() {
  return (
    <div className = "w-full">
      <Header />

      {/* {to render the child route but only one  outlet renders} */}
      <Container className="flex-grow">
        <main className="flex-grow"><Outlet /></main>
      </Container>
      <Footer />
    </div>
  )
}

export default MainLayout;