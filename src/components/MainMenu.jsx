import {InfoAuthenticated} from "./InfoAuthenticated"
import { useNavigate } from 'react-router-dom';

export function MainMenu()
{
    const navigate = useNavigate();

    const handleRequestData = () => {
        navigate('/'); // Переход на главную страницу
    };

    return(
        <div id="main-menu">
            <nav className="nav-menu">
                <ul className="menu-buttons">
                    <li className="menu-buttons__elem">
                        <a className="menu-link" onClick={handleRequestData}>Главная</a>
                    </li>
                    <li className="menu-buttons__elem">
                        <a className="menu-link">Тарифы</a>
                    </li>
                    <li className="menu-buttons__elem">
                        <a className="menu-link">FAQ</a>
                    </li>
                </ul>
            </nav>
            <InfoAuthenticated></InfoAuthenticated>
        </div>
    );
}