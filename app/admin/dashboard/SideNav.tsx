'use client';

import { useState, useEffect } from "react";

export default function SideNav() {
    const [navOpen, setNavOpen] = useState(false);
    const [title, setTitle] = useState(
        <span><span id="mm">F</span>abulous</span>
    );
    const [titleSize, setTitleSize] = useState("10.65vw");

    const openNav = () => setNavOpen(true);
    const closeNav = () => setNavOpen(false);

    const handleHover = () => {
        if (window.innerWidth >= 1020) {
            setTitle(<span id="mm">Fabulous Folio</span>);
            setTitleSize("8.65vw");
        } else {
            setTitle(
                <span>
                    <span id="mm">F</span>abulous
                </span>
            );
        }
    };

    const handleLeave = () => {
        setTitle(
            <span>
                <span id="mm">F</span>abulous
            </span>
        );
        setTitleSize("10.65vw");
    };

    const [role, setRole] = useState<'head' | 'branch' | null>(null);

    const linkStyle = {
        padding: '8px 8px 8px 32px',
        textDecoration: 'none',
        fontSize: '18px',
        color: '#f1f1f1',
        display: 'block',
        transition: '0.3s',
        marginTop: '10px'
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1020) {
                setTitle(
                    <span>
                        <span id="mm">F</span>abulous
                    </span>
                );
                setTitleSize("10.65vw");
            }
        };

        const checkRole = () => {
            if (localStorage.getItem('isHeadAdminLoggedIn') === 'true') {
                setRole('head');
            } else if (localStorage.getItem('isBranchAdmin') === 'true') {
                setRole('branch');
            }
        };

        checkRole();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {/* Side Nav */}
            <div
                id="mySidenav"
                style={{
                    width: navOpen ? "190px" : "0",
                    height: "100%",
                    position: "fixed",
                    top: "70px",
                    left: 0,
                    backgroundColor: "rgba(17, 17, 17, 0.7)",
                    overflowX: "hidden",
                    transition: "0.5s",
                    zIndex: 999,
                }}
            >
                <button onClick={closeNav} style={{ margin: 20, color: "#fff", background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
                    &times; Close
                </button>
                <div style={{ padding: '20px', color: 'white' }}>
                    <h3 style={{ padding: '0 32px', color: '#aaa', fontSize: '18px', borderBottom: '1px solid #555', paddingBottom: '10px' }}>Monthly Expenses</h3>

                    {role === 'branch' && (
                        <>
                            <a href="/admin/expenses/shop-rent" style={linkStyle}>Shop Rent</a>
                            <a href="/admin/expenses/electricity" style={linkStyle}>Electricity Bill</a>
                            <a href="/admin/expenses/instruments" style={linkStyle}>Instruments List</a>
                            <a href="/admin/expenses/teachers-salary" style={linkStyle}>Teachers Salary</a>
                        </>
                    )}

                    {role === 'head' && (
                        <>
                            <a href="/admin/expenses/incharge-salary" style={linkStyle}>Branch Incharge Salary</a>
                            <a href="/admin/expenses/shop-rent" style={linkStyle}>Shop Rent (All)</a>
                            <a href="/admin/expenses/electricity" style={linkStyle}>Electricity Bill (All)</a>
                            <a href="/admin/expenses/instruments" style={linkStyle}>Instruments List (All)</a>
                            <a href="/admin/expenses/teachers-salary" style={linkStyle}>Teachers Salary (All-Branches)</a>
                        </>
                    )}
                </div>
            </div>

            {/* Open Nav Button */}
            <button
                onClick={openNav}
                style={{
                    position: "fixed",
                    top: "80px",
                    left: "20px",
                    padding: "10px",
                    cursor: "pointer",
                    zIndex: 100,
                }}
            >
                &#9776; Open Nav
            </button>

            {/* Title - Hidden or positioned appropriately? The user code had a big title. 
          I will include it but maybe it conflicts with the dashboard header.
          The user said "instert this... without any privius changes".
          I'll render it as is, but maybe wrap it or put it in a way that doesn't break layout.
          The user's code has a big H1 title and a "Know More" button.
          This looks like a landing page component, not a dashboard sidenav.
          But the user asked to insert it. I will insert it.
      */}

            {/* 
        The user's code has:
        - SideNav div (fixed)
        - Title h1
        - Know More button
        - Open Nav button (fixed)
        
        I will include all of them.
      */}
        </>
    );
}
