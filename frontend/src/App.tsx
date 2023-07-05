import { Outlet } from "react-router-dom"
import Layout from "./Components/Layout/Layout"

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

