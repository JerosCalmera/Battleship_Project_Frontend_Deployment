
interface Props {
    shipInfo: string;
    shipDamage: string;
    turn: string;
    gameInfo: string;
    turnNumber: number;
    matchBegin: () => void;
    randomPlacement: () => void;
    matchStart: string;
    player1Data: string
    enemyShipsRemaining: number;
}


const GameInfoBox: React.FC<Props> = ({enemyShipsRemaining, player1Data, turnNumber, turn, gameInfo, shipInfo, matchBegin, randomPlacement, matchStart}) => {


    return (
        <>
            {player1Data.length > 1 ?
            <div className="gameInfoOuter">
                <div className="gameInfo">
                <h4>Turn: ({turnNumber}) {turn.includes("Computer") ? "Computer" : turn}</h4>
                    <h4>{gameInfo}</h4>
                    {shipInfo.length === 60 && matchStart.length > 1 ? <button onClick={matchBegin} className="button">Confirm Ready</button> : null}
                    {shipInfo.length > 1 && shipInfo.length < 60 ? <h4>Placing ships...</h4> : null}
                    {shipInfo.length < 1 && matchStart.length > 2 ? <button onClick={randomPlacement} className="button">Random Ship Placement</button> : null}
                    <h4>Enemy Ships remaining: {enemyShipsRemaining} "Test"</h4>
                </div>
            </div> : null}
        </>
    )
}

export default GameInfoBox