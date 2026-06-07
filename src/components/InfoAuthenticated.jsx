import { useEffect, useState } from "react"
import {LimitOnCompanies} from "./LimitOnCompanies"
import userAvatar from '../images/Barick.png'
import { useNavigate } from 'react-router-dom';

export function InfoAuthenticated()
{
    const [isAuthenticated, setIsAuthenticated] = useState (false);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = () => 
        {
            const accessToken = localStorage.getItem('accessToken');

            // Проверка наличия токена
            if (!accessToken) {
                console.error("Токен не найден в localStorage");
                return;
            }

            console.log("Токен найден InfoAuthenticated");
            setIsAuthenticated(true);
        }
        isAuth();
    },[]);

    const handleRequestData = () => {
        navigate('/autorization'); // Переход на страницу авторизации
    };

    const ExitClick = () => {
        console.log("Выход");
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        window.location.reload();
    }

    

    return(
        <>
        {isAuthenticated && (
            <>
            <LimitOnCompanies></LimitOnCompanies>
            <div className="user-menu">
                <div className="user-menu__text">
                    <p id="username">the_barbarian</p>
                    <button id="exit-button" onClick={ExitClick}>Выйти</button>
                </div>
                <img className="user-avatar" src={userAvatar}></img>
            </div>
            </>
        )}
        {!isAuthenticated && (
            <div className="register-container">
                <button className="register-button">Зарегистрироваться</button>
                <hr className="separator-register"></hr>
                <button className="login-button" onClick={handleRequestData}>Войти</button>
            </div>
        )}
        </>
    );
}