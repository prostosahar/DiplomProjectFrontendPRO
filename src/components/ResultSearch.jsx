import { useEffect, useState, useRef } from "react"
import { useLocation } from "react-router-dom"
import backButton from "../images/back-button.svg"
import nextButton from "../images/next-button.svg"
import resultImage from "../images/image-result.svg"
import timerImage from "../images/timer.png"
import blockImage from "../images/block.png"
import searchImage from "../images/search.png"
import testImage from "../images/test-image.png"
import imageLoading from '../images/loader.png'

export function ResultSearch()
{
    const location = useLocation();
    const results = location.state?.results || null;
    
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [allDocumentIds, setAllDocumentIds] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [histogramData, setHistogramData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1440);
    
    const [loadedCount, setLoadedCount] = useState(0);
    const BATCH_SIZE = 10;
    const [hasMore, setHasMore] = useState(true);
    
    // Флаг, чтобы предотвратить повторную загрузку
    const isFirstLoadDone = useRef(false);

    const cards = [
        {image: timerImage, description:"Высокая и оперативная скорость обработки заявки"},
        {image: searchImage, description:"Огромная комплексная база данных, обеспечивающая объективный ответ на запрос"},
        {image: blockImage, description:"Защита конфиденциальных сведений, не подлежащих разглашению по федеральному законодательству"}
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1440);
            setCurrentPage(0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (results && !isFirstLoadDone.current) {
            isFirstLoadDone.current = true;
            console.log("Получены результаты:", results);
            
            if (results.histogram && results.histogram.data) {
                const totalDocsData = results.histogram.data.find(
                    item => item.histogramType === "totalDocuments"
                );
                if (totalDocsData && totalDocsData.data) {
                    setHistogramData(totalDocsData.data);
                }
            }
            
            if (results.documentIds && results.documentIds.length > 0) {
                setAllDocumentIds(results.documentIds);
                setTotalCount(results.totalDocumentsCount || results.documentIds.length);
                loadDocumentsBatch(results.documentIds, 0, BATCH_SIZE);
            } else {
                setLoading(false);
                setHasMore(false);
            }
        }
    }, [results]);

    const loadDocumentsBatch = async (ids, start, count) => {
        const end = start + count;
        const batchIds = ids.slice(start, end);
        
        if (batchIds.length === 0) {
            setLoading(false);
            setHasMore(false);
            return;
        }
        
        try {
            const accessToken = localStorage.getItem('accessToken');
            const apiBaseUrl = 'https://gateway.scan-interfax.ru';
            
            const requestBody = { ids: batchIds };
            
            console.log("Загрузка документов, ID:", batchIds);
            
            const response = await fetch(`${apiBaseUrl}/api/v1/documents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(requestBody)
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log("Получено документов:", data.length);
                
                const newDocuments = data
                    .filter(item => item.ok)
                    .map(item => item.ok);
                
                setDocuments(prev => {
                    const existingIds = new Set(prev.map(doc => doc.id));
                    const uniqueNewDocs = newDocuments.filter(doc => !existingIds.has(doc.id));
                    return [...prev, ...uniqueNewDocs];
                });
                
                setLoadedCount(prev => prev + newDocuments.length);
                
                if (end >= ids.length) {
                    setHasMore(false);
                }
            } else {
                const errorText = await response.text();
                console.error("Ошибка загрузки документов:", response.status, errorText);
            }
        } catch (error) {
            console.error("Сетевая ошибка:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = () => {
        if (!hasMore || loadingMore || loading) return;
        setLoadingMore(true);
        const nextStart = loadedCount;
        loadDocumentsBatch(allDocumentIds, nextStart, BATCH_SIZE);
    };

    const nextCard = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === cards.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevCard = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? cards.length - 1 : prevIndex - 1
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatNumber = (num) => {
        if (!num) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const getDocumentTags = (doc) => {
        const tags = [];
        if (doc.attributes?.isTechNews) tags.push("Технические новости");
        if (doc.attributes?.isAnnouncement) tags.push("Анонсы и события");
        if (doc.attributes?.isDigest) tags.push("Сводки новостей");
        return tags;
    };

    const mobileItemsPerPage = 1;
    const mobileTotalPages = Math.ceil(histogramData.length / mobileItemsPerPage);
    const currentMobileItem = histogramData[currentPage];

    const desktopItemsPerPage = 8;
    const desktopTotalPages = Math.ceil(histogramData.length / desktopItemsPerPage);
    const startIndex = currentPage * desktopItemsPerPage;
    const desktopHistogramData = histogramData.slice(startIndex, startIndex + desktopItemsPerPage);

    const nextHistogramPage = () => {
        if (isDesktop) {
            if (currentPage + 1 < desktopTotalPages) {
                setCurrentPage(currentPage + 1);
            }
        } else {
            if (currentPage + 1 < mobileTotalPages) {
                setCurrentPage(currentPage + 1);
            }
        }
    };

    const prevHistogramPage = () => {
        if (currentPage - 1 >= 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const totalHistogramPages = isDesktop ? desktopTotalPages : mobileTotalPages;

    const getDocumentImage = (doc) => {
        if (doc.content?.markup) {
            const imgMatch = doc.content.markup.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch && imgMatch[1]) return imgMatch[1];
        }
        return testImage;
    };

    if (loading && documents.length === 0) {
        return (
            <div className="result-search">
                <div className="wait-preview__container">
                    <div>
                        <h1 className="title__wait-preview">Ищем. Скоро будут результаты</h1>
                        <p className="description__wait-preview">Поиск может занять некоторое время, просим сохранять терпение.</p>
                    </div>
                    <img src={resultImage} className="wait-image" alt="result" />
                </div>
                <div className="loader-wrapper">
                    <img src={imageLoading} className="loader" alt="loading" />
                </div>
            </div>
        );
    }

    return(
        <div className="result-search">
            <div className="wait-preview__container">
                <div>
                    <h1 className="title__wait-preview">Ищем. Скоро будут результаты</h1>
                    <p className="description__wait-preview">Поиск может занять некоторое время, просим сохранять терпение.</p>
                </div>
                <img src={resultImage} className="wait-image" alt="result" />
            </div>
            
            {histogramData.length > 0 && (
                <div className="summary">
                    <h1 className="summary-preview title">Общая сводка</h1>
                    <p className="count-variants">Найдено {formatNumber(totalCount)} вариантов</p>
                    
                    <div className="summary-carousel">
                        <button className="card-carousel__buttons back" onClick={prevHistogramPage} disabled={currentPage === 0}>
                            <img src={backButton} alt="back" />
                        </button>
                        
                        <div className="summary-table__wrapper">
                            {isDesktop ? (
                                <table className="summary-table">
                                    <tbody>
                                        <tr>
                                            <th className="header__summary-carousel tr-table period">Период</th>
                                            {desktopHistogramData.map((item, index) => (
                                                <td key={index}>{formatDate(item.date)}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <th className="header__summary-carousel tr-table">Всего</th>
                                            {desktopHistogramData.map((item, index) => (
                                                <td key={index}>{item.value}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <th className="header__summary-carousel tr-table">Риски</th>
                                            {desktopHistogramData.map((item, index) => (
                                                <td key={index}>{item.riskCount || 0}</td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <table className="summary-table">
                                    <thead>
                                        <tr className="header__summary-carousel">
                                            <th className="summary-table__cell tr-table">Период</th>
                                            <th className="summary-table__cell tr-table">Всего</th>
                                            <th className="summary-table__cell tr-table">Риски</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentMobileItem && (
                                            <tr className="summary-table__row">
                                                <td className="summary-table__cell body-table">
                                                    {formatDate(currentMobileItem.date)}
                                                </td>
                                                <td className="summary-table__cell body-table">{currentMobileItem.value}</td>
                                                <td className="summary-table__cell body-table">{currentMobileItem.riskCount || 0}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        
                        <button className="card-carousel__buttons next" onClick={nextHistogramPage} disabled={currentPage + 1 >= totalHistogramPages}>
                            <img src={nextButton} alt="next" />
                        </button>
                    </div>
                </div>
            )}

            <div className="list-docks">
                <h1 className="list-docks__title title">Список документов</h1>
                <div className="cards-docks">
                    {documents.map((dock, index) => {
                        const tags = getDocumentTags(dock);
                        return (
                            <div className="card-dock" key={dock.id || index}>
                                <div className="card-dock__header">
                                    <span className="card-dock__date">{formatDate(dock.issueDate)}</span>
                                    <a 
                                        href={dock.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="card-dock__publisher"
                                    >
                                        {dock.source?.name || "Источник не указан"}
                                    </a>
                                </div>
                                <h2 className="card-dock__title">{dock.title?.text || "Без названия"}</h2>
                                
                                {tags.length > 0 && (
                                    <div className="card-dock__tags">
                                        {tags.map((tag, tagIndex) => (
                                            <span key={tagIndex} className="card-dock__tag">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="card-dock__image-container">
                                    <img src={getDocumentImage(dock)} alt="news" className="card-dock__image" />
                                </div>
                                <p className="card-dock__description">
                                    {dock.content?.markup?.replace(/<[^>]*>/g, '').substring(0, 300) || "Описание отсутствует"}...
                                </p>
                                <div className="card-dock__footer">
                                    <button 
                                        className="card-dock__more-btn"
                                        onClick={() => dock.url && window.open(dock.url, '_blank')}
                                    >
                                        Читать в источнике
                                    </button>
                                    <span className="card-dock__words-count">
                                        {dock.attributes?.wordCount ? `${formatNumber(dock.attributes.wordCount)} слов` : "Количество слов не указано"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {loadingMore && (
                    <div className="loader-more">
                        <img src={imageLoading} className="loader-small" alt="loading" />
                    </div>
                )}
                
                {hasMore && !loadingMore && documents.length > 0 && (
                    <button className="more-button purple-button" onClick={loadMore}>
                        Показать больше
                    </button>
                )}
            </div>
        </div>
    );
}