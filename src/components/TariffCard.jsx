import { useEffect, useState } from "react"
import lampImage from "../images/lamp.svg"
import dartsImage from "../images/darts.svg"
import netbookImage from "../images/netbook.svg"

const tariffs = [
    {
        name:"Beginner",
        durations:"Для небольшого исследования",
        color:"#FFB64F",
        newPrice:"799 ₽",
        oldPrice:"2 600 ₽",
        installmentPlan:"или 150 ₽/мес. при рассрочке на 24 мес.",
        plan:["Безлимитная история запросов", "Безлимитная история запросов", "Поддержка 24/7"],
        imagePath: lampImage,
        imagePosition: { top: "13px", right: "5px"}
    },
    {
        name:"Pro",
        durations:"Для HR и фрилансеров",
        color:"#7CE3E1",
        newPrice:"1 299 ₽",
        oldPrice:"2 600 ₽",
        installmentPlan:"или 279 ₽/мес. при рассрочке на 24 мес.",
        plan:["Все пункты тарифа Beginner", "Экспорт истории", "Рекомендации по приоритетам"],
        imagePath: dartsImage,
        imagePosition: { top: "0", right: "0"}
    },
    {
        name:"Business",
        durations:"Для корпоративных клиентов",
        color:"#000000",
        newPrice:"2 379 ₽",
        oldPrice:"3 700 ₽",
        plan:["Все пункты тарифа Pro", "Безлимитное количество запросов", "Приоритетная поддержка"],
        imagePath: netbookImage,
        imagePosition: { top: "15px", right: "10px"}
    }
]

export function TariffCard({tariffNow})
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

            console.log("Токен найден TariffCard");
            setIsAuthenticated(true);
        }
        isAuth();

    }, []);

    return(
        <div className="tariff-card__container">
        {
            tariffs.map((tariff, index) => {
                return(
                    <div key={index} className="tariff-card" style={isAuthenticated && tariff.name === tariffNow ? { borderColor: tariff.color } : {}}>
                        <div className="header__tariff-card" style={{ backgroundColor: tariff.color }}>
                            {tariff.imagePath && (
                                <img 
                                    src={tariff.imagePath} 
                                    alt={`${tariff.name} icon`} 
                                    className="tariff-icon"
                                    style={{
                                        position: "absolute",
                                        top: tariff.imagePosition?.top,
                                        right: tariff.imagePosition?.right,
                                        objectFit: "contain"
                                    }}
                                />
                            )}
                            <h2 className="name-tariff" style={tariff.name === "Business" ? { color: "white" } : { color: "black" }}>
                                {tariff.name}
                            </h2>
                            <p className="description-tariff" style={tariff.name === "Business" ? { color: "white" } : { color: "black" }}>{tariff.durations}</p>
                        </div>
                        <div className="main__tariff-card">
                            {isAuthenticated && tariff.name==tariffNow ? <div className="now-tariff__container"><p className="now-tariff">Текущий тариф</p></div> : null}
                            <div className="price-container">
                                <h2 className="newPrice-tariff">{tariff.newPrice}</h2>
                                <h2 className="oldPrice-tariff">{tariff.oldPrice}</h2>
                            </div>
                            <p className="installment-plan">{tariff.installmentPlan}</p>
                            
                            <p className="plan-title">В тариф входит:</p>
                            <ul className="plan-tariff">
                                {tariff.plan.map((item, idx) => (
                                    <li key={idx}> {item}</li>
                                ))}
                            </ul>
                            {isAuthenticated && tariff.name==tariffNow ? <button className="button-details gray-button">Перейти в личный кабинет</button> : <button className="button-details purple-button">Подробнее</button>}
                        </div>
                    </div>
                )
            })
        }
        </div>
    );
}