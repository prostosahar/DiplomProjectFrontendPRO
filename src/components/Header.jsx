import { useEffect, useState } from "react"
import logo from "../images/logo.svg"
import {LimitOnCompanies} from "./LimitOnCompanies"
import {MainMenu} from "./MainMenu"

export function Header({ onBurgerClick, isLargeScreen })
{
    const [isAuthenticated, setIsAuthenticated] = useState (false);

    useEffect(() => {
        const isAuth = () => 
        {
            const accessToken = localStorage.getItem('accessToken');

            // Проверка наличия токена
            if (!accessToken) {
                console.error("Токен не найден в localStorage");
                return;
            }

            console.log("Токен найден Main");
            setIsAuthenticated(true);
        }
        isAuth();
    }, []);

    return(
        <div id="header">
            <div className="logo">
                <img src={logo} id="logo" alt="logo" />
            </div>
            {isLargeScreen ? (
                <MainMenu />
            ) : (
                <div className="menu">
                    {isAuthenticated ? <LimitOnCompanies /> : null}
                    <button className="menu-button" onClick={onBurgerClick}>
                        <svg width="30" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="30" height="5" fill="#029491"/>
                            <rect y="10" width="30" height="5" fill="#029491"/>
                            <rect y="20" width="30" height="5" fill="#029491"/>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}