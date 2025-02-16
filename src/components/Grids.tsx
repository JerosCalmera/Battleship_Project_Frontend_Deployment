import GameInfoBox from './GameInfoBox';
import './Grids.css'
import { useEffect, useState } from "react";

interface StompClient {
    send(destination: string, headers?: Record<string, string>, body?: string): void;
}
interface Props {
    shipInfo: string;
    shipDamage: string;
    enemyShipDamage: string;
    stompClient: StompClient;
    savedName: string;
    player1Data: string;
    player2Data: string;
    placedShip: string;
    player2Name: string;
    miss: string;
    enemyMiss: string;
    turn: string;
    playerName: string;
    gameInfo: string;
    turnNumber: number;
    setPlacedShip: React.Dispatch<React.SetStateAction<string>>;
    enemyShipsRemaining: number;
}

const Grids: React.FC<Props> = ({ enemyShipsRemaining, gameInfo, turnNumber, playerName, turn, miss, enemyMiss, player2Name, placedShip, setPlacedShip, player1Data, player2Data, savedName, shipInfo, shipDamage, enemyShipDamage, stompClient }) => {

    const [shipPlacement, setShipPlacement] = useState<boolean>(false)
    const [placedReadyShip, setPlacedReadyShip] = useState<string>("")
    const [shipSize, setShipSize] = useState<number>(0)
    const [shipToPlace, setShipToPlace] = useState<string>("")

    const [carrier, setCarrier] = useState<number>(1)
    const [battleship, setBattleship] = useState<number>(2)
    const [cruiser, setCruiser] = useState<number>(3)
    const [destroyer, setDestroyer] = useState<number>(4)

    const [random, setRandom] = useState<number>(0)

    let shipTypeLetter = "X"

    // When a ship is placed, removes that ship from the total unplaced ships
    useEffect(() => {
        const shipType = "CarrierBattleshipCruiserDestroyer";
        const ship = placedShip;
        if (ship.includes(shipType && savedName)) {
            if (ship.includes("Carrier")) { setCarrier(carrier - 1); shipTypeLetter = "CA" }
            else if (ship.includes("Battleship")) { setBattleship(battleship - 1); shipTypeLetter = "B" }
            else if (ship.includes("Cruiser")) { setCruiser(cruiser - 1); shipTypeLetter = "C" }
            else if (ship.includes("Destroyer")) { setDestroyer(destroyer - 1); shipTypeLetter = "D" }
            setPlacedShip("");
            setShipToPlace("");
            stompClient.send("/app/startup", {}, JSON.stringify(playerName));
        }
    }, [placedShip])

    // Resets states if a placement is invalid
    useEffect(() => {
        if (placedShip.includes("Invalid"))
            setPlacedReadyShip("")
        setShipToPlace("")
    }, [placedShip])

    // Creates the players grid
    const populateGrid = () => {
        const letter: Array<string> = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        const value: Array<string> = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
        const end = [];
        for (let i = 0; i < 10; i++) {
            const buttons = [];
            for (let j = 0; j < 10; j++) {
                const cellValue: any = letter[i] + value[j];
                buttons.push(
                    <button key={cellValue}
                        onClick={() => clickedCell(cellValue)}
                        className={stylingCell(cellValue)}>{shipTypeLetter}</button>);
            }
            end.push(
                <div>
                    <button className="endCell">
                        {letter[i]}
                    </button>
                    {buttons}
                </div>)
        }
        return end;
    }

    // Creates the opponent players grid
    const populateEnemyGrid = () => {
        const letter: Array<string> = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        const value: Array<string> = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
        const end = [];
        for (let i = 0; i < 10; i++) {
            const buttons = [];
            for (let j = 0; j < 10; j++) {
                const cellValue: any = letter[i] + value[j];
                buttons.push(
                    <button key={cellValue}
                        onClick={() => clickedEnemyCell(cellValue)}
                        className={stylingEnemyCell(cellValue)}>{shipType}</button>);
            }
            end.push(
                <div>
                    <button className="endCell">
                        {letter[i]}
                    </button>
                    {buttons}
                </div>)
        }
        return end;
    }

    // Conditional styling for displaying game information
    const stylingCell = (cellValue: string) => {
        if (miss.includes(cellValue)) { return "miss" }
        else if (shipDamage.includes(cellValue)) { return "cellDamaged" }
        else if (shipInfo.includes(cellValue)) { return "cellShip" }
        else if (placedReadyShip.includes(cellValue)) { return "cellPlaced" }
        else return "cell"
    }

    // Conditional styling for displaying game information
    const stylingEnemyCell = (cellValue: string) => {
        if (enemyShipDamage.includes(cellValue)) { return "cellEnemyShip" }
        else if (enemyMiss.includes(cellValue)) { return "miss" }
        else return "cell"
    }

    // Conditional styling for the ship placement display
    const shipToPlaceStyle = (value: string) => {
        if (shipToPlace === "Carrier" && value === "Carrier") { return "shipToPlaceSelected " }
        else if (shipToPlace === "Battleship" && value === "Battleship") { return "shipToPlaceSelected " }
        else if (shipToPlace === "Cruiser" && value === "Cruiser") { return "shipToPlaceSelected " }
        else if (shipToPlace === "Destroyer" && value === "Destroyer") { return "shipToPlaceSelected " }
        else { return "shipToPlace" }
    }

    // Displays the numbers on the bottom of the grids
    const numbersBottom = () => {
        const numbers = [];
        for (let i = 0; i < 10; i++) {
            numbers.push(
                <button className="endCell">{i + 1}</button>
            )
        }
        return numbers
    }

    // Sends to the backend that a player wishes to let the computer place their ships, avoids repeat requests
    const randomPlacement = () => {
        if (random === 0) {
            stompClient.send("/app/randomPlacement", {}, JSON.stringify(savedName));
            setRandom(1)
        }
        else { return }
    }

    // Logic for placing of ships, checks what ship is selected and that two cells have been clicked to send to the backend for auto completion for the rest of the ship if needed
    const clickedCell = (value: string) => {
        if (shipPlacement === false) {
            if (carrier > 0 && shipToPlace === "Carrier" ||
                battleship > 0 && shipToPlace === "Battleship" ||
                cruiser > 0 && shipToPlace === "Cruiser" ||
                destroyer > 0 && shipToPlace === "Destroyer") {
                stompClient.send("/app/placement", {}, JSON.stringify(value + shipSize + savedName));
                setPlacedReadyShip(placedReadyShip + value)
            }
            else if (shipInfo.includes(value)) { return }
            {
                if (placedReadyShip.length === 2) {
                    setPlacedReadyShip("")
                    setShipToPlace("")
                }
            }
        }
    }

    // Logic for checking a clicked opponent cell is valid and sends that information to the backend if so
    const clickedEnemyCell = (value: string) => {
        if (shipPlacement === true) {
            if (turn === playerName) {
                if (enemyMiss.includes(value) || enemyShipDamage.includes(value)) { null }
                else
                    stompClient.send("/app/gameData", {}, JSON.stringify(value + player2Name.slice(0, 4) + playerName));

            }
        }
    }

    // Checks for what ships has been selected for placement
    const placeCarrier = () => {
        setShipSize(5);
        setShipToPlace("Carrier")
    }

    const placeBattleship = () => {
        setShipSize(4);
        setShipToPlace("Battleship")
    }

    const placeCruiser = () => {
        setShipSize(3);
        setShipToPlace("Cruiser")
    }

    const placeDestroyer = () => {
        setShipSize(2);
        setShipToPlace("Destroyer")
    }

    // Notify the backend that a player is ready and ends the ship placement phase for that player
    const matchBegin = () => {
        stompClient.send("/app/matchStart", {}, JSON.stringify(savedName));
        setShipPlacement(true)
    }

    return (
        <>
            <GameInfoBox enemyShipsRemaining={enemyShipsRemaining} player1Data={player1Data} shipInfo={shipInfo} shipDamage={shipDamage} turn={turn} gameInfo={gameInfo} turnNumber={turnNumber}
                matchBegin={matchBegin} randomPlacement={randomPlacement} />
            <div className="gameBoardOuterGreater">
                <div className="gameBoardOuter">
                    <div className="shipPlacementOuter">
                        <div className="shipPlacementInner">
                            {carrier > 0 && shipInfo.length < 60 ?
                                <ul>
                                    <button onClick={placeCarrier} className={shipToPlaceStyle("Carrier")}>*</button>
                                    <button onClick={placeCarrier} className={shipToPlaceStyle("Carrier")}>*</button>
                                    <button onClick={placeCarrier} className={shipToPlaceStyle("Carrier")}>*</button>
                                    <button onClick={placeCarrier} className={shipToPlaceStyle("Carrier")}>*</button>
                                    <button onClick={placeCarrier} className={shipToPlaceStyle("Carrier")}>*</button>
                                    <h4>Carrier: x{carrier}</h4><br />
                                </ul>
                                : null}
                            {battleship > 0 && shipInfo.length < 60 ?
                                <ul>
                                    <button onClick={placeBattleship} className={shipToPlaceStyle("Battleship")}>*</button>
                                    <button onClick={placeBattleship} className={shipToPlaceStyle("Battleship")}>*</button>
                                    <button onClick={placeBattleship} className={shipToPlaceStyle("Battleship")}>*</button>
                                    <button onClick={placeBattleship} className={shipToPlaceStyle("Battleship")}>*</button>
                                    <h4>Battleship: x{battleship}</h4><br />
                                </ul>
                                : null}
                            {cruiser > 0 && shipInfo.length < 60 ?
                                <ul>
                                    <button onClick={placeCruiser} className={shipToPlaceStyle("Cruiser")}>*</button>
                                    <button onClick={placeCruiser} className={shipToPlaceStyle("Cruiser")}>*</button>
                                    <button onClick={placeCruiser} className={shipToPlaceStyle("Cruiser")}>*</button>
                                    <h4>Cruiser: x{cruiser}</h4> <br />
                                </ul>
                                : null}
                            {destroyer > 0 && shipInfo.length < 60 ?
                                <ul>
                                    <button onClick={placeDestroyer} className={shipToPlaceStyle("Destroyer")}>*</button>
                                    <button onClick={placeDestroyer} className={shipToPlaceStyle("Destroyer")}>*</button>
                                    <h4>Destroyer: x{destroyer}</h4><br />
                                </ul>
                                : null}
                        </div>
                    </div>
                    <div className="gameBoardRender">
                        <div className="gridTitle">
                            <h3>{player1Data.includes("Computer") ? player1Data.includes(savedName) ? "Error" : "Setting up...." : player1Data}</h3>
                        </div>
                        <ul>
                            {populateGrid()}
                            <button name="end" className="endCellCorner">*</button>
                            {numbersBottom()}
                        </ul>
                    </div >
                    <div className="gameBoardRender2">
                        <div className="gridTitle">
                            <h3>{player2Data.includes("Computer") ? player2Data.includes(savedName) ? !player2Data.includes(savedName) ? player2Data : "Computer " : "Computer" : player2Data}</h3>
                        </div>
                        <ul>
                            {populateEnemyGrid()}
                            <button name="end" className="endCellCorner">*</button>
                            {numbersBottom()}
                        </ul>
                    </div>
                </div >
            </div >
        </>
    )
}

export default Grids