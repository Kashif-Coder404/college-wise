"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "./Context";
import NavBar from "../components/NavBar";
import "dotenv/config";

export default function AppProvider({ children }) {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API;
  const [user, setUser] = useState(null);
  // const [subjects,setSubject] = useState([])
  const subjects = [
    "Computer Fundamental (CF)",
    "Programming in C (C)",
    "Internet Technologies (IT)",
    "Mathematical Foundation (MF)",
    "Office Automation (OA)",
    "PC Hardware (PCH)",
    "Life Skills and Personality Development (LSPD)",
    "Programming in C++ (CPP)",
    "Computer Architecture and Digital Electronics (CADE)",
    "Computer Based Numerical Techniques (CBNT)",
    "Linux Environment (LE)",
    "Cyber Security (CS)",
    "Business Intelligence (BI)",
    "Understanding and Connecting with Environment (UCE)",
    "Data Structure & File Organization (DSFO)",
    "Operating System (OS)",
    "Python Programming (PY)",
    "Modelling and Simulation (MS)",
    "Graph Theory (GT)",
    "Informatics Cyber laws (ICL)",
    "Indian Knowledge System-I (IKS-I)",
    "Computer Network (CN)",
    "Database Management System (DBMS)",
    "R Programming (R)",
    "System Administrator (SA)",
    "Software Testing (ST)",
    "Software Engineering (SE)",
    "Indian Knowledge System-II (IKS-II)",
    "Compiler Design (CD)",
    "Computer Graphics (CG)",
    "Multimedia Application (MMA)",
    "ASP.Net (ASP)",
    "Pattern Recognition (PR)",
    "SQL/PL-SQL (SQL)",
    "Cryptography & Network Security (CNS)",
    "Design and Analysis of Algorithm (DAA)",
    "E-Commerce (EC)",
    "Image Processing (IP)",
    "Parallel Programming (PP)",
    "Data Compression (DC)",
    "Artificial Intelligence (AI)",
    "Cloud Computing (CC)",
    "Fundamental of Data Science (FDS)",
    "Internet of Things (IoT)",
    "Machine Learning (ML)",
    "Data Analytics (DA)",
    "Deep Learning (DL)",
    "Blockchain Technology (BT)",
    "Wireless and Mobile Computing (WMC)",
  ];
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(savedUser);
    }
    setAuthLoading(false);
  }, []);
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };
  return (
    <AppContext.Provider
      value={{ logout, user, setUser, loading: authLoading, authLoading, subjects, API }}
    >
      <NavBar collegeName={"ITM"} />
      {children}
    </AppContext.Provider>
  );
}
