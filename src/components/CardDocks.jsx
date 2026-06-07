export function CardDocks({ date, publisher, title, typeNews, image, description, countWords }) {
    return (
        <div className="card-dock">
            <div className="card-dock__header">
                <span className="card-dock__date">{date}</span>
                <span className="card-dock__publisher">{publisher}</span>
            </div>
            <h2 className="card-dock__title">{title}</h2>
            <span className="card-dock__type">{typeNews}</span>
            <img src={image} alt="news" className="card-dock__image" />
            <p className="card-dock__description">{description}</p>
            <div className="card-dock__footer">
                <button className="card-dock__more-btn">Читать в источнике</button>
                <span className="card-dock__words-count">{countWords}</span>
            </div>
        </div>
    );
}