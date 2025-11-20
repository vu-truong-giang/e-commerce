import React from "react";
import { Route } from "react-router-dom";
import Welcome from "../../frontend/src/pages/users/welcome";

export const UserRouter = (
    <Route path="/user" >
        <Route path="welcome/:userId" element={<Welcome />} />
    </Route>
);