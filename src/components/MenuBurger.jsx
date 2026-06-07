import logo from "../images/logo-footer.png"
import closeImage from "../images/close.svg"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"

export function MenuBurger({ onClose })
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
        onClose();
    };

    const handleMain = () => {
        navigate('/'); // Переход на главную страницу
        onClose();
    };

    const ExitClick = () => {
        console.log("Выход");
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        window.location.reload();
    }
    
    return(
        <div className="burger-overlay" onClick={onClose}>
            <div className="burger-menu" onClick={(e) => e.stopPropagation()}>
                <div className="burger-header">
                    <img src={logo} className="logo__menu-burger" alt="logo" />
                    <img src={closeImage} className="close-button" alt="close" onClick={onClose} />
                </div>
                
                <nav className="burger-nav">
                    <ul className="burger-nav-list">
                        <li className="burger-nav-item">
                            <a className="burger-nav-link" onClick={handleMain}>Главная</a>
                        </li>
                        <li className="burger-nav-item">
                            <a className="burger-nav-link">Тарифы</a>
                        </li>
                        <li className="burger-nav-item">
                            <a className="burger-nav-link">FAQ</a>
                        </li>
                    </ul>
                </nav>
                
                {isAuthenticated && (
                    <button className="burger-login-button" onClick={ExitClick}>
                        Выйти
                    </button>
                )}
                {!isAuthenticated && (
                    <div className="burger-auth">
                        <button className="burger-register-button">
                            Зарегистрироваться
                        </button>
                        <button className="burger-login-button" onClick={handleRequestData}>
                            Войти
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}