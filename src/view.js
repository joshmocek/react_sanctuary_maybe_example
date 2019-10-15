import "./styles.css";
import * as React from "react";

export const LoadingView = () => (
  <span>Loading</span>
);

export const ErrorView = ({error}) => (
  <span>Error: {error}</span>
);

export const SuccessView = ({ data }) => (
  <span>Success: {data.msg}</span>
);