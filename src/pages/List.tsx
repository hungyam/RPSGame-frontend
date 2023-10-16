import * as C from "@chakra-ui/react"
import {useEffect, useState, useRef, useContext} from "react";
import socket from "../socket/socket";
import Button from "../components/Button";
import {useNavigate} from "react-router-dom";
import {useDisclosure} from "@chakra-ui/react";
import {CgGames} from "react-icons/all";
import {Room} from "../utils/types"
import {UserContext} from "../App";

const List = () => {
    const user = useContext(UserContext)
    const navigate = useNavigate()
    const cancelRef = useRef(null)
    const [rooms, setRooms] = useState<Room[]>([])
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleNewRoom = () => {
        const ran = Math.floor(Math.random() * 998 + 1)
        socket.emit('toRoom', rooms.length + ran)
        socket.on('toRoomRes', (state) => {
            if (state) {
                navigate('/room/' + (rooms.length + ran))
            }
        })
        onClose()
    }

    useEffect(() => {
        socket.emit("toHall", user.name)
        socket.on("rooms", (arg) => {
            setRooms(arg)
        })
        return () => {
            socket.off('rooms')
        }
    },[])

    return <C.VStack h='90vh' w='100vw' p='10' spacing='10'>
        <C.HStack w='full'>
            <Button px='6' py='2' onClick={() => navigate('/')}>
                Back
            </Button>
            <C.Spacer/>
        </C.HStack>
        {rooms.map((curr, idx) => (
            <Item key={idx} curr={curr}/>
        ))}
        <Button px='10' py='3' onClick={onOpen}>
            New Room
        </Button>
        <C.AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <C.AlertDialogOverlay>
                <C.AlertDialogContent>
                    <C.AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Create a new room
                    </C.AlertDialogHeader>
                    <C.AlertDialogBody>
                        Are you sure?
                    </C.AlertDialogBody>
                    <C.AlertDialogFooter>
                        <C.Button colorScheme='purple' onClick={handleNewRoom}>
                            Yes
                        </C.Button>
                        <C.Button  onClick={onClose} ml={3} ref={cancelRef}>
                            Cancel
                        </C.Button>
                    </C.AlertDialogFooter>
                </C.AlertDialogContent>
            </C.AlertDialogOverlay>
        </C.AlertDialog>
    </C.VStack>
}

const Item = ({curr}: {curr: Room}) => {
    const navigate = useNavigate()
    const handleClick = () => {
        if(curr.client.length === 2) {
            return
        }
        socket.emit('toRoom', curr.room)
        socket.on('toRoomRes', (state) => {
            if (state) {
                navigate('/room/' + curr.room)
            }
        })
    }

    return <C.VStack w='80%' maxW='600px' bgColor='whiteAlpha.600' pb='5' boxShadow='sm'
                     borderRadius='lg' onClick={handleClick} cursor={curr.client.length === 2 ? 'not-allowed': 'pointer'}>
        <C.Box py='2' px='20' mx='auto' bgColor='blue.800' color='white' display='inline-block'
               fontWeight='bold' borderRadius='full' pos='relative' top='-3'>
            {'Room ' + curr.room}
        </C.Box>
        <C.Flex w='full'>
            <C.VStack flex='1'>
                <C.Avatar name={curr.client[0]}/>
                <C.Text fontWeight='bold'>
                    {curr.client[0]}
                </C.Text>
            </C.VStack>
            <C.Center flex='1'>
                <C.Icon as={CgGames} fontSize='6xl'/>
            </C.Center>
            <C.VStack flex='1'>
                <C.Avatar name={curr.client[1]}/>
                <C.Text fontWeight='bold'>
                    {curr.client[1]}
                </C.Text>
            </C.VStack>
        </C.Flex>
    </C.VStack>
}

export default List
