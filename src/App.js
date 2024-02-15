import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./component/Auth/login";
import Signup from "./component/Auth/signup";
import Home from "./component/home";
import Layout from "./component/Layout/layout";
import ProfileEdit from "./component/Auth/ProfileEdit";
import PublicHome from "./component/publicHome";
import PublicLayout from "./component/Layout/publicLayout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* User Auth Routes   */}
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/signup" element={<Signup />}></Route>

          <Route path="/user/home" element={<Layout />}>
            <Route exact index element={<Home />}></Route>
          </Route>

          <Route path="/user/profile" element={<Layout />}>
            <Route exact index element={<ProfileEdit />}></Route>
          </Route>

          <Route path="/login" element={<PublicLayout />}>
            <Route exact index element={<Login />}></Route>
          </Route>

          <Route path="/signup" element={<PublicLayout />}>
            <Route exact index element={<Signup />}></Route>
          </Route>

          <Route path="/" element={<PublicLayout />}>
            <Route exact index element={<PublicHome />}></Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
