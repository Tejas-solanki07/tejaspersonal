import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navigate } from "react-router-dom";
const Courseadd = lazy(() => import('./course/Addcourse'));
const Loginmam = lazy(() => import('./Login/Login'));
const Nav = lazy(() => import('./Navabar/Navbar'));
const Inv = lazy(() => import('./invoice/Form'));
const Sd = lazy(() => import('./Studentdetails/SD'));
const Old = lazy(() => import('./Old/Oldd'));
const Inter = lazy(() => import('./Internship.js/Interform'));
const Eventi = lazy(() => import('./einquiries/Eventi'));
const Batches = lazy(() => import('./Btches/Batches(j)'));
const Completedcourse = lazy(() => import('./course/Completedcourse'));
const Batchcourse = lazy(() => import('./Btches/Batchcourse'));
const CourInq = lazy(() => import('./Inquiries/CourInq'));
const Dashboard = lazy(() => import('./dashboard/Dashboard'));

function App() {
  const Privateroute = (props) => {
    const gettoken = localStorage.getItem("token");

    if (gettoken) {
      return props.children;
    } else {
      return <Navigate to="/" />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<div>loading.....</div>}>
              <Loginmam />
            </Suspense>
          }
        />
        <Route
          path="/dashBoard"
          element={
            <Suspense fallback={<div>loading....</div>}>
              <Privateroute>
                <Nav />
              </Privateroute>
            </Suspense>
          }
        >
          <Route
            path="/dashBoard/dashBoard"
            element={
              <Suspense fallback={<div>loading..</div>}>
                <Privateroute>
                  <Dashboard />
                </Privateroute>
              </Suspense>
            }
          />
        </Route>
        <Route
          path="/course"
          element={
            <Privateroute>
              <Nav />
            </Privateroute>
          }
        >
          <Route
            path="/course/Invoice"
            element={
              <Suspense fallback={<div>loading.....</div>}>
                <Privateroute>
                  <Inv />
                </Privateroute>
              </Suspense>
            }
          ></Route>
          <Route
            path="/course/CourInq"
            element={
              <Suspense fallback={<div>loading...</div>}>
                <Privateroute>
                  <CourInq />
                </Privateroute>
              </Suspense>
            }
          ></Route>

          <Route
            path="/course/Studentdetails"
            element={
              <Suspense fallback={<div>loading....</div>}>
                <Privateroute>
                  <Sd />
                </Privateroute>
              </Suspense>
            }
          ></Route>

          <Route
            path="/course/AddCourse"
            element={
              <Suspense fallback={<div>loading....</div>}>
                <Privateroute>
                  <Courseadd />
                </Privateroute>
              </Suspense>
            }
          ></Route>

          <Route
            path="/course/Batch-For-Course"
            element={
              <Suspense fallback={<div>loading...</div>}>
                <Privateroute>
                  <Batchcourse />
                </Privateroute>
              </Suspense>
            }
          ></Route>

          <Route
            path="/course/Completedcourse"
            element={
              <Suspense fallback={<div>loading...</div>}>
                <Privateroute>
                  <Completedcourse />
                </Privateroute>
              </Suspense>
            }
          ></Route>
        </Route>
        <Route
          path="/events"
          element={
            <Privateroute>
              <Nav />
            </Privateroute>
          }
        >
          <Route
            path="/events/Events"
            element={
              <Suspense fallback={<div>loading...</div>}>
                <Privateroute>
                  <Inter />
                </Privateroute>
              </Suspense>
            }
          ></Route>

          <Route
            path="/events/einquiries"
            element={
              <Suspense fallback={<div>loading...</div>}>
                <Privateroute>
                  <Eventi />
                </Privateroute>
              </Suspense>
            }
          ></Route>

          <Route
            path="/events/Old"
            element={
              <Suspense fallback={<div>loading...</div>}>
                <Privateroute>
                  <Old />
                </Privateroute>
              </Suspense>
            }
          ></Route>

          <Route
            path="/events/Batches"
            element={
              <Suspense fallback={<div>loading..</div>}>
                <Privateroute>
                  <Batches />
                </Privateroute>
              </Suspense>
            }
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>

    //     // <div><Alerts/></div>
    //     <Route path='/login' element={<Login text='Dashboard'/>}/>
    // <Route path='/dashBoard' element={<Navbar text="123"/>}>
  );
}

export default App;
