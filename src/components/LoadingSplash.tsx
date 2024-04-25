import { useEffect, useState } from "react"

interface Props {
    // setAttemptReconnect: React.Dispatch<React.SetStateAction<number>>;
    webSocketConnect: () => void; 
}


const LoadingSplash: React.FC<Props> = ({ webSocketConnect }) => {
    const [loading, setLoading] = useState<string>("Connecting to game server");

    useEffect(() => {
        const interval = setInterval(() => {
            setLoading(prevText => {
                const points = prevText.length >= 30 ? "Connecting to game server" : prevText + ".";
                webSocketConnect()
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