import { useEffect, useState } from "react"
import googleLogo from "../images/google.svg"
import facebookLogo from "../images/facebook.svg"
import yandexLogo from "../images/yandex.svg"
import authImage from "../images/image-auth.svg"
import lockImage from "../images/lock.svg"

export function Autorization()
{
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1440);
    const [loginValue, setLoginValue] = useState("");
    const [loginValid, setLoginValid] = useState(false);  // Исправлено
    const [loginError, setLoginError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1440);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Форматирование телефона из 11 цифр
    const formatPhone = (digits) => {
        if (digits.length !== 11) return digits;
        return `${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
    };

    const handleLoginChange = (e) => {
        let value = e.target.value;
        
        if (value === "") {
            setLoginValue("");
            setLoginError("");
            setLoginValid(false);
            return;
        }
        
        const firstChar = value[0];
        
        // Случай 1: начинается с +
        if (firstChar === '+') {
            // Проверить, есть ли буквы
            const hasLetter = /[a-zA-Zа-яА-Я]/.test(value);
            
            // Убрать всё, кроме цифр после плюса
            let digits = value.slice(1).replace(/\D/g, '');
            if (digits.length > 11) digits = digits.slice(0, 11);
            
            let newValue = '';
            
            if (hasLetter) {
                // Если есть буквы - ошибка
                newValue = value.replace(/\s/g, '');
                setLoginError("Введите корректные данные");
                setLoginValid(false);
            } 
            else if (digits.length === 11) {
                // Ровно 11 цифр - форматировать с пробелами
                newValue = '+' + formatPhone(digits);
                setLoginError("");
                setLoginValid(true);
            } 
            else if (digits.length < 11 && digits.length > 0) {
                // Меньше 11 цифр - без форматирования
                newValue = '+' + digits;
                setLoginError("");
                setLoginValid(false);
            }
            else if (digits.length > 11){
                // Больше 11 цифр - ошибка
                newValue = '+' + digits;
                setLoginError("Введите корректные данные");
                setLoginValid(false);
            }
            else {
                // Пусто
                newValue = '+' + digits;
                setLoginError("");
                setLoginValid(false);
            }
            
            setLoginValue(newValue);
            return;
        }
                
        // Случай 2: начинается с буквы
        if (/[a-zA-Zа-яА-Я]/.test(firstChar)) {
            // Это логин
            setLoginValue(value);
            setLoginError("");
            setLoginValid(true);
            return;
        }
        
        // Случай 3: начинается с цифры
        if (/[0-9]/.test(firstChar)) {
            // Извлечь все цифры из введённого
            let digits = value.replace(/\D/g, '');
            
            // Если введена буква или другой символ - это логин
            const hasLetter = /[a-zA-Zа-яА-Я]/.test(value);
            
            // Содержит букву - это логин
            if (hasLetter && digits.length < 9) {
                setLoginValue(value);
                setLoginError("");
                setLoginValid(true);
                return;
            }
            // Содержит букву от 9 цифр - это ошибка
            else if (hasLetter && digits.length >= 9) {
                setLoginError("Введите корректные данные");
                setLoginValue(value.replace(/\s/g, ''));
                setLoginValid(false);
                return;
            }
            
            // Если уже есть 11 цифр
            if (digits.length === 11) {
                const finalDigits = digits.slice(0, 11);
                const formatted = formatPhone(finalDigits);
                setLoginValue(formatted);
                setLoginError("");
                setLoginValid(true);
                return;
            }
            else if (digits.length > 11)
            {
                setLoginError("Введите корректные данные");
                setLoginValue(value.replace(/\s/g, ''));
                setLoginValid(false);
                return;
            }
            
            // Иначе показать как есть, пока не набрано 11 цифр
            setLoginValue(value.replace(/\s/g, ''));
            setLoginError("");
            setLoginValid(true);
            return;
        }
        
        // Любые другие случаи
        setLoginValue(value);
        setLoginError("");
        setLoginValid(false);
    };

    const handlePasswordChange = (e) => {
        setPasswordValue(e.target.value);
        setPasswordError("");
    };

    // Проверка, можно ли активировать кнопку
    const isButtonActive = () => {
        return loginValid && passwordValue.trim() !== "";
    };

    // Компонент поля ввода с ошибкой
    const renderInputLogin = () => (
        <div className="login-input__container">
            <p className="text-input">Логин или номер телефона:</p>
            <input 
                type="text" 
                className={`input-auth login ${loginError ? 'input-login__error' : ''}`}
                value={loginValue}
                onChange={handleLoginChange}
            />
            {loginError && (
                <div className="error-message">
                    <p>{loginError}</p>
                </div>
            )}
        </div>
    );

    const renderInputPassword = () => (
        <div className="register-input__container">
            <p className="text-input">Пароль:</p>
            <input 
                type="password" 
                className={`input-auth password" ${passwordError ? 'input-password__error' : ''}`}
                value={passwordValue}
                onChange={handlePasswordChange}
            />
            {passwordError && (
                <div className="error-message">
                    <p>{passwordError}</p>
                </div>
            )}
        </div>
    );   

    // Кнопка с состоянием активности
    const renderButton = () => (
        <button 
            className={`auth-button purple-button ${!isButtonActive() ? 'button-disabled' : ''}`}
            disabled={!isButtonActive()}
            onClick={LoginClick}>
            Войти
        </button>
    );

    // Обработчик клика кнопки "Войти"
    const LoginClick = async () => {
        //console.log("Нажата");
        const requestBody = {
            login: loginValue,
            password: passwordValue
        };
        console.log("Отправка запроса на авторизацию:", requestBody);

        // Выполнение POST-запроса
        try {
            const apiBaseUrl = 'https://gateway.scan-interfax.ru';
            const response = await fetch(`${apiBaseUrl}/api/v1/account/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Отправить JSON
                    'Accept': 'application/json'        // Получить JSON
                },
                body: JSON.stringify(requestBody) // Преобразовать объект в JSON-строку
            });

            // Обработка ответа сервера
            if (response.ok) {
                // Если статус 200 (Success)
                const data = await response.json(); // Парсинг JSON-ответа
                console.log("Авторизация успешна! Токен получен:", data);
                
                // Успех - сохранить в localStorage
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('tokenExpire', data.expire);
                
                // На главную страницу
                window.location.href = '/'; // Пример редиректа
            } 
            else {
                // Если статус не 200
                console.error("Ошибка авторизации, статус:", response.status);
                let errorDetail = `${response.status}`;
                try {
                    const errorData = await response.json();

                    if (errorData && errorData.message) {
                        errorDetail = errorData.message;
                    } 
                    else if (errorData && errorData.title) {
                        errorDetail = errorData.title;
                    }
                } 
                catch (e) {
                    // Если ответ не JSON
                    console.error("Не удалось распарсить тело ошибки", e);
                }
                // Показать ошибку
                setPasswordError(`${errorDetail}`);
                setPasswordValue("");
            }
        } catch (error) {
            // Ошибка сети или другой критический сбой
            console.error("Сетевая ошибка при выполнении запроса:", error);
        }
    }

    if (isDesktop) {
        // Версия для 1440px и выше
        return (
            <div className="autorization-desktop">
                <div className="autorization-left">
                    <h1 className="autorization-title title">Для оформления подписки на тариф, необходимо авторизоваться.</h1>
                    <img className="auth-image" src={authImage} alt="Authorization" />
                </div>
                <div className="autorization-right">
                    <div className="autorization-menu">
                        <img src={lockImage} className="lock-image" alt="lock" />
                        <div className="autorization-buttons__container">
                            <div className="login-button__container">
                                <button className="login-button__autorization choice-button">Войти</button>
                                <hr className="line-login choice-line"></hr>
                            </div>
                            <div className="register-button__container">
                                <button className="register-button__autorization">Зарегистрироваться</button>
                                <hr className="line-register"></hr>
                            </div>
                        </div>
                        <div className="input__container">
                            {renderInputLogin()}
                            {renderInputPassword()}
                        </div>
                        {renderButton()}
                        <a className="recover-password">Восстановить пароль</a>
                        <div className="other-login__container">
                            <p className="other-login__title">Войти через:</p>
                            <div className="other-login__buttons-container">
                                <button className="other-login__buttons google-login"><img className="other-login__logo" src={googleLogo} alt="Google"></img></button>
                                <button className="other-login__buttons facebook-login"><img className="other-login__logo" src={facebookLogo} alt="Facebook"></img></button>
                                <button className="other-login__buttons yandex-login"><img className="other-login__logo" src={yandexLogo} alt="Yandex"></img></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Обычная версия
    return (
        <div className="autorization">
            <h1 className="autorization-title title">Для оформления подписки на тариф, необходимо авторизоваться.</h1>
            <div className="autorization-menu">
                <img src={lockImage} className="lock-image" alt="lock" />
                <div className="autorization-buttons__container">
                    <div className="login-button__container">
                        <button className="login-button__autorization choice-button">Войти</button>
                        <hr className="line-login choice-line"></hr>
                    </div>
                    <div className="register-button__container">
                        <button className="register-button__autorization">Зарегистрироваться</button>
                        <hr className="line-register"></hr>
                    </div>
                </div>
                <div className="input__container">
                    {renderInputLogin()}
                    {renderInputPassword()}
                </div>
                {renderButton()}
                <a className="recover-password">Восстановить пароль</a>
                <div className="other-login__container">
                    <p className="other-login__title">Войти через:</p>
                    <div className="other-login__buttons-container">
                        <button className="other-login__buttons google-login"><img className="other-login__logo" src={googleLogo} alt="Google"></img></button>
                        <button className="other-login__buttons facebook-login"><img className="other-login__logo" src={facebookLogo} alt="Facebook"></img></button>
                        <button className="other-login__buttons yandex-login"><img className="other-login__logo" src={yandexLogo} alt="Yandex"></img></button>
                    </div>
                </div>
            </div>
            <img className="auth-image" src={authImage} alt="Authorization" />
        </div>
    );
}