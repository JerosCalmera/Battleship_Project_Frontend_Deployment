import { useEffect} from "react"

interface Props {
    loading: string;
    setLoading: React.Dispatch<React.SetStateAction<string>>;
}


const LoadingSplash: React.FC<Props> = ({ loading, setLoading }) => {

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