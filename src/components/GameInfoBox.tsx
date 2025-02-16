import { useState } from "react";

interface Props {
    shipInfo: string;
    shipDamage: string;
    turn: string;
    gameInfo: string;
    turnNumber: number;
    matchBegin: () => void;
    randomPlacement: () => void;
    player1Data: string
    enemyShipsRemaining: number;
    friendlyShipsRemaining: number;
}


const GameInfoBox: React.FC<Props> = ({ friendlyShipsRemaining, enemyShipsRemaining, player1Data, turnNumber, turn, gameInfo, shipInfo, matchBegin, randomPlacement }) => {

    const [readyStatus, setReadyStatus] = useState<string>("Not Ready")

    // Confirms the player is ready to begin the match
    const handleConfirmReady = () => {
        matchBegin();
        setReadyStatus("Ready")
    }

    return (
        <>
            {player1Data.length > 1 ?
                <div className="gameInfoOuter">
                    <div className="gameInfo">
                        {shipInfo.length > 1 && readyStatus === "Ready" ? <h4>Last Turn: {gameInfo}</h4> : null}
                        <h4>Turn ({turnNumber}): {turn.includes("Computer") ? "Computer" : turn}</h4>
                        {shipInfo.length < 60 && readyStatus != "Ready" ? <h4>Waiting on ship placement</h4> : null}
                        {shipInfo.length === 60 && readyStatus != "Ready" ? <h4>Waiting for all players to be ready</h4> : null}
                        <div className="centre">
                            {shipInfo.length === 60 && readyStatus === "Not Ready" ? <><br /> <button onClick={handleConfirmReady} className="button">Ready</button></> : null}
                            {shipInfo.length > 1 && shipInfo.length < 60 ? <><br /><h4>Placing ships...</h4></> : null}
                            {shipInfo.length < 1 && readyStatus === "Not Ready" ? <button onClick={randomPlacement} className="button">Random Ship Placement</button> : null}
                        </div>
                        {shipInfo.length > 1 && readyStatus === "Ready" ? <h4>Enemy Ships remaining: {enemyShipsRemaining}</h4> : null}
                        {shipInfo.length > 1 && readyStatus === "Ready" ? <h4>Friendly Ships remaining: {friendlyShipsRemaining}</h4> : null}
                    </div >
                </div > : null}
        </>
    )
}

export default GameInfoBox