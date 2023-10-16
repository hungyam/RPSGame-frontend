import * as C from "@chakra-ui/react"
import Button from "../components/Button"
import {useNavigate} from "react-router-dom"
import img from "../home.png"

const Home = () => {
    const navigate = useNavigate()

    return <C.Center h='90vh' w='100vw' px='10' py='32'>
        <C.VStack spacing='10' h='full'>
            <C.Heading as='h1' fontSize='6xl'>
                Rock Paper Scissors
            </C.Heading>
            <C.Box flex='1' h='0'>
                <C.Image src={img} h='full'/>
            </C.Box>
            <Button px='20' py='3' onClick={() => {
                navigate('./list')
            }}>
                Start
            </Button>
        </C.VStack>
    </C.Center>
}

export default Home
