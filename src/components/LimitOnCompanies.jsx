import "../css/style.css";
import { useState, useEffect } from "react";
import imageLoading from '../images/loader.png'

export function LimitOnCompanies(){
    const API_BASE_URL = 'https://gateway.scan-interfax.ru';
    const [accountInfo, setAccountInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const [usedCompanyCount, setUsedCompanyCount] = useState(0);
    const [companyLimit, setCompanyLimit] = useState(0);

    useEffect(() => {
        const GetInfo = async () => {

            const accessToken = localStorage.getItem('accessToken');
            console.log("Токен доступа получен");

            // Проверка наличия токена
            if (!accessToken) {
                console.error("Токен не найден в localStorage");
                setLoading(false);
                return;
            }

            // Выполнение GET-запроса
            try {
                const apiBaseUrl = 'https://gateway.scan-interfax.ru';
                const response = await fetch(`${apiBaseUrl}/api/v1/account/info`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`, // Токен в заголовке Authorization
                        'Accept': 'application/json'        // Получить JSON
                    }
                });

                // Обработка ответа сервера
                if (response.ok) {
                    // Если статус 200
                    const data = await response.json(); // Парсинг JSON-ответа
                    console.log("Информация получена:", data);
                    
                    if (data && data.eventFiltersInfo) {
                        setUsedCompanyCount(data.eventFiltersInfo.usedCompanyCount);
                        setCompanyLimit(data.eventFiltersInfo.companyLimit);
                    } 
                    else {
                        console.error("Неожиданная структура данных:", data);
                    }
                } 
                else {
                    // Если статус не 200
                    console.error("Ошибка, статус:", response.status);
                    const errorText = await response.text();
                    console.error("Тело ошибки:", errorText);
                }
            } catch (error) {
                // Ошибка сети или другой критический сбой
                console.error("Сетевая ошибка при выполнении запроса:", error);
            }
            finally {
                setLoading(false);
            }
        }
        
        GetInfo();
    }, []);

    if (loading)
    {
        return (
            <div id="limit">
                <img src={imageLoading} id="loader"></img>
            </div>
        )
    }

    return (
        <div id="limit">
            <div class="limit__company-info">
                <p class="limit__company-info__text">Использовано компаний</p>
                <p class="limit__company-info__number use-company">{usedCompanyCount}</p>
            </div>
            <div class="limit__company-info">
                <p class="limit__company-info__text">Лимит по компаниям</p>
                <p class="limit__company-info__number limit-company">{companyLimit}</p>
            </div>
        </div>
    )
}