import Stomp, {} from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useRef, useState } from "react";
import Grids from "../components/Grids";
import StartUp from "../components/StartUp";
import LoadingSplash from "../components/LoadingSplash";

function GameBoard() {

    // WebSocket connection information
    const BASE_URL = "https://solar-fury-backend-v1-a5761b56a343.herokuapp.com"
    const [stompClient, setStompClient] = useState<Stomp.Client>(Stomp.over(new SockJS(`${BASE_URL}/game`)));

    const [serverStatus, setServerStatus] = useState(false)
    const [attemptReconnect, setAttemptReconnect] = useState(0)
    const [serverMessageLog, serverSetMessageLog] = useState("")

    const [leaderBoard, setLeaderBoard] = useState<string[]>([])

    const [shipInfo, setShipInfo] = useState<string>("")
    const [shipDamage, setShipDamage] = useState<string>("")
    const [enemyShipsRemaining, setEnemyShipsRemaining] = useState<number>(10)

    const [enemyShipDamage, setEnemyShipDamage] = useState<string>("")

    const [damageCheck, setDamageCheck] = useState<string>("")

    const [missCheck, setMissCheck] = useState<string>("")
    const [miss, setMiss] = useState<string>("")
    const [enemyMiss, setEnemyMiss] = useState<string>("")

    const [password, setPassword] = useState<string>("")
    const [passwordEntry, setPasswordEntry] = useState<string>("No Password")

    const [playerName, setPlayerName] = useState<string>("")
    const [nameValidated, setNameValidated] = useState<boolean>(false)
    const [savedName, setSaveName] = useState<string>("name")
    const [ready, setReady] = useState<string>("name")

    const [roomSaved, setRoomSaved] = useState<boolean>(false)
    const [roomSynced, setRoomSynced] = useState<boolean>(false)

    const [chat, setChat] = useState<string[]>(["", "", "", "", "", "", "", "", "", ""])
    const [chatEntry, setChatEntry] = useState<string>("")

    const [player1Data, setPlayer1Data] = useState<string>("Player 1")
    const [player2Data, setPlayer2Data] = useState<string>("Player 2")
    const [player2Name, setPlayer2Name] = useState<string>("Player 2")

    const [winner, setWinner] = useState("unknown")

    const [placedShip, setPlacedShip] = useState<string>("")
    const [cellStorage, setCellStorage] = useState<string>("")

    const [gameInfo, setGameInfo] = useState<string>("")
    const [turn, setTurn] = useState<string>("Ship Placement Phase")
    const [turnNumber, setTurnNumber] = useState<number>(-1)

    const [bugReport, setBugReport] = useState<number>(0)
    const [bugReportInput, setBugReportInput] = useState<string>("")

    const [startUpFlash, setStartUpFlash] = useState<number>(1)
    const [gameFlash, setGameFlash] = useState<number>(1)
    const [playerLeft, setPlayerLeft] = useState<number>(1)

    const [chatStorage, setChatStorage] = useState<string>("empty")

    const [loading, setLoading] = useState<boolean>(false)

    // WebSocket connection with error handling
    useEffect(() => {
        const connectToWebSocket = () => {
        const socket = new SockJS(`${BASE_URL}/game`);
        const client = Stomp.over(socket);

        if (serverStatus != true) {
        client.connect({}, () => {
            setServerStatus(true)
            setStompClient(client);

            client.subscribe("/topic/connect", (message: any) => {
                serverSetMessageLog(message.body.slice(12, -2));
                setServerStatus(true)
            });
            client.subscribe("/topic/hidden", (message: any) => {
                if (passwordEntry == "No Password") {
                    setPasswordEntry(roomNumberSave.current);}         
                const newMessage: string = message.body.slice(12, -2)
                if (newMessage.includes(roomNumberSave.current)) {
                hiddenParse(message.body.slice(12, -2))}
            });
            client.subscribe("/topic/nameValidated", (message: any) => {
                nameValidation(message.body.slice(12, -2));
            });
            client.subscribe("/topic/gameInfo", (message: any) => {
                const newMessage: string = message.body.slice(12, -2)
                if (newMessage.includes(roomNumberSave.current)) {
                setGameInfo(message.body.slice(16, -2))}
            });
            client.subscribe("/topic/gameData", (message: any) => {
                const newMessage: string = message.body.slice(12, -2)
                if (newMessage.includes(roomNumberSave.current)) {
                setCellStorage(message.body.slice(16, -2))}
            });

            client.subscribe("/topic/turn", (message: any) => {
                const newMessage: string = message.body.slice(12, -2)
                if (newMessage.includes(roomNumberSave.current)) {
                setTurn(message.body.slice(16, -2))}
            });
            client.subscribe("/topic/gameData2", (message: any) => {
                const newMessage: string = message.body.slice(12, -2)
                if (newMessage.includes(roomNumberSave.current)) {
                setShipDamage(message.body.slice(16, -2))}
            });
            client.subscribe("/topic/placement", (message: any) => {
                const newMessage: string = message.body.slice(12, -2)
                if (newMessage.includes(roomNumberSave.current)) {
                setShipDamage(message.body.slice(16, -2))}
            });
            client.subscribe("/topic/miss", (message: any) => {
                const newMessage: string = message.body.slice(12, -2)
                if (newMessage.includes(roomNumberSave.current)) {
                setMissCheck(message.body.slice(16, -2))}
            });

            client.subscribe("/topic/chat", (message: any) => {
                chatParse(message)
                });

            client.subscribe("/topic/globalChat", (message: any) => {
                globalChatParse(message)
                });

            client.subscribe("/topic/playerData1", (message: any) => {
                const newMessage: string = message.body.slice(12, -2)
                if (newMessage.includes(roomNumberSave.current)) {
                setPlayer1Data(message.body.slice(16, -2))}
            })
            client.subscribe("/topic/playerData2", (message: any) => {
                const newMessage: string = message.body.slice(12, -2)
                if (newMessage.includes(roomNumberSave.current)) {
                setPlayer2Data(message.body.slice(16, -2))}
            });

            client.subscribe("/topic/computer", () => {
            });

            client.subscribe("/topic/randomPlacement", () => {
            });

            client.subscribe("/topic/leaderBoard", (message: any) => {
                const leaderBoardEntry: string = message.body.slice(12, -2)
                if (!leaderBoardSave.current.includes(leaderBoardEntry)) {
                setLeaderBoard((prevLeader) => {
                    const updatedLeader = [...prevLeader, leaderBoardEntry];
                    return updatedLeader.slice(-10)
                })
            }}
            );

            client.subscribe("/topic/gameUpdate", (message: any) => {
                const newMessage: string = message.body.slice(12, -2)
                if (newMessage.includes(roomNumberSave.current)) {
                setPlayer1Data(message.body.slice(16, -2))}
            });

            client.subscribe("/topic/enemyDamage", (message: any) => {
                const newMessage: string = message.body.slice(12, -2)
                if (newMessage.includes(roomNumberSave.current)) {
                setDamageCheck(message.body.slice(16, -2))}
            });

            client.subscribe("/topic/startup", (message: any) => {
                const newMessage: string = message.body.slice(12, -2)
                if (newMessage.includes(roomNumberSave.current)) {
                setPlayer1Data(message.body.slice(16, -2))}
            });

            client.subscribe("/topic/placement2", (message: any) => {
                const newMessage: string = message.body.slice(12, -2)
                if (newMessage.includes(roomNumberSave.current)) {
                setPlacedShip(message.body.slice(16, -2))}
            });

            client.subscribe("/topic/winner", (message: any) => {
                const newMessage: string = message.body.slice(12, -2)
                if (newMessage.includes(roomNumberSave.current)) {
                setWinner(message.body.slice(16, -2))}
            });

            client.send("/app/hello", {}, JSON.stringify(`Client Connected on ${BASE_URL}`));

        }, (error) => {
                console.error("Connection failed, reconnecting....", error)
                setServerStatus(false);
                setTimeout(connectToWebSocket, 1000);
        });

            socket.onclose = () => {
                (console.log("Connection closed"))
                setServerStatus(false);
                setTimeout(connectToWebSocket, 1000);
            };
            setStompClient(client)
        };
        }
        connectToWebSocket();

        return () => {
            if (stompClient) {
                stompClient.disconnect(() => {
                console.log("Connection disconnected");
                });
                setServerStatus(false)
            }
        }
    }, [])

    // Loading splash screen toggle
    useEffect(() => {
        if (loading == true) {
            setLoading(false)
        }
    }, [nameValidated, serverMessageLog, roomSaved, roomSynced])

    // Logic for checking who a missed shot belongs to for display
    useEffect(() => {
        if (missCheck.includes(playerNameSave.current)) {
            setMiss(miss + missCheck);
        }
        else if (!missCheck.includes(playerNameSave.current)) {
            setEnemyMiss(enemyMiss + missCheck)
        }
    }, [missCheck])

    // Trigger for getting leaderboard information from the backend
    useEffect(() => {
        setLeaderBoard
        if (serverMessageLog === "Game server ready...." && leaderBoard.length < 1) {
            stompClient.send("/app/leaderBoard", {}, JSON.stringify("Game start"));
        }
    }, [serverMessageLog]);

    // Trims cell storage information to ensure data clarity
    useEffect(() => {
        const toTrim = cellStorage;
        if (toTrim.includes(savedName)) {
            const trimmed: string = toTrim.replace(savedName, '');
            setShipInfo(trimmed);
        }
    }, [cellStorage]);

    // Logic for deciding what players ship has been damaged for display
    useEffect(() => {
        if (!damageCheck.includes(savedName)) {
            setEnemyShipDamage(enemyShipDamage + damageCheck.slice(0, 2))
        }
        else {
            setShipDamage(shipDamage + damageCheck.slice(0, 2))
        }
    }, [damageCheck]);

    // References for states to ensure up-to-date information
    const gameFlashSave = useRef(gameFlash);

    const roomNumberSave = useRef(passwordEntry);

    const enemyShipsRemainingSave = useRef(enemyShipsRemaining);

    const leaderBoardSave = useRef(leaderBoard);

    const playerNameSave = useRef(savedName);

    const player2NameSave = useRef(player2Name);

    const chatStorageSave = useRef(chatStorage);

    useEffect(() => {
        gameFlashSave.current = gameFlash
    }, [chat, gameFlash]);

    useEffect(() => {
        leaderBoardSave.current = leaderBoard
    }, [leaderBoard]);

    useEffect(() => {
        roomNumberSave.current = passwordEntry
    }, [passwordEntry]);

    useEffect(() => {
        playerNameSave.current = savedName
    }, [playerName, savedName, nameValidated]);

    useEffect(() => {
        chatStorageSave.current = chatStorage
    }, [chat]);

    useEffect(() => {
        enemyShipsRemainingSave.current = enemyShipsRemaining
    }, [chat]);

    useEffect(() => {
        player2NameSave.current = player2Name
    }, [player2Name]);

    // Allows for text to be sent to an input using the enter key
    const handleChatEnterPress = (e:any) => {
        if (e.key === 'Enter') {
            chatSend()
        }
    }

    const handleAuthEnterPress = (e:any) => {
        if (e.key === 'Enter') {
            auth()
        }
    }

    const handleSaveNameEnterPress = (e:any) => {
        if (e.key === 'Enter') {
            saveName()
        }
    }

    const handleBugReportEnterPress = (e:any) => {
        if (e.key === 'Enter') {
            sendBugReport()
        }
    }

    // Checks a players name has been validated as correct
    const nameValidation = (message: any) => {
        if (message.includes(playerNameSave.current)) { 
            setNameValidated(true);}
    }
    
    // Checks a room number is long enough and if so sends it to the backend
    const auth = () => {
        if (password.length < 4) {
            stompClient.send("/app/globalChat", {}, JSON.stringify("Admin: Sorry room numbers must be 4 numbers long!"));
        }
        else if (password.length > 4) {
            stompClient.send("/app/globalChat", {}, JSON.stringify("Admin: Sorry room numbers must be 4 numbers long!"));
        }
        else {
            setPasswordEntry(password)
            roomNumberSave.current = passwordEntry
            stompClient.send("/app/room", {}, JSON.stringify(password + playerNameSave.current));
            setLoading(true)
        }
    }

    // Sorts player information for display
    const sortPlayers = () => {
        if (player1Data.includes(playerNameSave.current)) {
            setPlayer1Data(player1Data)
            setPlayer2Data(player2Data)
            setPlayer2Name(player2Data)
        }
        else if (player2Data.includes(playerNameSave.current)) {
            setPlayer1Data(player2Data)
            setPlayer2Data(player1Data)
            setPlayer2Name(player1Data)
        }
    }

    // Generates a random room number
    const generate = () => {
        const randomNumber = Math.floor(Math.random() * 10000)
        const roomNumber = randomNumber.toString().padStart(4, "0");
        setPassword(roomNumber)
        setPasswordEntry(roomNumber)
        roomNumberSave.current = roomNumber
        setLoading(true)
        stompClient.send("/app/room", {}, JSON.stringify(roomNumber + playerNameSave.current));
    }

    // Checks a players name is within the character limits and if so sends it to the backend and starts the game creation process
    const saveName = () => {
        if (playerName.length < 5 || playerName.length > 12) {
            stompClient.send("/app/globalChat", {}, JSON.stringify("Admin: Sorry usernames must be between 5 and 12 characters long!"));
        }
        else {
            setSaveName(playerName);
            stompClient.send("/app/name", {}, JSON.stringify(playerName));
            setReady("ready");
            setLoading(true)
        }
    }

    // Sends chat to either the lobby or the game in process
    const chatSend = () => {
        if (chatEntry === "") {
            return;
        }
        if (gameFlashSave.current === 1 && nameValidated == true) {
            stompClient.send("/app/globalChat", {}, JSON.stringify("[LOBBY] " + playerNameSave.current + ": " + chatEntry));}
        else if (gameFlashSave.current === 1 && nameValidated == false) {
            stompClient.send("/app/globalChat", {}, JSON.stringify("[LOBBY] Guest: " + chatEntry));}
        else {
            stompClient.send("/app/chat", {}, JSON.stringify(passwordEntry + playerNameSave.current + ": " + chatEntry));}
        setChatEntry("")
    }

    // Parses data that is needed but is not intended for display, such game startup info or if a player has used the restart button
    const hiddenParse = (message: any) => {
        if (message.includes("Server: Room saved!")) {
            setRoomSaved(true);
        console.log("Room saved on this client")}
        if (message.includes("Server: Room synced")) {
            setRoomSynced(true);
            console.log("Room synced on this client!")}
        if (message.includes("Player left") && (!player2NameSave.current.includes("Computer")) && !message.includes(playerNameSave.current)) {
            setPlayerLeft(0)}
    }

    // Parses chat data to ensure it is unique (random chat tokens are generated from the backend) and uses ship destroyed messages to check how many ships your opponent has lost
    const chatParse = (message: any) => {
        if (message === (chatStorageSave)){
            return;
        }
        let newMessage: string = message.body.slice(16, -2);
        if (newMessage.includes(roomNumberSave.current) && roomNumberSave.current.length > 0) {
            if (newMessage.includes(": You destroyed my") && !newMessage.includes(playerNameSave.current))
                {setEnemyShipsRemaining(enemyShipsRemainingSave.current -1)}
            newMessage = message.body.slice(20, -2);
            setChat((prevChat) => {
            const updatedChat = [...prevChat, newMessage];
            return updatedChat.slice(-10);
            });
        };
        setTimeout(() => {setChatStorage(message);
        }, 50);
    }
    
    // Parses global chat data to ensure it is unique (random chat tokens are generated from the backend)
    const globalChatParse = (message: any) => {
        if (message === (chatStorageSave)){
            return;
        }
        let newMessage: string = message.body.slice(16, -2);
        if (gameFlashSave.current === 1) {
            setChat((prevChat) => {
            const updatedChat = [...prevChat, newMessage];
            return updatedChat.slice(-10);
        });
        };
        setTimeout(() => {setChatStorage(message);
        }, 50);
    }

    // Begins the restart process to purge information not needed from the database connected to the backend
    const restart = () => {
        if (playerNameSave.current != "name") {
        stompClient.send("/app/restart", {}, JSON.stringify(playerNameSave.current));}
        if (player2Name.includes("Computer")) {
        stompClient.send("/app/restart", {}, JSON.stringify(player2NameSave.current));}
        reload();
    }

    const reload = () => {
        location.reload();
    }

    // Trigger for conditional styling of the server status
    const serverStatusStyle = () => {
        if (player1Data === "Player 1")
            return
        else {
            return "serverStatus"
        }
    }

    // Starts the process of beginning a game against a computer opponent
    const playVsComputer = () => {
        const randomNumber = Math.floor(Math.random() * 9000) + 1000;
        const roomNumber = randomNumber.toString().padStart(4, "0");
        setPasswordEntry(roomNumber)
        setPassword(roomNumber)
        stompClient.send("/app/computer", {}, JSON.stringify(roomNumber + playerNameSave.current));
        setLoading(true)
    }
    
    // Trigger for displaying the bug report entry
    const bugReporting = () => {
        if (bugReport === 0){
        setBugReport(1)}
        else
        setBugReport(0)
    }

    // Trigger for displaying the pre-game startup information
    const startUpFlashScreen = () => {
        if (startUpFlash === 0){
        setStartUpFlash(1)}
        else
        setStartUpFlash(0);
    }

    // Trigger for displaying the game start information
    const gameFlashScreen = () => {
        if (gameFlash === 1){
        setGameFlash(0);
        sortPlayers()}
    }

    // Formats bug report information for sending tp the database connected to the backend and sends a message to confirm it has been sent
    const sendBugReport = () => {
        stompClient.send("/app/bugReport", {}, JSON.stringify("DATE: " + Date() + ", USER: " + savedName + ", REPORT: "  + bugReportInput));
        if (roomNumberSave.current != "No Password") {
            stompClient.send("/app/chat", {}, JSON.stringify(roomNumberSave.current + "Admin: Thank you, your message has been sent to the developer"));}
        else {
        stompClient.send("/app/globalChat", {}, JSON.stringify("Admin: Thank you, your message has been sent to the developer"));}
        setBugReport(0);
        setBugReportInput("");
    }

    // Setting turn numbers for display
    useEffect(() => {
        setTurnNumber(turnNumber + 1)
    }, [turn])

    // Bug report entry
    const bugReportingRender = () => {
        return (
        <div className="bugReportPageFade">
            <div className="bugReportOuter">
                <div className="bugReport">
                    <div className="cancelBox">
                        <button className="button" onClick={bugReporting}>X</button>
                    </div>
                    <h3>Please write your bug report (or message) in as much detail as possible</h3>
                    <input 
                    className="bugReportInputBox" 
                    name="room" 
                    value={bugReportInput} 
                    onChange={(e) => setBugReportInput(e.target.value)}
                    onKeyDown={handleBugReportEnterPress}
                    ></input><br />
                        <button className="button" onClick={sendBugReport}>Send</button>
                </div>
            </div>
        </div>
        )
    }

    // Pre-game startup information
    const startUpFlashRender = () => {
        return (
        <div className="bugReportPageFade">
            <div className="bugReportOuter">
                <div className="gameFlash">
                <h3>Welcome to Solar Fury! A single and multiplayer battleship game with a sci-fi style! <br />
                    <div className="gameFlashBody">
                    <br />
                    To get started, enter a name in the prompt, and then you have the option of either entering a room code if a friend has started a room, creating a new room code or randomly generating one. <br />
                    <br />
                    When the code is entered for another persons room you will join them in that game room, alternatively if you are creating the room, simply share the code with the other player. <br />
                    <br />
                    If you wish, you can play against the computer by selecting that option, be forewarned however, the computer is no pushover!<br />
                    <br />
                    Your username is saved in the database, so you can return and continue playing and leveling up by re-entering that username.
                    </div>
                    </h3>
                        <button className="button" onClick={startUpFlashScreen}>Ok</button>
                </div>
            </div>
        </div>
        )
    }

    // Game start information
    const gameFlashRender = () => {
        return (
        <div className="bugReportPageFade">
            <div className="bugReportOuter">
                <div className="gameFlash">
                <h3>Time to play! <br />
                    <div className="gameFlashBody">
                    <br />
                    First of all, place your ships by clicking them from the left selection, and then click two spaces on your grid to place them,
                    the ships will then autocomplete in the direction you clicked, alternatively click "Random Placement" to have the computer place your ships for you.
                    Once all your ships are placed, click "Ready", once both players are ready the match will begin! <br />
                    <br />press res
                    The first player will be picked randomly, then click on your opponent's board on your turn to shoot at their ships. The first player to destroy all their
                    opponents' ships will be the winner! And you will gain a level that will be shown on the leaderboard if you are in the top ten! <br />
                    <br />
                    You can chat to other players using the chat box at the bottom, if you wish to submit a bug report or leave a message for the developer, click the box on the top left. <br />
                    <br />
                    </div>
                    Good luck! And have fun!
                    </h3>
                        <button className="button" onClick={gameFlashScreen}>Start</button>
                </div>
            </div>
        </div>
        )
    }

    // Notify the player another player has used the restart button
    const playerLeftRender = () => {
        return (
        <div className="bugReportPageFade">
            <div className="bugReportOuter">
                <div className="gameFlash">
                <h3>The other player has left the game, press the restart button below to return to the start screen </h3><br />
                        <button className="button" onClick={restart}>Restart</button>
                </div>
            </div>
        </div>
        )
    }

    // Displays the games winner
    const gameEndRender = () => {
    return (
        <div className="bugReportPageFade">
            <div className="bugReportOuter">
                <div className="gameFlash">
                <h3>{winner} is the winner!<br />
                    <div className="gameFlashBody">
                    <br />
                        {winner} has won the game and gained a rank!
                        </div>
                    </h3>
                        <button className="button" onClick={restart}>Complete game</button>
                </div>
            </div>
        </div>
        )
    }

    // Displays help splashes
    const help = () => {
        if (roomSynced == false|| roomSaved == true) {
            startUpFlashScreen()
        }
        else {
            if (gameFlash === 1){
                setGameFlash(0);
            } else {
                setGameFlash(1);
            }
        }
    }

    return (
        <>
            {bugReport === 1 ? bugReportingRender() : null}
            {playerLeft === 0 ? playerLeftRender() : null}
            {serverStatus == true && startUpFlash === 1 ? startUpFlashRender() : null}

            <div className={serverStatusStyle()}>
                {loading === true ? <><LoadingSplash /></> : null}
                {serverStatus == true ? <h5>Connected to game server</h5> :
                    <>
                        <h5>Not connected to game server</h5><LoadingSplash />
                        <button className="button" onClick={() => setAttemptReconnect(attemptReconnect + 1)}>Reconnect</button></>
                }
                <h5>{serverMessageLog}</h5>
                <button className="button" onClick={restart}>Restart</button>
                <button className="button" onClick={bugReporting}>Bug Report/Msg Dev</button>
                <button className="button" onClick={help}>Help</button>
            </div>
            {roomSaved == true && roomSynced == false ?
                <div className="startupOuter">
                    <h3 >Room number: {passwordEntry}</h3 >
                    <h3>Waiting on other player.....</h3></div >
                : roomSynced == true ?
                    <div>
                        {gameFlash === 1 ? gameFlashRender() : null}
                        {winner != "unknown" ? gameEndRender() : null}
                        <Grids enemyShipsRemaining={enemyShipsRemaining} gameInfo={gameInfo} turnNumber={turnNumber} playerName={playerName} turn={turn} miss={miss} enemyMiss={enemyMiss} player2Name={player2Name}
                            placedShip={placedShip} player1Data={player1Data} setPlacedShip={setPlacedShip}
                            player2Data={player2Data} savedName={savedName} shipInfo={shipInfo}
                            shipDamage={shipDamage} enemyShipDamage={enemyShipDamage}
                            stompClient={stompClient} />
                    </div> : null}

            <StartUp roomSynced={roomSynced} roomSaved={roomSaved} handleAuthEnterPress={handleAuthEnterPress} handleSaveNameEnterPress={handleSaveNameEnterPress} handleChatEnterPress={handleChatEnterPress} player1Data={player1Data} nameValidated={nameValidated} playVsComputer={playVsComputer} chatEntry={chatEntry} ready={ready} password={password}
                setPassword={setPassword} auth={auth} generate={generate} playerName={playerName} chat={chat}
                saveName={saveName} chatSend={chatSend} setPlayerName={setPlayerName} setChatEntry={setChatEntry}
                leaderBoard={leaderBoard} />
        </>
    )
    }
    export default GameBoard