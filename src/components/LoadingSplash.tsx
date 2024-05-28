import { useEffect, useState } from "react"

interface Props {

}


const LoadingSplash: React.FC<Props> = ({}) => {
    const [loading, setLoading] = useState<string>("Connecting to game server");

    // Displays that the game is attempting to connect to the backend in an animated fashion
    useEffect(() => {
        const interval = setInterval(() => {
            setLoading(prevText => {
                const points = prevText.length >= 30 ? "Connecting to game server" : prevText + ".";
                return points
            });
    }, 500);

    return () => clearInterval(interval);
}, []);

    return (
        <>
        <div className="bugReportPageFade">
            <div className="loadingOuter">
                <div className="loadingFlash">
                <h3>{loading}</h3>
                </div>
            </div>
        </div>
        </>
    )
}

export default LoadingSplash