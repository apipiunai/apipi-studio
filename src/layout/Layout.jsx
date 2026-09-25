import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useWindowSize } from "../providers/WindowSizeProvider";
import { useTheme } from "../providers/ThemeProvider";
import { useState, useEffect, useRef } from "react";
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import IconHover from "../components/IconHover";
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Desplegable from "../components/Desplegable";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useIdioma } from "../providers/IdiomaProvider";
import { useAuth } from "../providers/AuthProvider";

import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ImageIcon from '@mui/icons-material/Image';
import PublicIcon from '@mui/icons-material/Public';


export default function Layout() {
    const { logout, company, user, modules } = useAuth()
    const { width } = useWindowSize();
    const { theme, mode, setMode } = useTheme();
    const { t, idioma, setIdioma } = useIdioma();
    const location = useLocation();
    const navigate = useNavigate();


    const idiomas = [
        { name: "español", img: "images/es.png", },
        { name: "ingles", img: "images/en.png" }
    ]

    const [headerHeight, setHeaderHeight] = useState(70);
    const [sidebarWidth, setSidebarWidth] = useState(236);
    const [openSidebar, setOpenSidebar] = useState(false);
    const [smallScreen, setSmallScreen] = useState(false);

    useEffect(() => {
        setHeaderHeight(width > 800 ? 60 : 60);
        setSmallScreen(width > 800 ? false : true)
    }, [width]);


    const pages = [
        { name: "STUDIO 3D", path: "/studio-3d", icon: <PublicIcon /> },
        // { name: "STUDIO IMG", path: "/studio-img", icon: <ImageIcon /> },
        // { name: "STUDIO VIDEO", path: "/studio-video", icon: <OndemandVideoIcon /> }
    ]


    return (
        <div style={{
            position: "fixed",
            width: "100%",
            left: 0,
            top: 0,
            height: "100vh",
            background: theme.background,
            color: theme.text1,
            overflow: "hidden"
        }}>

                <div style={{position:"fixed",zIndex:999, display: "flex", alignItems: "center", padding: 15}}>
                    <IconHover onClick={() => setOpenSidebar(!openSidebar)} icon={<MenuIcon />} />
                </div>

                <div style={{position:"fixed", right: 0, zIndex:10000, display: "flex", alignItems: "center", padding: 15}}>

                    {/* <Desplegable icon={<img height="20px" width="30px" src={idiomas.find(l => l.name === idioma)?.img} alt={idioma}
                        style={{ cursor: "pointer", borderRadius: 2.5 }} />}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div
                                style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", padding: 15 }}
                            >
                                {idiomas.map((l, index) => (
                                    idioma === l.name ? null : <img key={l.name} height="20px" width="30px" src={l.img} alt={l.name} style={{ cursor: "pointer", borderRadius: 2.5 }} onClick={() => setIdioma(l.name)} />
                                ))}
                            </div>
                        </div>
                    </Desplegable> */}


                    {/* <Desplegable style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }} icon={<IconHover icon={mode === "default" ? <Brightness7Icon /> : <DarkModeIcon />} />}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", padding: 7.5 }}>
                            {mode === "default" ?
                                <IconHover onClick={() => setMode("dark")} icon={<DarkModeIcon />} /> :
                                <IconHover onClick={() => setMode("default")} icon={<Brightness7Icon />} />
                            }
                        </div>
                    </Desplegable> */}

                    {/* <Desplegable style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }} icon={<IconHover icon={<AccountCircleIcon />}/>}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", padding: 7.5, cursor: "pointer" }} onClick={() => {logout(); navigate("/") }}>
                            <LogoutIcon />
                        </div>
                    </Desplegable> */}

                    {/* <Desplegable style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }} icon={<IconHover icon={<SettingsIcon />} />}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 7.5, cursor: "pointer" }} onClick={() => { logout(); navigate("/") }}>
                            <IconHover icon={<LogoutIcon style={{ fontSize: 20, color: theme.error }} />} />
                        </div>
                    </Desplegable> */}

                </div>


            {openSidebar &&
                <>
                    <div onClick={() => setOpenSidebar(false)} style={{ zIndex: 999, position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "black", opacity: 0.2 }}></div>
                    <aside style={{ zIndex: 9999, position: "fixed", left: 0, top: 0, background: theme.card, height: `100%` }}>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                            <div style={{ display: "flex", flexDirection: "column", padding: "10px 0px" }}>
                                {pages.map((page) => (
                                    <div key={page.name} style={{ padding: "10px 15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Link className="cursor-zoom" onClick={() => setOpenSidebar(false)} to={page.path} style={{ textDecoration: "none", color: location.pathname.includes(page.path) ? theme.main : theme.text1, cursor: "pointer" }}>
                                            {page.icon}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </>
            }

            <div style={{
                zIndex: 1,
                overflowY: "auto",
                position: "fixed",
                height: `100vh`,
                width: `100vw`,
                left: 0,
                top: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: ""
            }}>
                <Outlet />
            </div>
        </div >


    );
}
