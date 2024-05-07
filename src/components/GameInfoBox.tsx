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
}


const GameInfoBox: React.FC<Props> = ({enemyShipsRemaining, player1Data, turnNumber, turn, gameInfo, shipInfo, matchBegin, randomPlacement}) => {

    const [readyStatus, setReadyStatus] = useState<string>("Not Ready")

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
                    {shipInfo.length <= 1 && shipInfo.length < 60 && readyStatus != "Ready" ? <h4>Waiting on ship placement</h4> : null}
                    {shipInfo.length === 60 && readyStatus != "Ready" ? <h4>Waiting for all players to be ready</h4> : null}
                    <div className="centre">
                    {shipInfo.length === 60 && readyStatus === "Not Ready" ? <button onClick={handleConfirmReady} className="button">Confirm Ready</button> : null}
                    {shipInfo.length > 1 && shipInfo.length < 60 ? <h4>Placing ships...</h4> : null}
                    {shipInfo.length < 1 && readyStatus === "Not Ready" ? <button onClick={randomPlacement} className="button">Random Ship Placement</button> : null}
                    </div>
                    {shipInfo.length > 1 && readyStatus === "Ready" ? <h4>Enemy Ships remaining: {enemyShipsRemaining}</h4> : null}
                </div>
            </div> : null}
        </>
    )
}

export default GameInfoBox