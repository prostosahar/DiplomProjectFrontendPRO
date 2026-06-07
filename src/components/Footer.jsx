import logo from "../images/logo-footer.png"

export function Footer()
{
    
    return(
        <div id="footer">
            <img src={logo} className="logo-footer"></img>
            <div className="info-footer">
                <p className="contacts">г. Москва, Цветной б-р, 40
                    +7 495 771 21 11
                    info@skan.ru
                </p>
                <p className="copyright">Copyright. 2022</p>
            </div>
        </div>
    );
}