import * as C from "@chakra-ui/react"
import {useEffect, useState} from "react";
import Button from "../components/Button";
import {FaRegHandPaper, FaRegHandRock, FaRegHandScissors} from "react-icons/all";
import {useLocation, useNavigate} from "react-router-dom";
import socket from "../socket/socket";
import {Client, GameRes, ReadyState} from "../utils/types";
import {useToast} from "@chakra-ui/react";

const Room = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const toast = useToast()

    const [gameState, setGameState] = useState<number>(0)
    const [myClient, setMyClient] = useState<Client>({})
    const [yourClient, setYourClients] = useState<Client>()
    const [myReadyState, setMyReadyState] = useState<ReadyState>()
    const [yourReadyState, setYourReadyState] = useState<ReadyState>()
    const [myGesture, setMyGesture] = useState<number>(-1)
    const [yourGesture, setYourGesture] = useState<number>(-1)


    const handleLeave = () => {
        socket.emit('leaveRoom', location.pathname.split('/')[2])
        navigate('/list')
    }

    const handleReady = () => {
        socket.emit('gameReady')
    }

    const handleGesture = (gesture: number) => {
        socket.emit('gameGesture', gesture)
        setMyGesture(gesture)
    }

    useEffect(() => {
        socket.on('newConn', () => {
            console.log('newConn')
            handleLeave()
        })
        socket.emit('inRoom')
        socket.on('clients', (users: Client[]) => {
            let myIdx = 0
            users.forEach((curr, idx) => {
                if (curr.id === socket.id) {
                    myIdx = idx
                }
            })
            setMyClient(users[myIdx])
            setYourClients(users[1 - myIdx])
            if (users.length === 2) {
                setGameState(1)
            } else {
                setGameState(0)
                setMyReadyState({})
                setYourReadyState({})
                setMyGesture(-1)
                setYourGesture(-1)
            }
        })
        socket.on('gameReadyRes', (state: ReadyState[]) => {
            let myIdx = 0
            state.forEach((curr, idx) => {
                if (curr.id === socket.id) {
                    myIdx = idx
                }
            })
            setMyReadyState(state[myIdx])
            setYourReadyState(state[1 - myIdx])
            if (state[0]?.ready && state[1]?.ready) {
                setGameState(2)
            }
        })
        socket.on('gameGestureSend', () => {
            setYourGesture(0)
        })
        socket.on('gameGestureRes', (res: GameRes[]) => {
            let myIdx = 0
            res.forEach((curr, idx) => {
                if (curr.id === socket.id) {
                    myIdx = idx
                }
            })
            setYourGesture(res[1 - myIdx]?.gesture!)
            let flag = 0
            if (res[myIdx]?.gesture! === res[1 - myIdx]?.gesture!) {
                flag = 1
            } else if (
                (res[myIdx]?.gesture! === res[1 - myIdx]?.gesture! + 1) ||
                (res[myIdx]?.gesture! === 1 && res[1 - myIdx]?.gesture! === 3)
            ) {
                flag = 2
            }
            const status = ["error", "warning", "success"]
            const title = ["You Lose .", "Draw !", "You Win !"]
            toast({
                status: status[flag] as  "error" | "warning" | "success",
                title: title[flag],
                duration: 3000
            })
            socket.emit('resetState')
            setTimeout(() => {
                setGameState(1)
                setMyReadyState({})
                setYourReadyState({})
                setMyGesture(-1)
                setYourGesture(-1)
            }, 3000)
            return
        })
        return () => {
            socket.off('newConn')
            socket.off('clients')
            socket.off('gameReadyRes')
            socket.off('gameGestureSend')
            socket.off('gameGestureRes')
        }
    }, [])

    return <C.VStack h='85vh' w='100vw' p='10'>
        <Button px='6' py='2' alignSelf='flex-start' onClick={handleLeave} pos='absolute'>
            Back
        </Button>
        <C.HStack w='full' mt={{base: '20', lg: '0'}}>
            <C.Center flex='1'>
                <C.HStack bgColor='whiteAlpha.600' py='2' px='5' borderRadius='lg' boxShadow='sm'>
                    <C.Avatar name={myClient?.name} size='sm'/>
                    <C.Text fontSize='xl'>{myClient?.name}</C.Text>
                </C.HStack>
            </C.Center>
            <C.Box py='2' px={{base: '10',lg: '20'}} bgColor='blue.800' color='white' fontWeight='bold' borderRadius='full'>
                Room {location.pathname.split('/')[2]}
            </C.Box>
            <C.Center flex='1'>
                <C.HStack bgColor='whiteAlpha.600' py='2' px='5' borderRadius='lg' boxShadow='sm'>
                    <C.Avatar name={yourClient?.name} size='sm'/>
                    <C.Text fontSize='xl'>{yourClient?.name}</C.Text>
                </C.HStack>
            </C.Center>
        </C.HStack>
        <C.Flex flex='1' w='full'>
            <C.Center flex='1'>
                {gameState === 1 && myReadyState?.ready && <C.Text fontSize='5xl'>Ready !</C.Text>}
                {gameState === 2 && <GameIcon state={myGesture} dir={true}/>}
            </C.Center>
            <C.Center flex='1' w='0'>
                <C.Box w='20rem' pos='absolute' aspectRatio='1' bgColor='bgShadow' borderRadius='full' zIndex='-1'/>
            </C.Center>
            <C.Center flex='1'>
                {gameState === 1 && yourReadyState?.ready && <C.Text fontSize='5xl'>Ready !</C.Text>}
                {gameState === 2 && <GameIcon state={yourGesture} dir={false}/>}
            </C.Center>
        </C.Flex>
        {
            gameState === 0 && <Button px='20' py='4'>
                Waiting player...
            </Button>
        }
        {
            gameState === 1 && <Button px='20' py='4' onClick={handleReady}>
                Ready !
            </Button>
        }
        {
            gameState === 2 && <C.HStack spacing='10'>
                <Button px='9' py='8' onClick={() => handleGesture(1)} isActive={myGesture === 1}>
                    <C.Icon as={FaRegHandScissors} fontSize='4xl' transform='rotate(90deg)'/>
                </Button>
                <Button px='9' py='8' onClick={() => handleGesture(2)} isActive={myGesture === 2}>
                    <C.Icon as={FaRegHandRock} fontSize='4xl'/>
                </Button>
                <Button px='9' py='8' onClick={() => handleGesture(3)} isActive={myGesture === 3}>
                    <C.Icon as={FaRegHandPaper} fontSize='4xl'/>
                </Button>
            </C.HStack>
        }
    </C.VStack>
}

const GameIcon = ({state, dir}: { state: number, dir: boolean }) => {

    if (state === -1) {
        return <C.Text fontSize='8xl'>?</C.Text>
    } else if (state === 0) {
        return <C.Icon className='gestureShake' as={FaRegHandRock} color='gray' fontSize='10rem'/>
    } else if (state === 1) {
        return <C.Icon as={FaRegHandScissors} fontSize='10rem' transform={dir ? 'rotate(180deg)' : ''}/>
    } else if (state === 2) {
        return <C.Icon as={FaRegHandRock} fontSize='10rem' transform={dir ? 'rotate(90deg)' : 'rotate(-90deg)'}/>
    } else {
        return <C.Icon as={FaRegHandPaper} fontSize='10rem' transform={dir ? 'rotate(90deg)' : 'rotate(-90deg)'}/>
    }
}

export default Room
