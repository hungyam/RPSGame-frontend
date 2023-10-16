import * as C from "@chakra-ui/react"
import React, {useContext, useEffect, useState} from "react";
import {useDisclosure} from "@chakra-ui/react";
import {UserContext} from "../App";
import socket from "../socket/socket";

const Login: React.FC = () => {
    const [name, setName] = useState<string>("")
    const {isOpen, onOpen, onClose} = useDisclosure()
    const user = useContext(UserContext)

    useEffect(() => {
        if (!localStorage.getItem("name")) {
            onOpen()
        } else {
            user.setName(localStorage.getItem("name"))
            socket.emit('setName', localStorage.getItem("name"))
            socket.on('setNameRes', () => {})
        }
    }, [])

    const handleSubmit = () => {
        localStorage.setItem("name", name)
        user.setName(name)
        socket.emit('setName', name)
        socket.on('setNameRes', (state) => {
            if (state) {
                onClose()
            }
        })
    }

    return <C.Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} isCentered>
        <C.ModalOverlay />
        <C.ModalContent>
            <C.ModalHeader>Set Your Name</C.ModalHeader>
            <C.ModalBody>
                <C.Input placeholder='Your name' value={name} onChange={(e) => setName(e.target.value)}/>
            </C.ModalBody>
            <C.ModalFooter justifyContent='center'>
                <C.Button colorScheme='pink' variant='outline' onClick={handleSubmit} isDisabled={name === ""}>
                    Submit
                </C.Button>
            </C.ModalFooter>
        </C.ModalContent>
    </C.Modal>
}

export default Login
