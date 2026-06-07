import { useEffect, useState } from "react"
import serviceImage from "../images/service.svg"
import backButton from "../images/back-button.svg"
import nextButton from "../images/next-button.svg"
import timerImage from "../images/timer.png"
import blockImage from "../images/block.png"
import searchImage from "../images/search.png"
import imageBackground from "../images/image-background.svg"
import {TariffCard} from "./TariffCard"
import { useNavigate } from 'react-router-dom';

export function Main()
{
    const cards = [
        {image: timerImage, description:"Высокая и оперативная скорость обработки заявки"},
        {image: searchImage, description:"Огромная комплексная база данных, обеспечивающая объективный ответ на запрос"},
        {image: blockImage, description:"Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству"}
        
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1440);
    const [isAuthenticated, setIsAuthenticated] = useState (false);

    // Отслеживание изменения размера экрана
    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1440);
        };

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
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Функция для следующей карточки
    const nextCard = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === cards.length - 1 ? 0 : prevIndex + 1
        );
    };

    // Функция для предыдущей карточки
    const prevCard = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? cards.length - 1 : prevIndex - 1
        );
    };

    const navigate = useNavigate();
    const handleRequestData = () => {
        navigate('/search'); // Переход на страницу ввода параметров поиска
    };

    const VisibleButton = () => (
        isAuthenticated ? (<button className="request-data purple-button" onClick={handleRequestData}>Запросить данные</button> ) : null
    );

    return(
        <div id="main">
            <div className="main-preview">
                <div className="main-preview__description">
                    <h1 className="preview title">сервис по поиску 
                        <br></br>публикаций 
                        <br></br>о компании 
                        <br></br>по его ИНН
                    </h1>
                    <p className="description-preview">Комплексный анализ публикаций, получение данных в формате PDF на электронную почту.</p>
                    {VisibleButton()}
                </div>
                <img src={serviceImage} className="preview-image"></img>
            </div>
            <div className="description-project">
                <h1 className="choice-description title">Почему именно мы</h1>
                <div className="card-carousel__container">
                    <button className="card-carousel__buttons back" onClick={prevCard}>
                        <img src={backButton} alt="back"></img>
                    </button>
                    
                    {isLargeScreen ? (
                        <div className="card-items__container">
                            <div className="card-item">
                                <img className="image-card" src={cards[currentIndex % cards.length].image} alt="card1"></img>
                                <p className="description-card">{cards[currentIndex % cards.length].description}</p>
                            </div>
                            <div className="card-item">
                                <img className="image-card" src={cards[(currentIndex + 1) % cards.length].image} alt="card2"></img>
                                <p className="description-card">{cards[(currentIndex + 1) % cards.length].description}</p>
                            </div>
                            <div className="card-item">
                                <img className="image-card" src={cards[(currentIndex + 2) % cards.length].image} alt="card3"></img>
                                <p className="description-card">{cards[(currentIndex + 2) % cards.length].description}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="card-carousel">
                            <img className="image-card" src={cards[currentIndex].image} alt="card"></img>
                            <p className="description-card">{cards[currentIndex].description}</p>
                        </div>
                    )}
                    
                    <button className="card-carousel__buttons next" onClick={nextCard}>
                        <img src={nextButton} alt="next"></img>
                    </button>
                </div>
            </div>
            <img className="background-image1" src={imageBackground} alt="background"></img>
            <div className="tariffs">
                <h1 className="choice-description title">Наши тарифы</h1>
                <TariffCard
                    tariffNow = {"Beginner"}  // Универсально, можно потыкаться на Pro, Bussiness (не нашёл в swagger это поле)
                />
            </div>
        </div>
    );
}