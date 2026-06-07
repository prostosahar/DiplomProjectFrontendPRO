import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import check from "../images/check.png";
import foldersImage from "../images/folders.svg";
import searchImage from "../images/image-search.svg";
import documentImage from "../images/document.svg";


export function Search() {
    const navigate = useNavigate();
    
    const dateStartRef = useRef(null);
    const dateEndRef = useRef(null);

    // ИНН
    const [INNValue, setINNValue] = useState("");
    const [INNError, setINNError] = useState("");
    const [INNValid, setINNValid] = useState(false);

    // Тональность
    const [tonalityValue, setTonalityValue] = useState("1");

    // Количество документов к выдаче
    const [countDocksValue, setcountDocksValue] = useState("");
    const [countDocksError, setcountDocksError] = useState("");
    const [countDocksValid, setcountDocksValid] = useState(false);

    // Даты
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [dateStartError, setDateStartError] = useState("");
    const [dateEndError, setDateEndError] = useState("");
    
    // Состояния для чекбоксов
    const [filters, setFilters] = useState({
        maxFullness: false,
        businessContext: false,
        mainRole: false,
        riskFactors: false,
        techNews: false,
        announcements: false,
        newsDigest: false
    });

    const handleCheckboxChange = (name) => {
        setFilters(prev => ({ ...prev, [name]: !prev[name] }));
    };

    // Для даты начала
    useEffect(() => {
        if (dateStartRef.current) {
            const input = dateStartRef.current;
            const handleClick = () => {
                input.showPicker();
            };
            input.addEventListener('click', handleClick);
            return () => {
                input.removeEventListener('click', handleClick);
            };
        }
    }, []);

    // Для даты конца
    useEffect(() => {
        if (dateEndRef.current) {
            const input = dateEndRef.current;
            const handleClick = () => {
                input.showPicker();
            };
            input.addEventListener('click', handleClick);
            return () => {
                input.removeEventListener('click', handleClick);
            };
        }
    }, []);

    // Форматирование даты для отображения
    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1440);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1440);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Компонент кастомного чекбокса
    const CustomCheckbox = ({ label, checked, onChange }) => (
        <label className="checkbox-item" onClick={(e) => e.stopPropagation()}>
            <div className={`custom-checkbox ${checked ? 'checked' : ''}`}>
                <input 
                    type="checkbox" 
                    checked={checked}
                    onChange={onChange}
                />
                {checked && <img src={check} alt="check" className="checkbox-icon" />}
            </div>
            <p className={`title-checkbox ${checked ? 'checked' : ''}`}>{label}</p>
        </label>
    );

    // Форматирование ИНН из 10 цифр
    const formatINN = (digits) => {
        if (digits.length !== 10) return digits;
        return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)}`;
    };

    // Компонент поля ввода ИНН
    const renderInputINN = () => (
        <div className="search-menu__INN-company">
            <div className="title__search-menu__necessarily">
                <p className="title__search-menu">ИНН компании</p>
                <p className={`title__search-menu necessarily ${INNError ? 'necessarily-error' : ''}`}>
                    *
                </p>
            </div>
            <input 
                type="text" 
                placeholder="10 цифр" 
                className={`input-search INN ${INNError ? 'input-login__error' : ''}`}
                value={INNValue}
                onChange={handleINNChange}
            />
            {INNError && (
                <div className="error-message__INN">
                    <p>{INNError}</p>
                </div>
            )}
        </div>
    );

    // Компонент поля ввода Количество документов
    const renderInputCountDocks = () => (
        <div className="search-menu__count-docks">
            <div className="title__search-menu__necessarily">
                <p className="title__search-menu">Количество документов в выдаче</p>
                <p className={`title__search-menu necessarily ${countDocksError ? 'necessarily-error' : ''}`}>
                    *
                </p>
            </div>
            <input 
                type="text" 
                placeholder="От 1 до 1000"
                className={`input-search count-docks ${countDocksError ? 'input-login__error' : ''}`}
                value={countDocksValue}
                onChange={handleCountDocksChange}
            />
            {countDocksError && (
                <div className="error-message__INN">
                    <p>{countDocksError}</p>
                </div>
            )}
        </div>
    );

    // Валидация ИНН
    const handleINNChange = (e) => {
        let value = e.target.value;
        
        if (value === "") {
            setINNValue("");
            setINNError("");
            setINNValid(false);
            return;
        }
        
        // Извлечь все цифры из введённого
        let digits = value.replace(/\D/g, '');
        
        // Если введена буква или другой символ - ошибка
        const hasLetter = /[a-zA-Zа-яА-Я]/.test(value);
        
        // Содержит букву - ошибка
        if (hasLetter) {
            setINNValue(value);
            setINNError("Введите корректные данные");
            setINNValid(false);
            return;
        }
        
        // Если уже есть 10 цифр
        if (digits.length === 10) {
            const finalDigits = digits.slice(0, 10);
            const formatted = formatINN(finalDigits);
            setINNValue(formatted);
            setINNError("");
            setINNValid(true);
            return;
        }
        else if (digits.length > 10)
        {
            setINNError("Введите корректные данные");
            setINNValue(value.replace(/\s/g, ''));
            setINNValid(false);
            return;
        }
        
        // Иначе показать как есть, пока не набрано 10 цифр
        setINNValue(value.replace(/\s/g, ''));
        setINNError("");
        setINNValid(false);
        return;
    };

    // Валидация Количества документов к выдаче
    const handleCountDocksChange = (e) => {
        let value = e.target.value;
        
        if (value === "") {
            setcountDocksValue("");
            setcountDocksError("");
            setcountDocksValid(false);
            return;
        }
        
        // Если введена буква или другой символ - ошибка
        const hasLetter = /[a-zA-Zа-яА-Я]/.test(value);
        
        // Содержит букву - ошибка
        if (hasLetter) {
            setcountDocksValue(value);
            setcountDocksError("Введите корректные данные");
            setcountDocksValid(false);
            return;
        }
        
        // Если уже есть 10 цифр
        if (value > 1000 || value < 1) {
            setcountDocksValue(value);
            setcountDocksError("Введите корректные данные");
            setcountDocksValid(false);
            return;
        }
        
        // Иначе показать как есть
        setcountDocksValue(value);
        setcountDocksError("");
        setcountDocksValid(true);
        return;
    };

    // Обработчик изменения даты начала
    const handleDateStartChange = (value) => {
        setDateStart(value);
        if (value && dateEnd) {
            validateDates(value, dateEnd);
        } else if (value) {
            validateDates(value, null);
        } else {
            setDateStartError("");
        }
    };

    // Обработчик изменения даты конца
    const handleDateEndChange = (value) => {
        setDateEnd(value);
        if (dateStart && value) {
            validateDates(dateStart, value);
        } else if (value) {
            validateDates(null, value);
        } else {
            setDateEndError("");
        }
    };

    // Валидация дат
    const validateDates = (start, end) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let isValid = true;
        
        // Валидация даты начала
        if (start) {
            const startDate = new Date(start);
            if (startDate > today) {
                setDateStartError("Введите корректные данные");
                isValid = false;
            } else {
                setDateStartError("");
            }
        } else {
            setDateStartError("");
        }
        
        // Валидация даты конца
        if (end) {
            const endDate = new Date(end);
            if (endDate > today) {
                setDateEndError("Введите корректные данные");
                isValid = false;
            } else {
                setDateEndError("");
            }
        } else {
            setDateEndError("");
        }
        
        // Валидация: дата начала не позже даты конца
        if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);
            if (startDate > endDate) {
                setDateStartError("Введите корректные данные");
                setDateEndError("Введите корректные данные");
                isValid = false;
            }
        }
        
        return isValid;
    };

    // Проверка, все ли обязательные поля валидны
    const isFormValid = () => {
        const innDigits = INNValue.replace(/\D/g, '');
        const isINNFilled = INNValue !== "" && innDigits.length === 10 && !INNError;
        
        const isCountFilled = countDocksValue !== "" && !countDocksError;
        
        const isDatesFilled = dateStart !== "" && dateEnd !== "" && !dateStartError && !dateEndError;
        
        return isINNFilled && isCountFilled && isDatesFilled;
    };

    // Функция преобразования тональности
    const getTonalityValue = (tonality) => {
        switch (tonality) {
            case '1':
                return 'Any';
            case '2':
                return 'Positive';
            case '3':
                return 'Negative';
            default:
                return 'Any';
        }
    };

    // Обработчик поиска
    const handleSearch = async () => {
        let hasErrors = false;
        
        // Проверка ИНН
        const innDigits = INNValue.replace(/\D/g, '');
        if (!INNValue || innDigits.length !== 10) {
            setINNError("Введите корректные данные");
            setINNValid(false);
            hasErrors = true;
        } else {
            setINNError("");
            setINNValid(true);
        }
        
        // Проверка количества документов
        const countNum = Number(countDocksValue);
        if (!countDocksValue || countNum < 1 || countNum > 1000) {
            setcountDocksError("Введите корректные данные");
            setcountDocksValid(false);
            hasErrors = true;
        } else {
            setcountDocksError("");
            setcountDocksValid(true);
        }
        
        // Проверка дат
        if (!dateStart) {
            setDateStartError("Введите корректные данные");
            hasErrors = true;
        } else {
            const startDate = new Date(dateStart);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (startDate > today) {
                setDateStartError("Введите корректные данные");
                hasErrors = true;
            } else {
                setDateStartError("");
            }
        }
        
        if (!dateEnd) {
            setDateEndError("Введите корректные данные");
            hasErrors = true;
        } else {
            const endDate = new Date(dateEnd);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (endDate > today) {
                setDateEndError("Введите корректные данные");
                hasErrors = true;
            } else {
                setDateEndError("");
            }
        }
        
        // Проверка, что дата начала не позже даты конца
        if (dateStart && dateEnd) {
            const startDate = new Date(dateStart);
            const endDate = new Date(dateEnd);
            if (startDate > endDate) {
                setDateStartError("Введите корректные данные");
                setDateEndError("Введите корректные данные");
                hasErrors = true;
            }
        }
        
        // Если есть ошибки - не отправлять запрос
        if (hasErrors) {
            console.log("Форма не валидна");
            return;
        }
        
        // Функция преобразования тональности
        const getTonalityForApi = (tonality) => {
            switch (tonality) {
                case '1': return 'Any';
                case '2': return 'Positive';
                case '3': return 'Negative';
                default: return 'Any';
            }
        };
        
        // Тело запроса
        const requestBody = {
            issueDateInterval: {
                startDate: new Date(dateStart).toISOString(),
                endDate: new Date(dateEnd).toISOString()
            },
            searchContext: {
                targetSearchEntitiesContext: {
                    targetSearchEntities: [
                        {
                            type: "Company",
                            inn: innDigits,
                            maxFullness: filters.maxFullness,
                            inBusinessNews: filters.businessContext
                        }
                    ],
                    onlyMainRole: filters.mainRole,
                    tonality: getTonalityForApi(tonalityValue),
                    onlyWithRiskFactors: filters.riskFactors
                }
            },
            searchArea: {
                includedSources: [],
                excludedSources: [],
                includedSourceGroups: [],
                excludedSourceGroups: [],
                includedDistributionMethods: [],
                excludedDistributionMethods: []
            },
            attributeFilters: {
                excludeTechNews: !filters.techNews,
                excludeAnnouncements: !filters.announcements,
                excludeDigests: !filters.newsDigest
            },
            similarMode: "None",
            intervalType: "Day",
            histogramTypes: ["TotalDocuments"],
            limit: countNum,
            offset: 0
        };
        
        console.log("Отправка запроса:", JSON.stringify(requestBody, null, 2));
        
        try {
            const accessToken = localStorage.getItem('accessToken');
            const apiBaseUrl = 'https://gateway.scan-interfax.ru';
            
            if (!accessToken) {
                console.error("Токен не найден");
                return;
            }
            
            const [histogramResponse, documentsResponse] = await Promise.all([
                fetch(`${apiBaseUrl}/api/v1/objectsearch/histograms`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(requestBody)
                }),
                fetch(`${apiBaseUrl}/api/v1/objectsearch`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        ...requestBody,
                        histogramTypes: undefined
                    })
                })
            ]);
            
            let histogramData = null;
            let totalCount = 0;
            
            if (histogramResponse.ok) {
                histogramData = await histogramResponse.json();
                console.log("Гистограмма получена:", histogramData);
                
                if (histogramData.data && histogramData.data.length > 0) {
                    const totalDocsHistogram = histogramData.data.find(h => h.histogramType === "totalDocuments");
                    if (totalDocsHistogram && totalDocsHistogram.data) {
                        totalCount = totalDocsHistogram.data.reduce((sum, item) => sum + item.value, 0);
                    }
                }
            } else {
                console.error("Ошибка гистограммы:", histogramResponse.status);
            }
            
            let documentIds = [];
            let totalDocumentsCount = 0;
            
            if (documentsResponse.ok) {
                const documentsData = await documentsResponse.json();
                console.log("ID документов получены:", documentsData);
                documentIds = documentsData.items?.map(item => item.encodedId) || [];
                totalDocumentsCount = documentsData.items?.length || 0;
            } else {
                console.error("Ошибка получения документов:", documentsResponse.status);
            }
            
            navigate('/result-search', { 
                state: { 
                    searchParams: {
                        inn: innDigits,
                        tonality: tonalityValue,
                        countDocks: countDocksValue,
                        dateStart: dateStart,
                        dateEnd: dateEnd,
                        filters: filters
                    },
                    results: {
                        documentIds: documentIds,
                        totalCount: totalCount,
                        totalDocumentsCount: totalDocumentsCount,
                        histogram: histogramData
                    }
                } 
            });
            
        } catch (error) {
            console.error("Ошибка при поиске:", error);
        }
    };



    if (isDesktop) {
        // Версия для 1440px и выше
        return (
            <div className="search">
                <div className="search-content">
                    <h1 className="search-title title">Найдите необходимые данные в пару кликов.</h1>
                    <p className="search-description">Задайте параметры поиска. 
                        <br />Чем больше заполните, тем точнее поиск
                    </p>
                    <div className="search-menu desktop-layout">
                        <div className="left-form">
                            <img className="document-image" src={documentImage} alt="document" />
                            <img className="folders-image" src={foldersImage} alt="folders" />
                            {renderInputINN()}
                            <div className="search-menu__tonality">
                                <p className="title__search-menu">Тональность</p>
                                <select 
                                    className="select-search tonality" 
                                    onChange={(e) => setTonalityValue(e.target.value)}
                                    value={tonalityValue}
                                >
                                    <option value="1">Любая</option>
                                    <option value="2">Позитивная</option>
                                    <option value="3">Негативная</option>
                                </select>
                            </div>
                            {renderInputCountDocks()}
                            <div className="search-menu__range">
                                <div className="title__search-menu__necessarily">
                                    <p className="title__search-menu">Диапазон поиска</p>
                                    <p className={`title__search-menu necessarily ${dateStartError || dateEndError ? 'necessarily-error' : ''}`}>
                                        *
                                    </p>
                                </div>
                                <div className="date-range__wrapper">
                                    <div className="date-input__container">
                                        <input
                                            ref={dateStartRef}
                                            type="text"
                                            placeholder="Дата начала"
                                            className={`select-search date-start ${dateStartError ? 'input-login__error' : ''}`}
                                            value={dateStart ? formatDisplayDate(dateStart) : ''}
                                            onFocus={(e) => {
                                                e.target.type = 'date';
                                                e.target.value = dateStart;
                                                setTimeout(() => {
                                                    if (dateStartRef.current) dateStartRef.current.showPicker();
                                                }, 100);
                                            }}
                                            onBlur={(e) => {
                                                if (!e.target.value) {
                                                    e.target.type = 'text';
                                                    handleDateStartChange('');
                                                } else if (e.target.type === 'date') {
                                                    handleDateStartChange(e.target.value);
                                                }
                                            }}
                                            onChange={(e) => {
                                                if (e.target.type === 'date') {
                                                    handleDateStartChange(e.target.value);
                                                }
                                            }}
                                        />
                                        {dateStartError && (
                                            <div className="error-message__date">
                                                <p>{dateStartError}</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="date-input__container">
                                        <input
                                            ref={dateEndRef}
                                            type="text"
                                            placeholder="Дата конца"
                                            className={`select-search date-end ${dateEndError ? 'input-login__error' : ''}`}
                                            value={dateEnd ? formatDisplayDate(dateEnd) : ''}
                                            onFocus={(e) => {
                                                e.target.type = 'date';
                                                e.target.value = dateEnd;
                                                setTimeout(() => {
                                                    if (dateEndRef.current) dateEndRef.current.showPicker();
                                                }, 100);
                                            }}
                                            onBlur={(e) => {
                                                if (!e.target.value) {
                                                    e.target.type = 'text';
                                                    handleDateEndChange('');
                                                } else if (e.target.type === 'date') {
                                                    handleDateEndChange(e.target.value);
                                                }
                                            }}
                                            onChange={(e) => {
                                                if (e.target.type === 'date') {
                                                    handleDateEndChange(e.target.value);
                                                }
                                            }}
                                        />
                                        {dateEndError && (
                                            <div className="error-message__date">
                                                <p>{dateEndError}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="right-column__search-menu">
                            <div className="search-checkbox__container">
                                <CustomCheckbox 
                                    label="Признак максимальной полноты"
                                    checked={filters.maxFullness}
                                    onChange={() => handleCheckboxChange('maxFullness')}
                                />
                                <CustomCheckbox 
                                    label="Упоминания в бизнес-контексте"
                                    checked={filters.businessContext}
                                    onChange={() => handleCheckboxChange('businessContext')}
                                />
                                <CustomCheckbox 
                                    label="Главная роль в публикации"
                                    checked={filters.mainRole}
                                    onChange={() => handleCheckboxChange('mainRole')}
                                />
                                <CustomCheckbox 
                                    label="Публикации только с риск-факторами"
                                    checked={filters.riskFactors}
                                    onChange={() => handleCheckboxChange('riskFactors')}
                                />
                                <CustomCheckbox 
                                    label="Включать технические новости рынков"
                                    checked={filters.techNews}
                                    onChange={() => handleCheckboxChange('techNews')}
                                />
                                <CustomCheckbox 
                                    label="Включать анонсы и календари"
                                    checked={filters.announcements}
                                    onChange={() => handleCheckboxChange('announcements')}
                                />
                                <CustomCheckbox 
                                    label="Включать сводки новостей"
                                    checked={filters.newsDigest}
                                    onChange={() => handleCheckboxChange('newsDigest')}
                                />
                            </div>
                            <div className="button-search__container">
                                <button 
                                    className={`search-button purple-button ${!isFormValid() ? 'button-disabled' : ''}`}
                                    disabled={!isFormValid()}
                                    onClick={handleSearch}
                                >
                                    Поиск
                                </button>
                                <p className="note">* Обязательные к заполнению поля</p>
                            </div>
                        </div>
                    </div>
                </div>
                <img className="search-image" src={searchImage} alt="search" />
            </div>
        );
    }

    // Мобильная версия
    return (
        <div className="search">
            <div className="search-content">
                <h1 className="search-title title">Найдите необходимые данные в пару кликов.</h1>
                <p className="search-description">Задайте параметры поиска. 
                    <br />Чем больше заполните, тем точнее поиск
                </p>
                <div className="search-menu">
                    <div>
                        <img className="document-image" src={documentImage} alt="document" />
                        {renderInputINN()}
                        <div className="search-menu__tonality">
                            <p className="title__search-menu">Тональность</p>
                            <select 
                                className="select-search tonality"
                                onChange={(e) => setTonalityValue(e.target.value)}
                                value={tonalityValue}
                            >
                                <option value="1">Любая</option>
                                <option value="2">Позитивная</option>
                                <option value="3">Негативная</option>
                            </select>
                        </div>
                        {renderInputCountDocks()}
                        <div className="search-menu__range">
                            <div className="title__search-menu__necessarily">
                                <p className="title__search-menu">Диапазон поиска</p>
                                <p className={`title__search-menu necessarily ${dateStartError || dateEndError ? 'necessarily-error' : ''}`}>
                                    *
                                </p>
                            </div>
                            <div className="date-range__wrapper">
                                <div className="date-input__container">
                                    <input
                                        ref={dateStartRef}
                                        type="text"
                                        placeholder="Дата начала"
                                        className={`select-search date-start ${dateStartError ? 'input-login__error' : ''}`}
                                        value={dateStart ? formatDisplayDate(dateStart) : ''}
                                        onFocus={(e) => {
                                            e.target.type = 'date';
                                            e.target.value = dateStart;
                                            setTimeout(() => {
                                                if (dateStartRef.current) dateStartRef.current.showPicker();
                                            }, 100);
                                        }}
                                        onBlur={(e) => {
                                            if (!e.target.value) {
                                                e.target.type = 'text';
                                                handleDateStartChange('');
                                            } else if (e.target.type === 'date') {
                                                handleDateStartChange(e.target.value);
                                            }
                                        }}
                                        onChange={(e) => {
                                            if (e.target.type === 'date') {
                                                handleDateStartChange(e.target.value);
                                            }
                                        }}
                                    />
                                    {dateStartError && (
                                        <div className="error-message__date">
                                            <p>{dateStartError}</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="date-input__container">
                                    <input
                                        ref={dateEndRef}
                                        type="text"
                                        placeholder="Дата конца"
                                        className={`select-search date-end ${dateEndError ? 'input-login__error' : ''}`}
                                        value={dateEnd ? formatDisplayDate(dateEnd) : ''}
                                        onFocus={(e) => {
                                            e.target.type = 'date';
                                            e.target.value = dateEnd;
                                            setTimeout(() => {
                                                if (dateEndRef.current) dateEndRef.current.showPicker();
                                            }, 100);
                                        }}
                                        onBlur={(e) => {
                                            if (!e.target.value) {
                                                e.target.type = 'text';
                                                handleDateEndChange('');
                                            } else if (e.target.type === 'date') {
                                                handleDateEndChange(e.target.value);
                                            }
                                        }}
                                        onChange={(e) => {
                                            if (e.target.type === 'date') {
                                                handleDateEndChange(e.target.value);
                                            }
                                        }}
                                    />
                                    {dateEndError && (
                                        <div className="error-message__date">
                                            <p>{dateEndError}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button 
                            className={`search-button purple-button ${!isFormValid() ? 'button-disabled' : ''}`}
                            disabled={!isFormValid()}
                            onClick={handleSearch}
                        >
                            Поиск
                        </button>
                        <p className="note">* Обязательные к заполнению поля</p>
                    </div>
                </div>
            </div>
            <img className="search-image" src={searchImage} alt="search" />
        </div>
    );
}